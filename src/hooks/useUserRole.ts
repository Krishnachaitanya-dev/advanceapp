
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'customer';
  created_at: string;
  updated_at: string;
}

// Cache for user profile data
let profileCache: UserProfile | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Helper function for development logging
const devLog = (message: string, ...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[useUserRole] ${message}`, ...args);
  }
};

export const useUserRole = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(profileCache);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isProfileCacheValid = useCallback(() => {
    return profileCache && 
           profileCache.id === user?.id && 
           (Date.now() - cacheTimestamp) < CACHE_DURATION;
  }, [user?.id]);

  const clearCache = useCallback(() => {
    profileCache = null;
    cacheTimestamp = 0;
  }, []);

  const updateCache = useCallback((newProfile: UserProfile) => {
    profileCache = newProfile;
    cacheTimestamp = Date.now();
  }, []);

  const fetchUserProfile = useCallback(async (forceRefresh = false) => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      clearCache();
      return;
    }

    // Use cache if valid and not forcing refresh
    if (!forceRefresh && isProfileCacheValid()) {
      devLog('Using cached profile for user:', user.email);
      setProfile(profileCache);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      devLog('Fetching fresh profile for user:', user.email);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        // If profile doesn't exist, create one with default customer role
        if (error.code === 'PGRST116') {
          devLog('Profile not found, creating new profile');
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email || '',
              name: user.user_metadata?.name || user.user_metadata?.full_name || null,
              role: 'customer'
            })
            .select()
            .single();

          if (createError) {
            setError('Failed to create user profile');
            setProfile(null);
            clearCache();
          } else {
            const mappedProfile: UserProfile = {
              id: newProfile.id,
              email: newProfile.email,
              name: newProfile.name,
              role: (newProfile.role as 'admin' | 'customer') || 'customer',
              created_at: newProfile.created_at,
              updated_at: newProfile.updated_at
            };
            setProfile(mappedProfile);
            updateCache(mappedProfile);
            setError(null);
          }
        } else {
          setError(error.message);
          setProfile(null);
          clearCache();
        }
      } else {
        // Map the database fields to our UserProfile interface with fallbacks
        const mappedProfile: UserProfile = {
          id: data.id,
          email: data.email,
          name: data.name,
          role: (data.role as 'admin' | 'customer') || 'customer',
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        setProfile(mappedProfile);
        updateCache(mappedProfile);
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch user profile');
      setProfile(null);
      clearCache();
    } finally {
      setLoading(false);
    }
  }, [user, isProfileCacheValid, clearCache, updateCache]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const updateUserRole = async (newRole: 'admin' | 'customer') => {
    if (!user || !profile) return { success: false, error: 'No user or profile found' };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Map the updated data with fallbacks
      const mappedProfile: UserProfile = {
        id: data.id,
        email: data.email,
        name: data.name,
        role: (data.role as 'admin' | 'customer') || 'customer',
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      setProfile(mappedProfile);
      updateCache(mappedProfile);
      return { success: true, data: mappedProfile };
    } catch (err) {
      return { success: false, error: 'Failed to update user role' };
    }
  };

  const refreshProfile = useCallback(() => {
    return fetchUserProfile(true);
  }, [fetchUserProfile]);

  const isAdmin = profile?.role === 'admin';
  const isCustomer = profile?.role === 'customer';

  return {
    profile,
    loading,
    error,
    isAdmin,
    isCustomer,
    role: profile?.role || 'customer',
    updateUserRole,
    refetch: refreshProfile,
    clearCache
  };
};
