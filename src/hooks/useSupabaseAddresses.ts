
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';
import type { Database } from '@/integrations/supabase/types';

type DatabaseAddress = Database['public']['Tables']['addresses']['Row'];

export interface SupabaseAddress {
  id: string;
  user_id: string;
  door_no: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  name?: string;
  label: 'home' | 'work' | 'other';
  coordinates?: { lat: number; lng: number; };
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddressFormData {
  door_no: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  name?: string;
  label: 'home' | 'work' | 'other';
}

// Helper function for development logging
const devLog = (message: string, ...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[useSupabaseAddresses] ${message}`, ...args);
  }
};

// Transform database address to our interface
const transformAddress = (dbAddress: DatabaseAddress): SupabaseAddress => {
  let coordinates: { lat: number; lng: number; } | undefined;
  
  if (dbAddress.coordinates) {
    try {
      if (typeof dbAddress.coordinates === 'object' && dbAddress.coordinates !== null) {
        const coords = dbAddress.coordinates as any;
        if (coords.lat && coords.lng) {
          coordinates = { lat: coords.lat, lng: coords.lng };
        }
      }
    } catch (error) {
      devLog('Error parsing coordinates:', error);
    }
  }

  return {
    id: dbAddress.id,
    user_id: dbAddress.user_id,
    door_no: dbAddress.door_no,
    street: dbAddress.street,
    landmark: dbAddress.landmark || undefined,
    city: dbAddress.city,
    state: dbAddress.state,
    pincode: dbAddress.pincode,
    phone: dbAddress.phone,
    name: dbAddress.name || undefined,
    label: dbAddress.label as 'home' | 'work' | 'other',
    coordinates,
    is_default: dbAddress.is_default,
    created_at: dbAddress.created_at,
    updated_at: dbAddress.updated_at
  };
};

export const useSupabaseAddresses = () => {
  const [addresses, setAddresses] = useState<SupabaseAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchAddresses = async () => {
    if (!user) {
      setAddresses([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        devLog('Error fetching addresses:', error);
        toast({
          title: "Error",
          description: "Failed to load addresses",
          variant: "destructive"
        });
        return;
      }

      const transformedAddresses = (data || []).map(transformAddress);
      setAddresses(transformedAddresses);
    } catch (error: any) {
      devLog('Error fetching addresses:', error);
      toast({
        title: "Error",
        description: "Failed to load addresses",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addAddress = async (formData: AddressFormData, coordinates?: { lat: number; lng: number; }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('addresses')
        .insert({
          user_id: user.id,
          door_no: formData.door_no,
          street: formData.street,
          landmark: formData.landmark,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: formData.phone,
          name: formData.name,
          label: formData.label,
          coordinates: coordinates ? JSON.stringify(coordinates) : null,
          is_default: addresses.length === 0 // First address is default
        })
        .select()
        .single();

      if (error) {
        devLog('Error adding address:', error);
        toast({
          title: "Error",
          description: "Failed to add address",
          variant: "destructive"
        });
        throw error;
      }

      const transformedAddress = transformAddress(data);
      setAddresses(prev => [transformedAddress, ...prev]);
      
      toast({
        title: "Success",
        description: "Address added successfully",
      });
    } catch (error: any) {
      devLog('Error adding address:', error);
      throw error;
    }
  };

  const updateAddress = async (id: string, formData: AddressFormData, coordinates?: { lat: number; lng: number; }) => {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .update({
          door_no: formData.door_no,
          street: formData.street,
          landmark: formData.landmark,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: formData.phone,
          name: formData.name,
          label: formData.label,
          coordinates: coordinates ? JSON.stringify(coordinates) : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        devLog('Error updating address:', error);
        toast({
          title: "Error",
          description: "Failed to update address",
          variant: "destructive"
        });
        throw error;
      }

      const transformedAddress = transformAddress(data);
      setAddresses(prev => prev.map(addr => addr.id === id ? transformedAddress : addr));
      
      toast({
        title: "Success",
        description: "Address updated successfully",
      });
    } catch (error: any) {
      devLog('Error updating address:', error);
      throw error;
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);

      if (error) {
        devLog('Error deleting address:', error);
        toast({
          title: "Error",
          description: "Failed to delete address",
          variant: "destructive"
        });
        throw error;
      }

      setAddresses(prev => prev.filter(addr => addr.id !== id));
      
      toast({
        title: "Success",
        description: "Address deleted successfully",
      });
    } catch (error: any) {
      devLog('Error deleting address:', error);
      throw error;
    }
  };

  const setDefaultAddress = async (id: string) => {
    try {
      // First, unset all default addresses
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user?.id);

      // Then set the selected address as default
      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', id);

      if (error) {
        devLog('Error setting default address:', error);
        toast({
          title: "Error",
          description: "Failed to set default address",
          variant: "destructive"
        });
        throw error;
      }

      setAddresses(prev => prev.map(addr => ({
        ...addr,
        is_default: addr.id === id
      })));
      
      toast({
        title: "Success",
        description: "Default address updated",
      });
    } catch (error: any) {
      devLog('Error setting default address:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  return {
    addresses,
    isLoading,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    refetch: fetchAddresses
  };
};
