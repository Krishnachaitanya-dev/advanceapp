import React, { useState } from 'react';
import AppLayout from './AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, MapPin, Home, Briefcase, Heart, Trash2, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseAddresses } from '@/hooks/useSupabaseAddresses';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddressForm from './address/AddressForm';
import type { AddressFormData } from '@/types/address';
import type { AddressFormData as SupabaseAddressFormData } from '@/hooks/useSupabaseAddresses';

const AddressManagementPage = () => {
  const { toast } = useToast();
  const { 
    addresses, 
    isLoading, 
    addAddress, 
    updateAddress, 
    deleteAddress, 
    setDefaultAddress 
  } = useSupabaseAddresses();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Transform from UI form data to Supabase format
  const transformToSupabaseFormat = (formData: AddressFormData): SupabaseAddressFormData => {
    return {
      door_no: formData.doorNo,
      street: formData.street,
      landmark: formData.landmark,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      phone: formData.phone,
      name: formData.name,
      label: formData.label
    };
  };

  // Transform from Supabase format to UI form data
  const transformFromSupabaseFormat = (address: any): AddressFormData => {
    return {
      doorNo: address.door_no,
      street: address.street,
      landmark: address.landmark || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      phone: address.phone,
      name: address.name || '',
      label: address.label as 'home' | 'work' | 'other'
    };
  };

  const getAddressIcon = (label: string) => {
    switch (label) {
      case 'home':
        return <Home className="w-5 h-5" />;
      case 'work':
        return <Briefcase className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  const getAddressColor = (label: string) => {
    switch (label) {
      case 'home':
        return 'text-green-600';
      case 'work':
        return 'text-blue-600';
      default:
        return 'text-purple-600';
    }
  };

  const formatAddress = (address: any) => {
    const parts = [
      address.door_no,
      address.street,
      address.landmark,
      address.city,
      address.state,
      address.pincode
    ].filter(Boolean);
    return parts.join(', ');
  };

  const handleAddAddress = async (formData: AddressFormData, coordinates?: { lat: number; lng: number }) => {
    try {
      setIsSubmitting(true);
      const supabaseFormData = transformToSupabaseFormat(formData);
      await addAddress(supabaseFormData, coordinates);
      setShowAddDialog(false);
      toast({
        title: "Success",
        description: "Address added successfully",
      });
    } catch (error) {
      console.error('Error adding address:', error);
      toast({
        title: "Error",
        description: "Failed to add address",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateAddress = async (formData: AddressFormData, coordinates?: { lat: number; lng: number }) => {
    if (!editingAddress) return;
    
    try {
      setIsSubmitting(true);
      const supabaseFormData = transformToSupabaseFormat(formData);
      await updateAddress(editingAddress.id, supabaseFormData, coordinates);
      setEditingAddress(null);
      toast({
        title: "Success",
        description: "Address updated successfully",
      });
    } catch (error) {
      console.error('Error updating address:', error);
      toast({
        title: "Error",
        description: "Failed to update address",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (addresses.length <= 1) {
      toast({
        title: "Cannot Delete",
        description: "You must have at least one address.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await deleteAddress(id);
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
  };

  const getInitialCoordinates = (address: any) => {
    if (address.coordinates) {
      return address.coordinates;
    }
    return null;
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading addresses...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-4 py-2">
        {/* Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-3">
            <Link to="/profile">
              <Button variant="ghost" size="sm" className="p-2 hover:bg-blue-100 rounded-full">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-slate-800">Address Management</h1>
          </div>
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Address
          </Button>
        </div>

        {/* Delivery Info */}
        <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-xl p-4 border border-blue-300">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Delivery Addresses</h3>
              <p className="text-sm text-slate-600">Manage your pickup and delivery locations</p>
            </div>
          </div>
        </div>

        {/* Address List */}
        <div className="space-y-3">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`p-3 rounded-lg bg-gradient-to-r from-blue-100 to-green-100 ${getAddressColor(address.label)}`}>
                    {getAddressIcon(address.label)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-slate-800 capitalize">{address.label}</h4>
                      {address.is_default && (
                        <span className="px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-medium rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-3">
                      {formatAddress(address)}
                    </p>
                    {address.name && (
                      <p className="text-xs text-slate-500 mb-2">Contact: {address.name} - {address.phone}</p>
                    )}
                    
                    <div className="flex items-center space-x-2 flex-wrap gap-2">
                      {!address.is_default && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(address.id)}
                          className="text-xs border-green-300 text-green-600 hover:bg-green-50"
                        >
                          <Heart className="w-3 h-3 mr-1" />
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditAddress(address)}
                        className="text-xs border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-xs border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Address Button */}
        {addresses.length === 0 && (
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-4 border-2 border-dashed border-green-300">
            <button 
              onClick={() => setShowAddDialog(true)}
              className="w-full flex items-center justify-center space-x-3 py-4 text-green-600 hover:text-green-700 transition-colors"
            >
              <Plus className="w-6 h-6" />
              <span className="font-medium">Add Your First Address</span>
            </button>
          </div>
        )}

        {/* Tips */}
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 border border-yellow-300">
          <h4 className="font-semibold text-slate-800 mb-2">📍 Tips</h4>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• Set your most frequently used address as default</li>
            <li>• Ensure addresses are accurate for timely delivery</li>
            <li>• Add landmark details for easier location</li>
          </ul>
        </div>
      </div>

      {/* Add Address Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-2 border-slate-300 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">Add New Address</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <AddressForm
              onSubmit={handleAddAddress}
              onCancel={() => setShowAddDialog(false)}
              isLoading={isSubmitting}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Address Dialog */}
      <Dialog open={!!editingAddress} onOpenChange={() => setEditingAddress(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-2 border-slate-300 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">Edit Address</DialogTitle>
          </DialogHeader>
          {editingAddress && (
            <div className="mt-4">
              <AddressForm
                onSubmit={handleUpdateAddress}
                onCancel={() => setEditingAddress(null)}
                initialData={transformFromSupabaseFormat(editingAddress)}
                initialCoordinates={getInitialCoordinates(editingAddress)}
                isLoading={isSubmitting}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default AddressManagementPage;
