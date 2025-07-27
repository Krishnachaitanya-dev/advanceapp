
import { useState, useEffect } from 'react';
import { Address, AddressFormData } from '@/types/address';
import { addressStorage } from '@/utils/addressStorage';
import { useToast } from '@/hooks/use-toast';

export const useAddresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadAddresses = () => {
    setIsLoading(true);
    try {
      const storedAddresses = addressStorage.getAll();
      setAddresses(storedAddresses);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load addresses",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addAddress = (formData: AddressFormData) => {
    try {
      const newAddress = addressStorage.save(formData);
      setAddresses(prev => [...prev, newAddress]);
      toast({
        title: "Success",
        description: "Address added successfully"
      });
      return newAddress;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add address",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateAddress = (id: string, updates: Partial<AddressFormData>) => {
    try {
      const updatedAddress = addressStorage.update(id, updates);
      if (updatedAddress) {
        setAddresses(prev => prev.map(addr => 
          addr.id === id ? updatedAddress : addr
        ));
        toast({
          title: "Success",
          description: "Address updated successfully"
        });
        return updatedAddress;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update address",
        variant: "destructive"
      });
    }
    return null;
  };

  const deleteAddress = (id: string) => {
    try {
      const success = addressStorage.delete(id);
      if (success) {
        setAddresses(prev => prev.filter(addr => addr.id !== id));
        toast({
          title: "Success",
          description: "Address deleted successfully"
        });
        return true;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive"
      });
    }
    return false;
  };

  const setDefaultAddress = (id: string) => {
    try {
      const success = addressStorage.setDefault(id);
      if (success) {
        setAddresses(prev => prev.map(addr => ({
          ...addr,
          isDefault: addr.id === id
        })));
        toast({
          title: "Success",
          description: "Default address updated"
        });
        return true;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set default address",
        variant: "destructive"
      });
    }
    return false;
  };

  const getDefaultAddress = () => {
    return addresses.find(addr => addr.isDefault) || addresses[0] || null;
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  return {
    addresses,
    isLoading,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getDefaultAddress,
    refetch: loadAddresses
  };
};
