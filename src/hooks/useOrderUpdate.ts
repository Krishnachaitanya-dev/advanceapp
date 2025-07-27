
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OrderUpdateData {
  status?: string;
  final_weight?: number;
  final_price?: number;
  order_items_weights?: Record<string, number>;
  pickup_slot_text?: string;
  pickup_date_formatted?: string;
  actual_pickup_time?: string;
  processing_started_at?: string;
  ready_for_delivery_at?: string;
  delivered_at?: string;
}

export const useOrderUpdate = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const sendStatusEmail = async (orderId: string) => {
    try {
      console.log('Triggering email for order:', orderId);
      
      const { data, error } = await supabase.functions.invoke('send-order-status-email', {
        body: { orderId }
      });

      if (error) {
        console.error('Error sending status email:', error);
        return false;
      }

      console.log('Email sent successfully:', data);
      return true;
    } catch (error) {
      console.error('Error invoking email function:', error);
      return false;
    }
  };

  const updateOrder = async (orderId: string, updateData: OrderUpdateData) => {
    try {
      setIsUpdating(true);
      console.log('Updating order:', orderId, 'with data:', updateData);

      // Prepare the update object with new timestamp fields
      const orderUpdateObject: any = {
        updated_at: new Date().toISOString()
      };

      // Add basic fields
      if (updateData.status !== undefined) orderUpdateObject.status = updateData.status;
      if (updateData.final_weight !== undefined) orderUpdateObject.final_weight = updateData.final_weight;
      if (updateData.final_price !== undefined) orderUpdateObject.final_price = updateData.final_price;
      if (updateData.pickup_slot_text !== undefined) orderUpdateObject.pickup_slot_text = updateData.pickup_slot_text;
      if (updateData.pickup_date_formatted !== undefined) orderUpdateObject.pickup_date_formatted = updateData.pickup_date_formatted;

      // Add actual timestamp fields based on status
      const currentTimestamp = new Date().toISOString();
      if (updateData.status === 'picked_up') {
        orderUpdateObject.actual_pickup_time = currentTimestamp;
      } else if (updateData.status === 'in_process') {
        orderUpdateObject.processing_started_at = currentTimestamp;
      } else if (updateData.status === 'ready_for_delivery') {
        orderUpdateObject.ready_for_delivery_at = currentTimestamp;
      } else if (updateData.status === 'delivered') {
        orderUpdateObject.delivered_at = currentTimestamp;
      }

      // Update the main order
      const { error: orderError } = await supabase
        .from('orders')
        .update(orderUpdateObject)
        .eq('id', orderId);

      if (orderError) {
        console.error('Error updating order:', orderError);
        toast({
          title: "Error",
          description: "Failed to update order",
          variant: "destructive"
        });
        return false;
      }

      console.log('Order updated successfully in database');

      // If we're updating weights, also update the individual order items
      if (updateData.final_weight && updateData.order_items_weights) {
        console.log('Updating individual order item weights:', updateData.order_items_weights);
        
        // Update each order item with its final weight
        const updatePromises = Object.entries(updateData.order_items_weights).map(([itemId, weight]) => 
          supabase
            .from('order_items')
            .update({ final_weight: weight })
            .eq('id', itemId)
        );

        const results = await Promise.all(updatePromises);
        const hasErrors = results.some(result => result.error);
        
        if (hasErrors) {
          console.error('Some order items failed to update');
          toast({
            title: "Warning",
            description: "Order updated but some item weights may not have saved",
            variant: "destructive"
          });
        }
      }

      // Send status update email if status was changed
      if (updateData.status) {
        console.log('Status updated, sending email notification...');
        const emailSent = await sendStatusEmail(orderId);
        
        if (emailSent) {
          toast({
            title: "Success",
            description: "Order updated and customer notified via email",
          });
        } else {
          toast({
            title: "Partial Success",
            description: "Order updated but email notification failed",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Success",
          description: "Order updated successfully",
        });
      }

      // Force a small delay to ensure database changes are propagated
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error: any) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateOrder,
    isUpdating
  };
};
