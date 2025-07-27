
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Briefcase, MapPin, Edit, Trash2, Star } from 'lucide-react';
import { Address } from '@/types/address';

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  showActions?: boolean;
  onClick?: (address: Address) => void;
}

const labelConfig = {
  home: {
    icon: Home,
    color: 'text-green-600',
    bg: 'bg-green-100'
  },
  work: {
    icon: Briefcase,
    color: 'text-blue-600',
    bg: 'bg-blue-100'
  },
  other: {
    icon: MapPin,
    color: 'text-purple-600',
    bg: 'bg-purple-100'
  }
};

const AddressCard = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  showActions = true,
  onClick
}: AddressCardProps) => {
  const {
    icon: IconComponent,
    color,
    bg
  } = labelConfig[address.label];

  const handleCardClick = () => {
    if (onClick) {
      onClick(address);
    }
  };

  // Format address display
  const formatAddress = () => {
    const parts = [
      address.doorNo,
      address.street,
      address.city,
      address.state,
      address.pincode
    ].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <div 
      className={`bg-white rounded-xl p-4 border border-gray-200 shadow-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:border-blue-300' : ''
      }`} 
      onClick={handleCardClick}
    >
      {/* Header with label and default indicator */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${bg}`}>
            <IconComponent size={16} className={color} />
          </div>
          <div>
            <span className={`text-sm font-medium ${color} capitalize`}>
              {address.label}
            </span>
            {address.isDefault && (
              <div className="flex items-center gap-1 mt-1">
                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                <span className="text-xs text-yellow-600">Default</span>
              </div>
            )}
          </div>
        </div>
        
        {showActions && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(address);
              }}
              className="h-8 w-8 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            >
              <Edit size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(address.id);
              }}
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        )}
      </div>

      {/* Address Details */}
      <div className="space-y-1 text-gray-700">
        <p className="text-sm font-medium">{formatAddress()}</p>
        {address.landmark && (
          <p className="text-sm text-gray-500">Near {address.landmark}</p>
        )}
        
        {/* Contact Info */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            📞 {address.phone}
            {address.name && ` • ${address.name}`}
          </p>
        </div>
      </div>

      {/* Set Default Button */}
      {showActions && !address.isDefault && (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onSetDefault(address.id);
          }}
          className="w-full mt-3 border-green-300 text-green-600 hover:bg-green-50"
        >
          Set as Default
        </Button>
      )}
    </div>
  );
};

export default AddressCard;
