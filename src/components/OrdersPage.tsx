
import React, { memo, useState } from 'react';
import AppLayout from './AppLayout';
import { Button } from '@/components/ui/button';
import { Clock, Package, Truck, CheckCircle, XCircle, Calendar, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOrders } from '@/hooks/useOrders';
import { useOrderCancellation } from '@/hooks/useOrderCancellation';
import OrderDetailsModal from './OrderDetailsModal';
import CancelOrderModal from './CancelOrderModal';
import { getBestDisplayName } from '@/utils/serviceNameCleaner';
import type { Order } from '@/hooks/useOrders';

const OrdersPage = memo(() => {
  const { orders, loading, refetch } = useOrders();
  const { canCustomerCancel } = useOrderCancellation();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelOrder, setCancelOrder] = useState<Order | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const handleCancelClick = (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
    setCancelOrder(order);
    setIsCancelModalOpen(true);
  };

  const handleCancelClose = () => {
    setCancelOrder(null);
    setIsCancelModalOpen(false);
  };

  const handleCancelSuccess = () => {
    refetch();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return <Clock className="w-4 h-4" />;
      case 'picked_up':
      case 'in_process':
        return <Package className="w-4 h-4" />;
      case 'ready_for_delivery':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled_by_user':
      case 'cancelled_by_admin':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500 text-white';
      case 'confirmed':
        return 'bg-primary text-white';
      case 'picked_up':
        return 'bg-purple-500 text-white';
      case 'in_process':
        return 'bg-orange-500 text-white';
      case 'ready_for_delivery':
        return 'bg-green-500 text-white';
      case 'delivered':
        return 'bg-green-600 text-white';
      case 'cancelled_by_user':
      case 'cancelled_by_admin':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'picked_up':
        return 'Picked Up';
      case 'in_process':
        return 'In Process';
      case 'ready_for_delivery':
        return 'Ready for Delivery';
      case 'delivered':
        return 'Delivered';
      case 'cancelled_by_user':
        return 'Cancelled by You';
      case 'cancelled_by_admin':
        return 'Cancelled by Admin';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isCancelledOrder = (status: string) => {
    return status === 'cancelled_by_user' || status === 'cancelled_by_admin';
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <div className="text-slate-600 text-lg font-medium">Loading orders...</div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-3">
        {orders.length === 0 ? (
          <div className="glass-card p-8 text-center bg-gradient-to-br from-primary/5 to-purple-50 border border-primary/20">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">No Orders Yet</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Start your laundry journey by scheduling your first pickup. We'll take care of the rest!
            </p>
            <Link to="/services">
              <Button className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Schedule Pickup
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div 
                key={order.id} 
                className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow duration-200" 
                onClick={() => handleOrderClick(order)}
              >
                {/* Header Row */}
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    {order.order_number}
                  </h3>
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span>{formatStatus(order.status)}</span>
                  </div>
                </div>

                {/* Cancellation Message */}
                {isCancelledOrder(order.status) && (
                  <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-red-700">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {order.status === 'cancelled_by_user' 
                          ? 'You cancelled this order' 
                          : 'This order was cancelled by admin'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Info Row */}
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(order.created_at)}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>{order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0} items</span>
                    {order.final_weight && <span>{order.final_weight}kg</span>}
                  </div>
                </div>

                {/* Price Row */}
                <div className="flex justify-between items-center mt-2">
                  <div className="text-sm text-gray-500">
                    {order.final_price && order.final_weight && (order.status === 'delivered' || order.status === 'ready_for_delivery') ? (
                      <span className="text-green-600 font-semibold">₹{order.final_price}</span>
                    ) : isCancelledOrder(order.status) ? (
                      <span className="text-red-600">Cancelled</span>
                    ) : (
                      <span className="text-amber-600">Pending Calculation</span>
                    )}
                  </div>
                  {!isCancelledOrder(order.status) && canCustomerCancel(order.created_at, order.status) && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-300 text-red-600 hover:bg-red-50 text-xs px-3 py-1" 
                      onClick={(e) => handleCancelClick(e, order)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <OrderDetailsModal order={selectedOrder} isOpen={isModalOpen} onClose={handleCloseModal} />
        <CancelOrderModal 
          order={cancelOrder} 
          isOpen={isCancelModalOpen} 
          onClose={handleCancelClose}
          onSuccess={handleCancelSuccess}
        />
      </div>
    </AppLayout>
  );
});

OrdersPage.displayName = 'OrdersPage';
export default OrdersPage;
