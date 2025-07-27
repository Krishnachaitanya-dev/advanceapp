
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id: number;
  name: string;
  price: string;
  color: string;
  icon: any;
}

interface PickupDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedServices: Service[];
  total: number;
}

const PickupDetailsModal = ({ isOpen, onClose, selectedServices, total }: PickupDetailsModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [instructions, setInstructions] = useState('');
  const { toast } = useToast();

  const timeSlots = [
    '9:00 AM - 11:00 AM',
    '11:00 AM - 1:00 PM',
    '1:00 PM - 3:00 PM',
    '3:00 PM - 5:00 PM',
    '5:00 PM - 7: 00 PM'
  ];

  const handlePlaceOrder = () => {
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

    // Here you would handle the order submission
    toast({
      title: "Order Placed Successfully!",
      description: `Your pickup is scheduled for ${selectedDate.toDateString()} between ${selectedSlot}`
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Pickup Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pickup Date */}
          <div>
            <h3 className="text-base font-medium text-gray-700 mb-2">Select Pickup Date</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date() || date > new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000)}
              className="rounded-md border"
            />
          </div>

          {/* Time Slots */}
          <div>
            <h3 className="text-base font-medium text-gray-700 mb-2">Select Time Slot</h3>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <Button
                  key={slot}
                  type="button"
                  variant={selectedSlot === slot ? 'default' : 'outline'}
                  className={`text-sm ${selectedSlot === slot ? 'bg-blue-600' : 'border-gray-200'}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}
                </Button>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <h3 className="text-base font-medium text-gray-700 mb-2">Special Instructions (Optional)</h3>
            <Textarea
              placeholder="Any specific instructions for pickup?"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="resize-none"
            />
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="text-base font-medium text-gray-800 mb-2">Order Summary</h3>
            <div className="space-y-1">
              {selectedServices.map(service => (
                <div key={service.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{service.name}</span>
                  <span className="text-gray-800">{service.price}</span>
                </div>
              ))}
              <div className="border-t my-1 pt-1"></div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-blue-600">₹{total}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handlePlaceOrder} className="flex-1 bg-blue-600 hover:bg-blue-700">
            Place Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PickupDetailsModal;
