
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Package, Truck, Clock, FileText, AlertCircle, XCircle, Calendar } from 'lucide-react';
import { Order } from '@/hooks/useOrders';
import { getBestDisplayName } from '@/utils/serviceNameCleaner';
import { useOrderTimeline } from '@/hooks/useOrderTimeline';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, isOpen, onClose }) => {
  const { getOrderTimeline } = useOrderTimeline();

  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-600 text-blue-100';
      case 'picked_up': return 'bg-purple-600 text-purple-100';
      case 'in_process': return 'bg-orange-600 text-orange-100';
      case 'ready_for_delivery': return 'bg-green-600 text-green-100';
      case 'delivered': return 'bg-green-700 text-green-100';
      case 'cancelled_by_user':
      case 'cancelled_by_admin':
        return 'bg-red-600 text-red-100';
      default: return 'bg-gray-600 text-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Check if order is cancelled
  const isCancelledOrder = order.status === 'cancelled_by_user' || order.status === 'cancelled_by_admin';

  // Group items by display name to avoid duplicates - improved grouping logic
  const groupedItems = order.order_items?.reduce((acc, item) => {
    const displayName = getBestDisplayName(item.services?.name || 'Service', item.item_name);
    
    if (!acc[displayName]) {
      acc[displayName] = {
        name: displayName,
        totalQuantity: 0,
        pricePerKg: item.services?.base_price_per_kg || 0,
        estimatedWeight: 0,
        finalWeight: 0
      };
    }
    
    acc[displayName].totalQuantity += item.quantity;
    acc[displayName].estimatedWeight += item.estimated_weight || 0;
    acc[displayName].finalWeight += item.final_weight || 0;
    
    return acc;
  }, {} as Record<string, any>) || {};

  // Get timeline steps using the new hook
  const timelineSteps = getOrderTimeline({
    status: order.status,
    created_at: order.created_at,
    pickup_slot_text: (order as any).pickup_slot_text,
    pickup_date_formatted: (order as any).pickup_date_formatted,
    actual_pickup_time: (order as any).actual_pickup_time,
    processing_started_at: (order as any).processing_started_at,
    ready_for_delivery_at: (order as any).ready_for_delivery_at,
    delivered_at: (order as any).delivered_at
  });

  // Check if final weight exists, meaning pricing has been calculated
  const hasFinalWeight = order.final_weight !== null && order.final_weight > 0;

  // Get special instructions from booking
  const specialInstructions = order.bookings?.special_note;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto bg-white rounded-lg shadow-lg">
        <DialogHeader className="border-b pb-2">
          <DialogTitle className="text-lg font-bold text-gray-900">
            Order Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* Order Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {order.order_number}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatDate(order.created_at)}
              </p>
            </div>
            <Badge className={`${getStatusColor(order.status)} border-0 px-2 py-1 text-xs font-medium`}>
              {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          </div>

          {/* Show cancellation details for cancelled orders */}
          {isCancelledOrder && (
            <div className="border border-red-200 rounded-lg p-3 bg-red-50">
              <div className="flex items-center space-x-2 mb-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <h4 className="font-semibold text-red-800 text-sm">Order Cancelled</h4>
              </div>
              
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-red-700">Cancelled by:</span>
                  <span className="font-medium text-red-800">
                    {order.status === 'cancelled_by_user' ? 'Customer' : 'Admin'}
                  </span>
                </div>
                
                {(order as any).cancelled_at && (
                  <div className="flex justify-between">
                    <span className="text-red-700">Cancelled on:</span>
                    <span className="font-medium text-red-800">
                      {formatDateTime((order as any).cancelled_at)}
                    </span>
                  </div>
                )}
                
                {(order as any).cancellation_reason && (
                  <div className="mt-2">
                    <p className="text-red-700 font-medium mb-1">Reason:</p>
                    <div className="bg-red-100 border border-red-200 rounded p-2">
                      <p className="text-red-800 text-sm">{(order as any).cancellation_reason}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          {specialInstructions && (
            <div className="border-t pt-2">
              <h4 className="font-semibold text-gray-900 mb-1.5 text-sm flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                Special Instructions
              </h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                <p className="text-sm text-gray-700">{specialInstructions}</p>
              </div>
            </div>
          )}

          {/* Only show progress for non-cancelled orders */}
          {!isCancelledOrder && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 text-sm">Order Progress</h4>
              {timelineSteps.map((step, index) => {
                const getStepIcon = (key: string) => {
                  switch (key) {
                    case 'confirmed': return CheckCircle;
                    case 'scheduled_pickup': return Calendar;
                    case 'picked_up': return Package;
                    case 'in_process': return Clock;
                    case 'ready_for_delivery': return Truck;
                    case 'delivered': return CheckCircle;
                    default: return Clock;
                  }
                };

                const Icon = getStepIcon(step.key);
                
                return (
                  <div key={step.key} className="flex items-center space-x-2">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                      step.isCompleted 
                        ? 'bg-blue-500 text-white shadow-lg' 
                        : step.isScheduled
                        ? 'bg-yellow-500 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        step.isCompleted ? 'text-gray-900' : 
                        step.isScheduled ? 'text-yellow-700' : 
                        'text-gray-400'
                      }`}>
                        {step.label}
                      </p>
                      <p className={`text-xs ${
                        step.isCompleted ? 'text-gray-600' : 
                        step.isScheduled ? 'text-yellow-600' : 
                        'text-gray-400'
                      }`}>
                        {step.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Order Summary */}
          <div className="border-t pt-2">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">Order Summary</h4>
            <div className="space-y-1.5">
              {Object.values(groupedItems).map((item: any, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <span className="text-gray-900 font-medium text-sm">
                      {item.name}
                    </span>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Rate: ₹{item.pricePerKg}/kg
                    </div>
                  </div>
                  {(item.finalWeight > 0 || item.estimatedWeight > 0) && (
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {(item.finalWeight || item.estimatedWeight).toFixed(1)} kg
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Show pricing info only for non-cancelled orders or if already calculated */}
            {(!isCancelledOrder || hasFinalWeight) && (
              <div className="border-t mt-2 pt-2 bg-blue-50 rounded-lg p-2">
                {hasFinalWeight ? (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900 text-sm">Total Amount</span>
                      <span className="font-bold text-blue-600 text-lg">
                        ₹{order.final_price}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">Total Weight</span>
                      <span className="text-gray-900 font-medium">
                        {order.final_weight} kg
                      </span>
                    </div>
                  </div>
                ) : !isCancelledOrder && (
                  <div className="text-center py-1">
                    <div className="text-xs text-gray-600 bg-yellow-50 border border-yellow-200 rounded p-1.5">
                      💡 Final price will be calculated after weighing
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons - only for active orders */}
          {!isCancelledOrder && (
            <div className="space-y-2 pt-1">
              {order.status !== 'delivered' && (
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 shadow-lg text-sm">
                  📍 Track Order
                </Button>
              )}

              {order.status === 'delivered' && (
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 shadow-lg text-sm">
                  ⭐ Rate & Review
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
