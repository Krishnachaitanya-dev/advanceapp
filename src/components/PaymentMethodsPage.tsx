
import React, { useState } from 'react';
import AppLayout from './AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentMethodsPage = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    },
    {
      id: 2,
      type: 'card',
      last4: '5555',
      brand: 'Mastercard',
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false
    }
  ]);

  const removePaymentMethod = (id: number) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  const setDefaultPaymentMethod = (id: number) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  return (
    <AppLayout>
      <div className="mb-6 flex items-center">
        <Link to="/profile" className="mr-4 text-white">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-white">Payment Methods</h1>
      </div>

      <div className="space-y-4">
        <Button className="w-full bg-blue-900 hover:bg-blue-800 text-white flex items-center justify-center gap-2">
          <Plus size={20} />
          Add New Payment Method
        </Button>

        {paymentMethods.map(method => (
          <div key={method.id} className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-8 bg-blue-900/60 rounded flex items-center justify-center mr-4">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">
                      {method.brand} •••• {method.last4}
                    </p>
                    {method.isDefault && (
                      <span className="bg-green-600/20 text-green-400 text-xs px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-white/70 text-sm">
                    Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!method.isDefault && (
                  <Button
                    onClick={() => setDefaultPaymentMethod(method.id)}
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white text-xs"
                  >
                    Set Default
                  </Button>
                )}
                <Button
                  onClick={() => removePaymentMethod(method.id)}
                  variant="outline"
                  size="sm"
                  className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {paymentMethods.length === 0 && (
          <div className="glass-card p-8 text-center">
            <CreditCard className="w-12 h-12 text-white/50 mx-auto mb-4" />
            <p className="text-white/70">No payment methods added yet</p>
            <p className="text-white/50 text-sm mt-2">Add a payment method to make faster checkouts</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default PaymentMethodsPage;
