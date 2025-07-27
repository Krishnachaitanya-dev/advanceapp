
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';
import { useUserRole } from './useUserRole';

interface CancelOrderData {
  orderId: string;
  reason?: string;
  cancelledBy: 'customer' | 'admin';
}

export const useOrderCancellation = () => {
  const [isCancelling, setIsCancelling] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { isAdmin } = useUserRole();

  const sendStatusEmail = async (orderId: string) => {
    try {
      console.log('Triggering cancellation email for order:', orderId);
      
      const { data, error } = await supabase.functions.invoke('send-order-status-email', {
        body: { orderId }
      });

      if (error) {
        console.error('Error sending cancellation email:', error);
        return false;
      }

      console.log('Cancellation email sent successfully:', data);
      return true;
    } catch (error) {
      console.error('Error invoking email function:', error);
      return false;
    }
  };

  // Check if order can be cancelled by customer (1-hour window)
  const canCustomerCancel = (orderCreatedAt: string, orderStatus: string) => {
    if (!user || isAdmin) return false;
    
    const createdTime = new Date(orderCreatedAt);
    const currentTime = new Date();
    const hoursDiff = (currentTime.getTime() - createdTime.getTime()) / (1000 * 60 * 60);
    
    // Allow cancellation within 1 hour and only for pending/confirmed orders
    const validStatuses = ['pending', 'confirmed'];
    return hoursDiff <= 1 && validStatuses.includes(orderStatus);
  };

  // Check if admin can cancel order
  const canAdminCancel = (orderStatus: string) => {
    if (!isAdmin) return false;
    
    // Admin can cancel any order except delivered ones
    const nonCancellableStatuses = ['delivered', 'cancelled_by_user', 'cancelled_by_admin'];
    return !nonCancellableStatuses.includes(orderStatus);
  };

  // Get time remaining for customer cancellation
  const getTimeRemaining = (orderCreatedAt: string) => {
    const createdTime = new Date(orderCreatedAt);
    const currentTime = new Date();
    const oneHourLater = new Date(createdTime.getTime() + 60 * 60 * 1000);
    
    if (currentTime >= oneHourLater) return 0;
    
    return oneHourLater.getTime() - currentTime.getTime();
  };

  const cancelOrder = async (data: CancelOrderData) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in to cancel order",
        variant: "destructive"
      });
      return { success: false };
    }

    try {
      setIsCancelling(true);

      // Get order details first for validation
      const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', data.orderId)
        .single();

      if (fetchError || !order) {
        toast({
          title: "Error",
          description: "Order not found",
          variant: "destructive"
        });
        return { success: false };
      }

      // Validate cancellation permissions
      if (data.cancelledBy === 'customer' && !canCustomerCancel(order.created_at, order.status)) {
        toast({
          title: "Cancellation Not Allowed",
          description: "Orders can only be cancelled within 1 hour of placement and must be pending or confirmed",
          variant: "destructive"
        });
        return { success: false };
      }

      if (data.cancelledBy === 'admin' && !canAdminCancel(order.status)) {
        toast({
          title: "Cancellation Not Allowed",
          description: "This order cannot be cancelled in its current status",
          variant: "destructive"
        });
        return { success: false };
      }

      // Update order with cancellation details including reason
      const updateData = {
        status: data.cancelledBy === 'customer' ? 'cancelled_by_user' : 'cancelled_by_admin',
        cancelled_at: new Date().toISOString(),
        cancelled_by: data.cancelledBy,
        cancelled_by_user_id: user.id,
        cancellation_reason: data.reason || null
      };

      const { error: updateError } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', data.orderId);

      if (updateError) {
        toast({
          title: "Error",
          description: `Failed to cancel order: ${updateError.message}`,
          variant: "destructive"
        });
        return { success: false };
      }

      // Log admin action if admin cancelled
      if (data.cancelledBy === 'admin') {
        await supabase
          .from('admin_logs')
          .insert({
            admin_id: user.id,
            action: 'order_cancelled',
            target_type: 'order',
            target_id: data.orderId,
            details: {
              order_number: order.order_number,
              reason: data.reason,
              original_status: order.status
            }
          });
      }

      // Send cancellation email
      console.log('Order cancelled, sending email notification...');
      const emailSent = await sendStatusEmail(data.orderId);

      if (emailSent) {
        toast({
          title: "Order Cancelled",
          description: data.cancelledBy === 'customer' 
            ? "Your order has been cancelled successfully and you'll receive a confirmation email" 
            : "Order has been cancelled and customer has been notified via email",
        });
      } else {
        toast({
          title: "Order Cancelled",
          description: data.cancelledBy === 'customer' 
            ? "Your order has been cancelled successfully (email notification failed)" 
            : "Order has been cancelled (email notification failed)",
          variant: "destructive"
        });
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while cancelling the order",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setIsCancelling(false);
    }
  };

  return {
    cancelOrder,
    isCancelling,
    canCustomerCancel,
    canAdminCancel,
    getTimeRemaining
  };
};
