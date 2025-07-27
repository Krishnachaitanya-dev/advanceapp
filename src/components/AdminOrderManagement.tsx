import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Package, Truck, Clock, Edit, Save, X, AlertCircle, Calendar } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useOrderUpdate } from '@/hooks/useOrderUpdate';
import { useOrderCancellation } from '@/hooks/useOrderCancellation';
import OrderStatusFilter from './OrderStatusFilter';
import ServiceWeightCalculator from './ServiceWeightCalculator';
import { getBestDisplayName } from '@/utils/serviceNameCleaner';
import type { Order } from '@/hooks/useOrders';

const AdminOrderManagement = () => {
  const { orders, loading, refetch } = useOrders();
  const { updateOrder, isUpdating } = useOrderUpdate();
  const { cancelOrder, isCancelling, canAdminCancel } = useOrderCancellation();
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [editData, setEditData] = useState({
    status: ''
  });

  // Filter orders based on selected status
  const filteredOrders = useMemo(() => {
    if (!selectedStatus) return orders;
    if (selectedStatus === 'cancelled') {
      return orders.filter(order => 
        order.status === 'cancelled_by_user' || order.status === 'cancelled_by_admin'
      );
    }
    return orders.filter(order => order.status === selectedStatus);
  }, [orders, selectedStatus]);

  // Calculate order counts by status
  const orderCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach(order => {
      if (order.status === 'cancelled_by_user' || order.status === 'cancelled_by_admin') {
        counts['cancelled'] = (counts['cancelled'] || 0) + 1;
      } else {
        counts[order.status] = (counts[order.status] || 0) + 1;
      }
    });
    return counts;
  }, [orders]);

  // Helper function to get pickup display information for admin
  const getPickupDisplayInfo = (order: Order) => {
    const extendedOrder = order as any;
    
    // For confirmed orders, show scheduled pickup details
    if (order.status === 'confirmed' && extendedOrder.pickup_slot_text && extendedOrder.pickup_date_formatted) {
      return {
        label: 'Scheduled Pickup',
        time: `${extendedOrder.pickup_slot_text} on ${extendedOrder.pickup_date_formatted}`,
        isScheduled: true,
        actualTime: null
      };
    }
    
    // For other statuses, show actual pickup time if available
    let actualTime = null;
    let label = 'Pickup Status';
    
    switch (order.status) {
      case 'picked_up':
        actualTime = extendedOrder.actual_pickup_time;
        label = 'Actually Picked Up';
        break;
      case 'in_process':
        actualTime = extendedOrder.processing_started_at;
        label = 'Processing Started';
        break;
      case 'ready_for_delivery':
        actualTime = extendedOrder.ready_for_delivery_at;
        label = 'Ready Since';
        break;
      case 'delivered':
        actualTime = extendedOrder.delivered_at;
        label = 'Delivered At';
        break;
    }
    
    return {
      label,
      time: actualTime ? formatDate(actualTime) : 'Status updated',
      isScheduled: false,
      actualTime,
      originalSlot: extendedOrder.pickup_slot_text && extendedOrder.pickup_date_formatted 
        ? `Originally scheduled: ${extendedOrder.pickup_slot_text} on ${extendedOrder.pickup_date_formatted}`
        : null
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'picked_up':
        return <Package className="w-4 h-4" />;
      case 'in_process':
        return <Clock className="w-4 h-4" />;
      case 'ready_for_delivery':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled_by_user':
      case 'cancelled_by_admin':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-600 text-blue-100';
      case 'picked_up':
        return 'bg-purple-600 text-purple-100';
      case 'in_process':
        return 'bg-orange-600 text-orange-100';
      case 'ready_for_delivery':
        return 'bg-green-600 text-green-100';
      case 'delivered':
        return 'bg-green-700 text-green-100';
      case 'cancelled_by_user':
      case 'cancelled_by_admin':
        return 'bg-red-600 text-red-100';
      default:
        return 'bg-gray-600 text-gray-100';
    }
  };

  const statusOptions = [{
    value: 'confirmed',
    label: 'Confirmed'
  }, {
    value: 'picked_up',
    label: 'Picked Up'
  }, {
    value: 'in_process',
    label: 'In Process'
  }, {
    value: 'ready_for_delivery',
    label: 'Ready for Delivery'
  }, {
    value: 'delivered',
    label: 'Delivered'
  }, {
    value: 'cancelled_by_admin',
    label: 'Cancel Order'
  }];

  // Check if weight can be edited (only confirmed and picked_up statuses)
  const canEditWeight = (status: string) => {
    return status === 'confirmed' || status === 'picked_up';
  };

  const isCancelledOrder = (status: string) => {
    return status === 'cancelled_by_user' || status === 'cancelled_by_admin';
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order.id);
    setEditData({
      status: order.status
    });
  };

  const handleSave = async (orderId: string) => {
    // If admin is cancelling the order
    if (editData.status === 'cancelled_by_admin') {
      setCancellingOrder(orderId);
      return;
    }

    const updateData: any = {
      status: editData.status
    };
    const success = await updateOrder(orderId, updateData);
    if (success) {
      setEditingOrder(null);
      refetch();
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    const result = await cancelOrder({
      orderId,
      reason: cancelReason.trim() || undefined,
      cancelledBy: 'admin'
    });

    if (result.success) {
      setCancellingOrder(null);
      setCancelReason('');
      setEditingOrder(null);
      refetch();
    }
  };

  const handleServiceWeightSave = async (orderId: string, weight: number, price: number, itemWeights: Record<string, number>) => {
    const success = await updateOrder(orderId, {
      final_weight: weight,
      final_price: price,
      order_items_weights: itemWeights
    });
    if (success) {
      setEditingOrder(null);
      refetch();
    }
    return success;
  };

  const handleCancel = () => {
    setEditingOrder(null);
    setCancellingOrder(null);
    setCancelReason('');
    setEditData({
      status: ''
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-slate-800 text-lg">Loading orders...</div>
      </div>;
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      <OrderStatusFilter selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} orderCounts={orderCounts} />

      <div className="space-y-4">
        {filteredOrders.map(order => {
          const pickupInfo = getPickupDisplayInfo(order);
          
          return (
            <div key={order.id} className="bg-white border-2 border-slate-200 rounded-lg p-4 md:p-6 shadow-lg">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 space-y-3 md:space-y-0">
                <div className="flex-1">
                  <h3 className="text-slate-800 font-semibold text-lg break-all">
                    {order.order_number}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Ordered on {formatDate(order.created_at)}
                  </p>
                  <p className="text-slate-600 text-sm break-words">
                    Customer: {order.bookings?.addresses?.door_no} {order.bookings?.addresses?.street}, {order.bookings?.addresses?.city}
                  </p>
                  
                  {/* Enhanced Pickup Time Display */}
                  <div className={`mt-2 p-2 rounded-lg border ${
                    pickupInfo.isScheduled ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center space-x-1">
                      {pickupInfo.isScheduled ? (
                        <Calendar className="w-4 h-4 text-yellow-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-blue-600" />
                      )}
                      <p className={`text-sm font-medium ${
                        pickupInfo.isScheduled ? 'text-yellow-800' : 'text-blue-800'
                      }`}>
                        <strong>{pickupInfo.label}:</strong> {pickupInfo.time}
                      </p>
                    </div>
                    
                    {/* Show original scheduled time for non-confirmed orders */}
                    {!pickupInfo.isScheduled && pickupInfo.originalSlot && (
                      <p className="text-xs text-gray-600 mt-1 ml-5">
                        {pickupInfo.originalSlot}
                      </p>
                    )}
                  </div>
                  
                  {/* Show cancellation details */}
                  {isCancelledOrder(order.status) && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800 font-medium">
                        <strong>Cancelled:</strong> {order.status === 'cancelled_by_user' ? 'By Customer' : 'By Admin'}
                      </p>
                      {(order as any).cancelled_at && (
                        <p className="text-xs text-red-600">
                          On {formatDate((order as any).cancelled_at)}
                        </p>
                      )}
                      {(order as any).cancellation_reason && (
                        <div className="mt-2">
                          <p className="text-xs text-red-700 font-medium">Reason:</p>
                          <p className="text-sm text-red-800 bg-red-100 p-2 rounded border border-red-200 mt-1">
                            {(order as any).cancellation_reason}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  {editingOrder === order.id ? <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                    <Button size="sm" variant="outline" onClick={handleCancel} className="border-gray-500 text-gray-700 hover:bg-gray-100 w-full sm:w-auto">
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </div> : !isCancelledOrder(order.status) && <Button size="sm" onClick={() => handleEdit(order)} className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto rounded-sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>}

                <Badge className={`${getStatusColor(order.status)} border-0 flex items-center space-x-1 whitespace-nowrap`}>
                  {getStatusIcon(order.status)}
                  <span>{order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                </Badge>
              </div>
            </div>

            {/* Cancellation confirmation */}
            {cancellingOrder === order.id && (
              <div className="space-y-4 bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
                <div className="flex items-center space-x-2 text-red-800">
                  <AlertCircle className="w-5 h-5" />
                  <h4 className="font-medium">Cancel Order Confirmation</h4>
                </div>
                <p className="text-sm text-red-700">
                  Are you sure you want to cancel this order? This action cannot be undone.
                </p>
                <div>
                  <label className="block text-sm font-medium text-red-800 mb-2">
                    Reason for cancellation (required)
                  </label>
                  <Textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Please provide a reason for cancelling this order..."
                    rows={3}
                    className="w-full"
                  />
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isCancelling}
                    className="flex-1"
                  >
                    Keep Order
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleCancelOrder(order.id)}
                    disabled={isCancelling || !cancelReason.trim()}
                    className="flex-1"
                  >
                    {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                  </Button>
                </div>
              </div>
            )}

            {editingOrder === order.id && cancellingOrder !== order.id ? <div className="space-y-4 bg-slate-50 p-4 rounded-lg border">
                <div className="w-full md:w-1/3">
                  <label className="block text-slate-800 text-sm mb-2 font-medium">Status</label>
                  <Select value={editData.status} onValueChange={value => setEditData(prev => ({
              ...prev,
              status: value
            }))}>
                    <SelectTrigger className="bg-white border-slate-300 text-slate-800">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-300">
                      {statusOptions.map(option => <SelectItem key={option.value} value={option.value} className="text-slate-800 hover:bg-slate-100">
                          {option.label}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {canEditWeight(order.status) && editData.status !== 'cancelled_by_admin' ? <div className="bg-slate-100 rounded-lg p-4">
                    <ServiceWeightCalculator orderId={order.id} orderItems={order.order_items || []} currentFinalWeight={order.final_weight || undefined} currentFinalPrice={order.final_price || undefined} onSave={(weight, price, itemWeights) => handleServiceWeightSave(order.id, weight, price, itemWeights)} onStatusSave={() => handleSave(order.id)} isUpdating={isUpdating} />
                  </div> : editData.status !== 'cancelled_by_admin' && <div className="space-y-3">
                    <div className="bg-white border border-slate-300 rounded-lg p-3">
                      <p className="text-slate-800 text-sm">
                        Weight editing is disabled for orders in "{order.status.replace('_', ' ')}" status. 
                        Weight can only be modified for "Confirmed" and "Picked Up" orders.
                      </p>
                    </div>
                    <Button onClick={() => handleSave(order.id)} disabled={isUpdating} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Save className="w-4 h-4 mr-1" />
                      Save Status
                    </Button>
                  </div>}

                {editData.status === 'cancelled_by_admin' && (
                  <div className="space-y-3">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-800 text-sm">
                        You are about to cancel this order. Click "Save Status" to proceed with cancellation.
                      </p>
                    </div>
                    <Button onClick={() => handleSave(order.id)} disabled={isUpdating} className="bg-red-600 hover:bg-red-700 text-white">
                      <Save className="w-4 h-4 mr-1" />
                      Save Status
                    </Button>
                  </div>
                )}
              </div> : !isCancelledOrder(order.status) && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="text-slate-700 text-sm">
                  <strong className="text-slate-800">Items:</strong> {order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0} pieces
                </div>
                
                <div className="text-slate-700 text-sm">
                  <strong className="text-slate-800">Actual Weight:</strong> {order.final_weight || order.estimated_weight} kg
                </div>

                <div className="text-slate-700 text-sm">
                  <strong className="text-slate-800">Final Price:</strong> ₹{order.final_price || order.estimated_price || '0'}
                </div>
              </div>}

            {!isCancelledOrder(order.status) && (
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-slate-800 font-medium text-sm mb-2">Order Items:</h4>
                <div className="space-y-2">
                  {Object.entries(order.order_items?.reduce((acc, item) => {
                const displayName = getBestDisplayName(item.services?.name || 'Service', item.item_name);
                if (!acc[displayName]) {
                  acc[displayName] = {
                    name: displayName,
                    totalWeight: 0
                  };
                }
                acc[displayName].totalWeight += item.final_weight || item.estimated_weight || 0;
                return acc;
              }, {} as Record<string, any>) || {}).map(([key, item]) => <div key={key} className="flex flex-col sm:flex-row sm:justify-between text-slate-700 text-sm space-y-1 sm:space-y-0">
                      <span className="break-words text-slate-800">
                        {item.name}
                      </span>
                      <span className="text-xs sm:text-sm whitespace-nowrap text-slate-600">
                        Weight: {item.totalWeight}kg
                      </span>
                    </div>)}
                </div>
              </div>
            )}

            {/* Enhanced Special Instructions Display */}
            {order.bookings?.special_note && (
              <div className="mt-2 text-slate-700 text-sm break-words">
                <strong className="text-slate-800">Special Instructions:</strong> {order.bookings.special_note}
              </div>
            )}
          </div>
          );
        })}

        {filteredOrders.length === 0 && <div className="bg-white border-2 border-slate-200 rounded-lg p-8 text-center shadow-lg">
            <p className="text-slate-600">No orders found for the selected status.</p>
          </div>}
      </div>
    </div>
  );
};

export default AdminOrderManagement;
