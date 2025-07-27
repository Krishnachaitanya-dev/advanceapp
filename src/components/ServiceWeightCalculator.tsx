import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calculator, Save } from 'lucide-react';

interface ServiceWeightCalculatorProps {
  orderId: string;
  orderItems: any[];
  currentFinalWeight?: number;
  currentFinalPrice?: number;
  onSave: (weight: number, price: number, itemWeights: Record<string, number>) => Promise<boolean>;
  onStatusSave: () => Promise<void>;
  isUpdating: boolean;
}

const ServiceWeightCalculator: React.FC<ServiceWeightCalculatorProps> = ({
  orderId,
  orderItems,
  currentFinalWeight,
  currentFinalPrice,
  onSave,
  onStatusSave,
  isUpdating
}) => {
  const [itemWeights, setItemWeights] = useState<Record<string, number>>({});
  const [calculatedWeight, setCalculatedWeight] = useState(0);
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  // Service-based weight guidelines
  const serviceWeightGuidelines = {
    'bedsheet': {
      min: 0.8,
      max: 1.5,
      unit: 'per piece'
    },
    'shirt': {
      min: 0.2,
      max: 0.4,
      unit: 'per piece'
    },
    'pants': {
      min: 0.3,
      max: 0.6,
      unit: 'per piece'
    },
    'dress': {
      min: 0.4,
      max: 0.8,
      unit: 'per piece'
    },
    'towel': {
      min: 0.3,
      max: 0.7,
      unit: 'per piece'
    },
    'blanket': {
      min: 1.0,
      max: 2.5,
      unit: 'per piece'
    },
    'default': {
      min: 0.2,
      max: 1.0,
      unit: 'per piece'
    }
  };

  useEffect(() => {
    // Initialize with current weights if available, otherwise use estimated weights or guidelines
    const initialWeights: Record<string, number> = {};
    orderItems.forEach(item => {
      const serviceName = item.services?.name?.toLowerCase() || 'default';
      const guidelines = serviceWeightGuidelines[serviceName] || serviceWeightGuidelines.default;
      const avgWeight = (guidelines.min + guidelines.max) / 2;
      
      // Use current saved weight, or estimated weight, or calculated average
      initialWeights[item.id] = item.final_weight || item.estimated_weight || avgWeight * item.quantity;
    });
    setItemWeights(initialWeights);
  }, [orderItems]);

  useEffect(() => {
    // Calculate total weight and price
    const totalWeight = Object.values(itemWeights).reduce((sum, weight) => sum + weight, 0);
    let totalPrice = 0;

    orderItems.forEach(item => {
      const itemWeight = itemWeights[item.id] || 0;
      const pricePerKg = item.services?.base_price_per_kg || 0;
      totalPrice += itemWeight * pricePerKg;
    });

    setCalculatedWeight(totalWeight);
    setCalculatedPrice(totalPrice);
  }, [itemWeights, orderItems]);

  const handleWeightChange = (itemId: string, weight: string) => {
    const weightValue = parseFloat(weight) || 0;
    setItemWeights(prev => ({
      ...prev,
      [itemId]: weightValue
    }));
  };

  const handleSaveAll = async () => {
    // Save the weight, price, and individual item weights
    const success = await onSave(calculatedWeight, calculatedPrice, itemWeights);
    if (success) {
      // Then save the status
      await onStatusSave();
      console.log('All changes saved successfully:', itemWeights);
    }
  };

  const getServiceGuideline = (serviceName: string) => {
    const name = serviceName?.toLowerCase() || 'default';
    return serviceWeightGuidelines[name] || serviceWeightGuidelines.default;
  };

  const getCleanServiceName = (serviceName: string) => {
    // Remove duplicate parts and clean the service name
    const parts = serviceName.split(' - ');
    const uniqueParts = [...new Set(parts)];
    return uniqueParts.join(' - ');
  };

  return (
    <div className="space-y-4 bg-slate-50 rounded-lg p-4 border">
      <div className="flex items-center space-x-2 mb-3">
        <Calculator className="w-5 h-5 text-slate-700" />
        <h4 className="text-slate-800 font-medium">Service-based Weight Calculator</h4>
      </div>

      <div className="space-y-3">
        {orderItems.map(item => {
          const serviceName = item.services?.name || 'Unknown Service';
          const cleanServiceName = getCleanServiceName(serviceName);
          const guidelines = getServiceGuideline(serviceName);
          
          return (
            <div key={item.id} className="bg-white rounded p-3 border">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="text-slate-800 font-medium text-sm">{cleanServiceName}</p>
                  {item.item_name && (
                    <p className="text-slate-600 text-xs">{item.item_name}</p>
                  )}
                  <p className="text-slate-500 text-xs">
                    Guidelines: {guidelines.min}-{guidelines.max}kg {guidelines.unit}
                  </p>
                </div>
                <div className="ml-3">
                  <Input
                    type="number"
                    step="0.1"
                    value={itemWeights[item.id] || ''}
                    onChange={(e) => handleWeightChange(item.id, e.target.value)}
                    placeholder="Weight (kg)"
                    className="w-24 bg-white border-slate-300 text-slate-800 text-sm"
                  />
                </div>
              </div>
              <div className="text-slate-600 text-xs">
                Price: ₹{((itemWeights[item.id] || 0) * (item.services?.base_price_per_kg || 0)).toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-slate-200 pt-3">
        <div className="flex justify-between items-center mb-3">
          <div className="text-slate-800">
            <p className="font-medium">Total Weight: {calculatedWeight.toFixed(2)} kg</p>
            <p className="font-medium">Total Price: ₹{calculatedPrice.toFixed(2)}</p>
          </div>
          <Button
            onClick={handleSaveAll}
            disabled={isUpdating}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceWeightCalculator;
