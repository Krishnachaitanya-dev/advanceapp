
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Loader2 } from 'lucide-react';
import SimpleMap from './SimpleMap';
import AddressLabelSelector from './AddressLabelSelector';
import { AddressFormData } from '@/types/address';

interface AddressFormProps {
  onSubmit: (data: AddressFormData, coordinates?: { lat: number; lng: number }) => Promise<void> | void;
  onCancel: () => void;
  initialData?: AddressFormData;
  isLoading?: boolean;
  onCoordinatesChange?: (coords: { lat: number; lng: number }) => void;
  initialCoordinates?: { lat: number; lng: number } | null;
}

const AddressForm = ({ 
  onSubmit, 
  onCancel, 
  initialData, 
  isLoading = false,
  onCoordinatesChange,
  initialCoordinates
}: AddressFormProps) => {
  const [formData, setFormData] = useState<AddressFormData>({
    doorNo: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    name: '',
    label: 'home',
    ...initialData
  });

  const [mapPosition, setMapPosition] = useState<{ lat: number; lng: number }>(() => {
    if (initialCoordinates) {
      return initialCoordinates;
    }
    // Default to Visakhapatnam, India
    return { lat: 17.6868, lng: 83.2185 };
  });

  const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: number; lng: number } | null>(
    initialCoordinates || null
  );

  // Update map position when initial coordinates change
  useEffect(() => {
    if (initialCoordinates) {
      setMapPosition(initialCoordinates);
      setSelectedCoordinates(initialCoordinates);
    }
  }, [initialCoordinates]);

  const handleInputChange = (field: keyof AddressFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressSelect = (address: any, coordinates?: { lat: number; lng: number }) => {
    console.log('Address selected from map:', address, 'Coordinates:', coordinates);
    
    // Update form data with the selected address
    setFormData(prev => ({
      ...prev,
      street: address.street || prev.street,
      city: address.city || prev.city,
      state: address.state || prev.state,
      pincode: address.pincode || prev.pincode,
      landmark: address.landmark || prev.landmark
    }));

    // Store coordinates if provided
    if (coordinates) {
      setSelectedCoordinates(coordinates);
      onCoordinatesChange?.(coordinates);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form with coordinates:', selectedCoordinates);
    // Pass the selected coordinates to the submit handler
    await onSubmit(formData, selectedCoordinates || undefined);
  };

  const handleCoordinatesUpdate = (coords: { lat: number; lng: number }) => {
    console.log('Coordinates updated:', coords);
    setMapPosition(coords);
    setSelectedCoordinates(coords);
    onCoordinatesChange?.(coords);
  };

  return (
    <div className="space-y-6">
      {/* Map Section */}
      <Card className="bg-white border-gray-200">
        <CardContent className="p-0">
          <SimpleMap 
            onAddressSelect={handleAddressSelect}
            initialPosition={mapPosition}
            onCoordinatesChange={handleCoordinatesUpdate}
          />
        </CardContent>
      </Card>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-slate-800">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-slate-700">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-white border-gray-300 text-slate-800 placeholder:text-slate-500"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-slate-700">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="bg-white border-gray-300 text-slate-800 placeholder:text-slate-500"
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-slate-800">Address Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="doorNo" className="text-slate-700">Door/Flat No *</Label>
              <Input
                id="doorNo"
                value={formData.doorNo}
                onChange={(e) => handleInputChange('doorNo', e.target.value)}
                className="bg-white border-gray-300 text-slate-800 placeholder:text-slate-500"
                placeholder="Enter door/flat number"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="street" className="text-slate-700">Street Address *</Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
                className="bg-white border-gray-300 text-slate-800 placeholder:text-slate-500"
                placeholder="Enter street address"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="landmark" className="text-slate-700">Landmark (Optional)</Label>
            <Input
              id="landmark"
              value={formData.landmark}
              onChange={(e) => handleInputChange('landmark', e.target.value)}
              className="bg-white border-gray-300 text-slate-800 placeholder:text-slate-500"
              placeholder="Enter nearby landmark"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city" className="text-slate-700">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="bg-white border-gray-300 text-slate-800 placeholder:text-slate-500"
                placeholder="Enter city"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="state" className="text-slate-700">State *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="bg-white border-gray-300 text-slate-800 placeholder:text-slate-500"
                placeholder="Enter state"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="pincode" className="text-slate-700">Pincode *</Label>
              <Input
                id="pincode"
                value={formData.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
                className="bg-white border-gray-300 text-slate-800 placeholder:text-slate-500"
                placeholder="Enter pincode"
                required
              />
            </div>
          </div>
        </div>

        {/* Address Label */}
        <div>
          <Label className="text-slate-700">Save as *</Label>
          <AddressLabelSelector
            selectedLabel={formData.label}
            onLabelChange={(label) => handleInputChange('label', label)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1 border-gray-300 text-slate-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" />
                Save Address
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
