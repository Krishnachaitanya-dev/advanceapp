import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// Helper function for development logging
const devLog = (message: string, ...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[usePersonalInformation] ${message}`, ...args);
  }
};

export const usePersonalInformation = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  const fetchPersonalInfo = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      devLog('Fetching profile for user:', user.id);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      devLog('Profile data:', profile, 'Error:', error);

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        devLog('Error fetching profile:', error);
      }

      // Always try to populate from available data
      const authName = user.user_metadata?.name || user.user_metadata?.full_name || '';
      const profileName = profile?.name || '';
      const finalName = profileName || authName;
      
      const nameParts = finalName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      setPersonalInfo({
        firstName,
        lastName,
        email: user.email || '',
        phone: profile?.phone || user.user_metadata?.phone || ''
      });

      devLog('Set personal info:', {
        firstName,
        lastName,
        email: user.email,
        phone: profile?.phone || user.user_metadata?.phone,
        profileName,
        authName
      });

    } catch (error: any) {
      devLog('Error fetching personal info:', error);
      toast.error('Failed to load personal information', {
        description: 'Please try refreshing the page',
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePersonalInfo = async (updatedInfo: PersonalInfo) => {
    if (!user) {
      toast.error('Authentication required', {
        description: 'Please log in to update your information',
        duration: 4000,
      });
      return;
    }

    // Validate required fields
    if (!updatedInfo.firstName.trim()) {
      toast.error('First name is required', {
        description: 'Please enter your first name',
        duration: 4000,
      });
      return;
    }

    setIsSaving(true);
    try {
      const fullName = `${updatedInfo.firstName.trim()} ${updatedInfo.lastName.trim()}`.trim();
      
      devLog('Updating profile with:', {
        id: user.id,
        name: fullName,
        phone: updatedInfo.phone.trim()
      });
      
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email || '',
          name: fullName,
          phone: updatedInfo.phone.trim(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      devLog('Update result:', data, 'Error:', error);

      if (error) {
        devLog('Error updating profile:', error);
        toast.error('Update failed', {
          description: `${error.message}`,
          duration: 5000,
        });
        throw error;
      }

      setPersonalInfo(updatedInfo);
      toast.success('Profile updated successfully! 🎉', {
        description: 'Your personal information has been saved',
        duration: 3000,
      });
      
      return true;
    } catch (error: any) {
      devLog('Error updating personal info:', error);
      toast.error('Something went wrong', {
        description: 'Please check your connection and try again',
        duration: 5000,
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchPersonalInfo();
  }, [user]);

  return {
    personalInfo,
    setPersonalInfo,
    isLoading,
    isSaving,
    updatePersonalInfo
  };
};
