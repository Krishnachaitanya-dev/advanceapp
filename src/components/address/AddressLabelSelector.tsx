
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Briefcase, MapPin } from 'lucide-react';
import { AddressLabel } from '@/types/address';

interface AddressLabelSelectorProps {
  selectedLabel: AddressLabel;
  onLabelChange: (label: AddressLabel) => void;
}

const labelConfig = {
  home: {
    label: 'Home',
    icon: Home,
    color: 'bg-green-500 text-white border-green-500'
  },
  work: {
    label: 'Work', 
    icon: Briefcase,
    color: 'bg-blue-500 text-white border-blue-500'
  },
  other: {
    label: 'Other',
    icon: MapPin,
    color: 'bg-purple-500 text-white border-purple-500'
  }
};

const AddressLabelSelector = ({ selectedLabel, onLabelChange }: AddressLabelSelectorProps) => {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(labelConfig).map(([key, config]) => {
          const IconComponent = config.icon;
          const isSelected = selectedLabel === key;
          
          return (
            <Button
              key={key}
              type="button"
              variant="outline"
              className={`flex flex-col items-center gap-2 h-16 border transition-all duration-200 ${
                isSelected 
                  ? config.color 
                  : 'border-gray-300 bg-white text-slate-700 hover:bg-gray-50'
              }`}
              onClick={() => onLabelChange(key as AddressLabel)}
            >
              <IconComponent size={16} />
              <span className="text-xs font-medium">{config.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default AddressLabelSelector;
