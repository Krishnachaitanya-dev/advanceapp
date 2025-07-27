
import React, { useState } from 'react';
import AppLayout from './AppLayout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, ChevronDown, CalendarIcon } from 'lucide-react';
import { useSupabaseAddresses } from '@/hooks/useSupabaseAddresses';
import { useOrderCreation } from '@/hooks/useOrderCreation';
import AddressCard from './address/AddressCard';
import { Address } from '@/types/address';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Service {
  id: string;
  name: string;
  price: string;
  color: string;
}

// Helper function to convert SupabaseAddress to Address
const convertSupabaseAddressToAddress = (supabaseAddr: any): Address => {
  return {
    id: supabaseAddr.id,
    doorNo: supabaseAddr.door_no,
    street: supabaseAddr.street,
    landmark: supabaseAddr.landmark,
    city: supabaseAddr.city,
    state: supabaseAddr.state,
    pincode: supabaseAddr.pincode,
    phone: supabaseAddr.phone,
    name: supabaseAddr.name,
    label: supabaseAddr.label,
    coordinates: supabaseAddr.coordinates,
    isDefault: supabaseAddr.is_default,
    createdAt: new Date(supabaseAddr.created_at),
    updatedAt: new Date(supabaseAddr.updated_at)
  };
};

const PickupDetailsPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [instructions, setInstructions] = useState('');
  const [showAddressSelection, setShowAddressSelection] = useState(false);
  const {
    toast
  } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    addresses,
    isLoading: addressesLoading
  } = useSupabaseAddresses();
  const {
    createOrder,
    isCreating
  } = useOrderCreation();
  const {
    selectedServices,
    total
  } = location.state || {
    selectedServices: [],
    total: 0
  };

  // Get default address and convert to Address type
  const selectedSupabaseAddress = addresses.find(addr => addr.is_default) || addresses[0];
  const selectedAddress = selectedSupabaseAddress ? convertSupabaseAddressToAddress(selectedSupabaseAddress) : null;
  const timeSlots = ['9:00 AM - 11:00 AM', '11:00 AM - 1:00 PM', '1:00 PM - 3:00 PM', '3:00 PM - 5:00 PM', '5:00 PM - 7:00 PM'];

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast({
        title: "Address Required",
        description: "Please select a delivery address",
        variant: "destructive"
      });
      return;
    }
    if (!selectedDate) {
      toast({
        title: "Date Required",
        description: "Please select a pickup date",
        variant: "destructive"
      });
      return;
    }
    if (!selectedSlot) {
      toast({
        title: "Time Slot Required",
        description: "Please select a pickup time slot",
        variant: "destructive"
      });
      return;
    }

    // Prepare order data
    const orderData = {
      pickup_date: selectedDate.toISOString().split('T')[0],
      pickup_time: selectedSlot,
      special_instructions: instructions,
      address_id: selectedAddress.id,
      estimated_total: total,
      items: selectedServices.map((service: Service) => ({
        service_id: service.id,
        item_name: service.name,
        quantity: 1,
        estimated_weight: 1
      }))
    };
    console.log('Submitting order data:', orderData);
    const result = await createOrder(orderData);
    if (result.success) {
      navigate('/orders');
    }
  };

  const handleAddressSelect = (address: any) => {
    setShowAddressSelection(false);
  };

  if (addressesLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-blue-600 text-lg">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-4 py-2">
        {/* Back Button */}
        

        {/* Address Selection */}
        <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-4 border border-green-300">
          <h3 className="text-sm font-medium text-green-800 mb-3 flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            📍 Delivery Address
          </h3>
          
          {selectedAddress ? <div className="space-y-3">
              <AddressCard address={selectedAddress} onEdit={() => {}} onDelete={() => {}} onSetDefault={() => {}} showActions={false} />
              
              {addresses.length > 1 && <Button variant="outline" onClick={() => setShowAddressSelection(!showAddressSelection)} className="w-full border-green-400 text-green-700 hover:bg-green-50 flex items-center justify-between">
                  <span>Change Address</span>
                  <ChevronDown size={16} className={`transition-transform ${showAddressSelection ? 'rotate-180' : ''}`} />
                </Button>}
            </div> : <div className="text-center py-4 bg-white rounded-lg">
              <MapPin size={32} className="mx-auto text-green-500 mb-2" />
              <p className="text-green-700 mb-3">No address found</p>
              <Button onClick={() => navigate('/address-management')} className="bg-green-500 hover:bg-green-600 text-white">
                Add Address
              </Button>
            </div>}

          {/* Address Selection Dropdown */}
          {showAddressSelection && addresses.length > 1 && <div className="mt-3 space-y-2 max-h-64 overflow-y-auto bg-white rounded-lg p-3">
              <p className="text-sm text-green-700 mb-2">Select a different address:</p>
              {addresses.filter(addr => addr.id !== selectedSupabaseAddress?.id).map(address => <div key={address.id} className="cursor-pointer">
                    <AddressCard address={convertSupabaseAddressToAddress(address)} onEdit={() => {}} onDelete={() => {}} onSetDefault={() => {}} showActions={false} onClick={handleAddressSelect} />
                  </div>)}
            </div>}
        </div>

        {/* Minimum Order Information */}
        {total < 500 && <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl p-4 border border-yellow-300">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-yellow-900 text-sm font-bold">!</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-yellow-800 mb-1">
                  Minimum Order Information
                </h3>
                <p className="text-sm text-yellow-700">
                  Our recommended minimum order value is ₹500 🚀
                </p>
              </div>
            </div>
          </div>}

        {/* Pickup Date */}
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-4 border border-purple-300">
          <h3 className="text-sm font-medium text-purple-800 mb-3 flex items-center">
            📅 Select Pickup Date
          </h3>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white border-purple-300 text-purple-800 hover:bg-purple-50",
                    !selectedDate && "text-purple-600"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) =>
                    date < new Date() || date > new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000)
                  }
                  initialFocus
                  className="p-3 pointer-events-auto bg-white text-slate-800"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Time Slots */}
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4 border border-blue-300">
          <h3 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
            ⏰ Select Time Slot
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {timeSlots.map(slot => <Button key={slot} type="button" className={`py-3 rounded-lg transition-all duration-200 ${selectedSlot === slot ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform scale-105' : 'bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 hover:scale-102'}`} onClick={() => setSelectedSlot(slot)}>
                {slot}
              </Button>)}
          </div>
        </div>

        {/* Special Instructions */}
        <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl p-4 border border-pink-300">
          <h3 className="text-sm font-medium text-pink-800 mb-3 flex items-center">
            📝 Special Instructions (Optional)
          </h3>
          <Textarea placeholder="Any specific instructions for pickup? (e.g., Gate number, specific timing, etc.)" value={instructions} onChange={e => setInstructions(e.target.value)} className="resize-none bg-white border-pink-300 text-pink-800 placeholder:text-pink-600 rounded-lg min-h-[100px] focus:bg-white transition-all duration-200" />
        </div>

        {/* Order Summary */}
        <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl p-4 border border-orange-300">
          <h3 className="text-sm font-medium text-orange-800 mb-3 flex items-center">
            📋 Order Summary
          </h3>
          <div className="space-y-2">
            {selectedServices.map((service: Service) => <div key={service.id} className="flex justify-between bg-white rounded-lg p-3">
                <span className="text-orange-800 font-medium">{service.name}</span>
                <span className="text-orange-700 font-bold">{service.price}</span>
              </div>)}
            <div className="flex justify-between bg-orange-500 text-white rounded-lg p-3 font-bold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <div className="pb-4">
          <Button onClick={handlePlaceOrder} disabled={isCreating || !selectedAddress} className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-lg font-bold text-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
            {isCreating ? <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Placing Order...
              </div> : '🛒 Place Order'}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default PickupDetailsPage;
