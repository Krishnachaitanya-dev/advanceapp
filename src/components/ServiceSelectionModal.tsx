
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import PickupDetailsModal from './PickupDetailsModal';

interface Service {
  id: number;
  name: string;
  price: string;
  color: string;
  icon: any;
}

interface ServiceSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
}

const ServiceSelectionModal = ({ isOpen, onClose, services }: ServiceSelectionModalProps) => {
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [showPickupDetails, setShowPickupDetails] = useState(false);
  const { toast } = useToast();

  const handleServiceToggle = (serviceId: number) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const calculateTotal = () => {
    // Simple calculation - in real app you'd get quantities
    return selectedServices.length * 100; // Assuming average ₹100 per service
  };

  const handleProceed = () => {
    const total = calculateTotal();
    
    if (selectedServices.length === 0) {
      toast({
        title: "No services selected",
        description: "Please select at least one service to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (total < 500) {
      toast({
        title: "Minimum Order Value",
        description: "Minimum order value should be ₹500. Please add more services.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Services Selected!",
      description: `Total: ₹${total}. Proceeding to pickup details.`,
    });

    setShowPickupDetails(true);
  };

  const handleClosePickupDetails = () => {
    setShowPickupDetails(false);
    onClose();
    setSelectedServices([]);
  };

  return (
    <>
      <Dialog open={isOpen && !showPickupDetails} onOpenChange={onClose}>
        <DialogContent className="max-w-md mx-auto bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Select Services
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {services.map(service => (
              <div key={service.id} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200">
                <Checkbox
                  id={`service-${service.id}`}
                  checked={selectedServices.includes(service.id)}
                  onCheckedChange={() => handleServiceToggle(service.id)}
                />
                <div className="flex-1">
                  <label htmlFor={`service-${service.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">
                    {service.name}
                  </label>
                  <p className="text-sm text-gray-500">{service.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-gray-700">Estimated Total:</span>
              <span className="font-bold text-lg text-blue-600">₹{calculateTotal()}</span>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleProceed} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Proceed
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PickupDetailsModal 
        isOpen={showPickupDetails}
        onClose={handleClosePickupDetails}
        selectedServices={selectedServices.map(id => services.find(s => s.id === id)!)}
        total={calculateTotal()}
      />
    </>
  );
};

export default ServiceSelectionModal;
