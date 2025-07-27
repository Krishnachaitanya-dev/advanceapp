
import { Address, AddressFormData } from '@/types/address';

const STORAGE_KEY = 'user_addresses';

// Helper function for development logging
const devLog = (message: string, ...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[addressStorage] ${message}`, ...args);
  }
};

export const addressStorage = {
  getAll: (): Address[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      devLog('Error loading addresses:', error);
      return [];
    }
  },

  save: (address: AddressFormData): Address => {
    const addresses = addressStorage.getAll();
    const newAddress: Address = {
      ...address,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDefault: addresses.length === 0
    };

    addresses.push(newAddress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
    return newAddress;
  },

  update: (id: string, updates: Partial<AddressFormData>): Address | null => {
    const addresses = addressStorage.getAll();
    const index = addresses.findIndex(addr => addr.id === id);
    
    if (index === -1) return null;

    addresses[index] = {
      ...addresses[index],
      ...updates,
      updatedAt: new Date()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
    return addresses[index];
  },

  delete: (id: string): boolean => {
    const addresses = addressStorage.getAll();
    const filtered = addresses.filter(addr => addr.id !== id);
    
    if (filtered.length === addresses.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  setDefault: (id: string): boolean => {
    const addresses = addressStorage.getAll();
    const updated = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  },

  getDefault: (): Address | null => {
    const addresses = addressStorage.getAll();
    return addresses.find(addr => addr.isDefault) || addresses[0] || null;
  }
};
