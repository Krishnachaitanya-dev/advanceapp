
import React, { useState, memo } from 'react';
import AppLayout from './AppLayout';
import { useServices } from '@/hooks/useServices';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Shirt, Zap, Bed, Shield, Package, ShoppingBag, Sparkles, Check } from 'lucide-react';

const iconMap: {
  [key: string]: React.ComponentType<any>;
} = {
  'Shirt': Shirt,
  'Zap': Zap,
  'Bed': Bed,
  'Shield': Shield,
  'Package': Package,
  'shoes': ShoppingBag
};

// Enhanced 3D color schemes with vibrant gradients
const service3DStyles = [
  {
    gradient: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600',
    shadow: 'shadow-blue-500/25',
    icon: 'text-white',
    glow: 'shadow-blue-400/30'
  },
  {
    gradient: 'bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600',
    shadow: 'shadow-purple-500/25',
    icon: 'text-white',
    glow: 'shadow-purple-400/30'
  },
  {
    gradient: 'bg-gradient-to-br from-green-400 via-green-500 to-green-600',
    shadow: 'shadow-green-500/25',
    icon: 'text-white',
    glow: 'shadow-green-400/30'
  },
  {
    gradient: 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600',
    shadow: 'shadow-orange-500/25',
    icon: 'text-white',
    glow: 'shadow-orange-400/30'
  },
  {
    gradient: 'bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600',
    shadow: 'shadow-teal-500/25',
    icon: 'text-white',
    glow: 'shadow-teal-400/30'
  },
  {
    gradient: 'bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600',
    shadow: 'shadow-pink-500/25',
    icon: 'text-white',
    glow: 'shadow-pink-400/30'
  }
];

interface SelectedService {
  id: string;
  name: string;
  price: number;
  quantity: number;
  weight: number;
}

const ServicesPage = memo(() => {
  const { services, loading } = useServices();
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleServiceSelect = (service: any) => {
    const isSelected = selectedServices.find(s => s.id === service.id);
    
    if (isSelected) {
      const newSelectedServices = selectedServices.filter(s => s.id !== service.id);
      setSelectedServices(newSelectedServices);
    } else {
      const newService: SelectedService = {
        id: service.id,
        name: service.name,
        price: service.base_price_per_kg,
        quantity: 1,
        weight: 1
      };
      const newSelectedServices = [...selectedServices, newService];
      setSelectedServices(newSelectedServices);
    }
  };

  const getServiceStyle = (serviceId: string, index: number) => {
    const baseStyle = service3DStyles[index % service3DStyles.length];
    const isSelected = selectedServices.some(s => s.id === serviceId);
    
    if (isSelected) {
      return `${baseStyle.gradient} ${baseStyle.shadow} ${baseStyle.glow} p-3 cursor-pointer transition-all duration-500 transform scale-105 hover:scale-110 rounded-xl shadow-2xl relative overflow-hidden border-2 border-white/50 group ring-2 ring-white/60`;
    }
    
    return `${baseStyle.gradient} ${baseStyle.shadow} ${baseStyle.glow} p-3 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-xl rounded-xl shadow-lg relative overflow-hidden border-2 border-white/20 group hover:border-white/40`;
  };

  const getIconStyle = (serviceId: string, index: number) => {
    return service3DStyles[index % service3DStyles.length].icon + ' drop-shadow-lg';
  };

  const isServiceSelected = (serviceId: string) => {
    return selectedServices.some(s => s.id === serviceId);
  };

  const calculateTotal = () => {
    return selectedServices.reduce((total, service) => {
      return total + (service.price * service.weight * service.quantity);
    }, 0);
  };

  const handleSchedulePickup = () => {
    if (selectedServices.length === 0) {
      toast({
        title: "No services selected",
        description: "Please select at least one service to proceed.",
        variant: "destructive"
      });
      return;
    }

    const total = calculateTotal();

    navigate('/pickup-details', {
      state: {
        selectedServices: selectedServices.map((service, index) => ({
          id: service.id,
          name: service.name,
          price: `₹${service.price}/kg`,
          color: service3DStyles[index % service3DStyles.length].icon
        })),
        total: total
      }
    });
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="h-full flex flex-col py-4">
          <div className="flex-1 grid grid-cols-2 gap-3 mb-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card p-4 animate-pulse rounded-xl h-32">
                <div className="w-8 h-8 bg-slate-200 rounded-full mx-auto mb-2"></div>
                <div className="h-3 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="h-full flex flex-col py-4">
        {/* Services Grid - Takes most space */}
        <div className="flex-1 grid grid-cols-2 gap-3 mb-4 overflow-y-auto">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon_name || 'Shirt'] || Shirt;
            
            return (
              <div 
                key={service.id} 
                onClick={() => handleServiceSelect(service)} 
                className={getServiceStyle(service.id, index)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* 3D highlight effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12"></div>
                
                {isServiceSelected(service.id) && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg z-20">
                    <Check className="w-3 h-3 text-green-500" />
                  </div>
                )}
                
                <div className="flex flex-col items-center text-center space-y-2 relative z-10 h-28">
                  <div className="rounded-lg p-2 bg-white/20 backdrop-blur-sm shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                    <IconComponent className={`w-4 h-4 transition-all duration-300 ${getIconStyle(service.id, index)}`} />
                  </div>
                  
                  <h3 className="font-bold text-xs leading-tight text-white drop-shadow-lg line-clamp-2">
                    {service.name}
                  </h3>
                  
                  <div className="font-bold text-sm text-white drop-shadow-lg bg-black/20 px-2 py-1 rounded-full">
                    ₹{service.base_price_per_kg}/kg
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Schedule Button - Fixed at bottom */}
        <div className="flex-shrink-0">
          <div className="glass-card p-3 bg-white/95 backdrop-blur-xl rounded-xl">
            <Button 
              onClick={handleSchedulePickup} 
              disabled={selectedServices.length === 0}
              className="w-full h-12 text-lg font-bold shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 hover:from-sky-600 hover:via-blue-600 hover:to-indigo-600 text-white rounded-xl transform transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Schedule Pickup 
              {selectedServices.length > 0 && (
                <span className="ml-2 bg-white/30 px-2 py-1 rounded-full text-sm font-bold">
                  {selectedServices.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
});

ServicesPage.displayName = 'ServicesPage';
export default ServicesPage;
