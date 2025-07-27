
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';

interface OrderItem {
  service_id: string;
  item_name: string;
  quantity: number;
  estimated_weight: number;
}

interface CreateOrderData {
  pickup_date: string;
  pickup_time: string;
  special_instructions?: string;
  address_id: string;
  items: OrderItem[];
  estimated_total: number;
}

// Helper function for development logging
const devLog = (message: string, ...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[useOrderCreation] ${message}`, ...args);
  }
};

export const useOrderCreation = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const sendStatusEmail = async (orderId: string) => {
    try {
      devLog('Triggering order confirmation email for order:', orderId);
      
      const { data, error } = await supabase.functions.invoke('send-order-status-email', {
        body: { orderId }
      });

      if (error) {
        devLog('Error sending confirmation email:', error);
        return false;
      }

      devLog('Order confirmation email sent successfully:', data);
      return true;
    } catch (error) {
      devLog('Error invoking email function:', error);
      return false;
    }
  };

  // Helper function to convert time slot to 24-hour format
  const convertTimeSlotToTime = (timeSlot: string) => {
    const startTime = timeSlot.split(' - ')[0];
    
    // Convert to 24-hour format
    const [time, period] = startTime.split(' ');
    const [hours, minutes] = time.split(':');
    let hour24 = parseInt(hours);
    
    if (period === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (period === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
    
    return `${hour24.toString().padStart(2, '0')}:${minutes}:00`;
  };

  // Helper function to create proper timestamp for database
  const createPickupTimestamp = (date: string, timeSlot: string) => {
    const time = convertTimeSlotToTime(timeSlot);
    return `${date}T${time}`;
  };

  // Helper function to format date for display
  const formatPickupDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Helper function to generate unique order number using database function
  const generateOrderNumber = async (): Promise<string> => {
    try {
      devLog('Calling get_next_order_number function...');
      // Cast to any to bypass TypeScript type checking until types are regenerated
      const { data, error } = await (supabase.rpc as any)('get_next_order_number');
      
      if (error) {
        devLog('Error calling get_next_order_number:', error);
        // Enhanced fallback using timestamp + random number
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const fallbackNumber = `AW${timestamp}${random}`;
        devLog('Using fallback order number:', fallbackNumber);
        return fallbackNumber;
      }
      
      devLog('Generated order number from sequence:', data);
      return data;
    } catch (error) {
      devLog('Exception in generateOrderNumber:', error);
      // Enhanced fallback using timestamp + random number
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const fallbackNumber = `AW${timestamp}${random}`;
      devLog('Using fallback order number after exception:', fallbackNumber);
      return fallbackNumber;
    }
  };

  const createOrder = async (orderData: CreateOrderData) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in to place an order",
        variant: "destructive"
      });
      return { success: false };
    }

    devLog('Creating order with data:', orderData);

    try {
      setIsCreating(true);

      // Validate address exists
      const { data: addressCheck, error: addressError } = await supabase
        .from('addresses')
        .select('id')
        .eq('id', orderData.address_id)
        .eq('user_id', user.id)
        .single();

      if (addressError || !addressCheck) {
        devLog('Address validation error:', addressError);
        toast({
          title: "Address Error",
          description: "Selected address is not valid",
          variant: "destructive"
        });
        return { success: false };
      }

      // Create proper pickup timestamp
      const pickupTimestamp = createPickupTimestamp(orderData.pickup_date, orderData.pickup_time);
      devLog('Pickup timestamp:', pickupTimestamp);

      // Create booking with correct status value
      const bookingData = {
        user_id: user.id,
        address_id: orderData.address_id,
        pickup_time: pickupTimestamp,
        special_note: orderData.special_instructions || null,
        status: 'scheduled'
      };

      devLog('Creating booking with data:', bookingData);

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (bookingError) {
        devLog('Error creating booking:', bookingError);
        toast({
          title: "Booking Error",
          description: `Failed to create booking: ${bookingError.message}`,
          variant: "destructive"
        });
        return { success: false };
      }

      devLog('Booking created successfully:', booking);

      // Create order with enhanced retry mechanism
      let orderCreated = false;
      let retryCount = 0;
      const maxRetries = 5; // Increased retry count
      let order;

      while (!orderCreated && retryCount < maxRetries) {
        try {
          const orderNumber = await generateOrderNumber();
          devLog(`Order creation attempt ${retryCount + 1} with number:`, orderNumber);
          
          const orderDataToInsert = {
            user_id: user.id,
            booking_id: booking.id,
            order_number: orderNumber,
            status: 'confirmed',
            estimated_price: orderData.estimated_total,
            estimated_weight: orderData.items.reduce((sum, item) => sum + item.estimated_weight, 0),
            pickup_slot_text: orderData.pickup_time,
            pickup_date_formatted: formatPickupDate(orderData.pickup_date)
          };

          const { data: orderResult, error: orderError } = await supabase
            .from('orders')
            .insert(orderDataToInsert)
            .select()
            .single();

          if (orderError) {
            if (orderError.code === '23505' && retryCount < maxRetries - 1) {
              devLog(`Duplicate order number ${orderNumber}, retrying (attempt ${retryCount + 1})...`);
              retryCount++;
              // Add a small delay to reduce race conditions
              await new Promise(resolve => setTimeout(resolve, 100));
              continue;
            } else {
              throw orderError;
            }
          }

          order = orderResult;
          orderCreated = true;
          devLog('Order created successfully:', order);

        } catch (error) {
          retryCount++;
          devLog(`Order creation failed on attempt ${retryCount}:`, error);
          if (retryCount >= maxRetries) {
            throw error;
          }
          // Add delay between retries
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      if (!orderCreated || !order) {
        toast({
          title: "Order Error",
          description: "Failed to create order after multiple attempts",
          variant: "destructive"
        });
        return { success: false };
      }

      // Get first available service ID as fallback
      const { data: firstService } = await supabase
        .from('services')
        .select('id')
        .eq('status', 'active')
        .limit(1)
        .single();

      const defaultServiceId = firstService?.id || null;

      // Create order items with proper service_id validation
      const orderItems = orderData.items.map(item => {
        let validServiceId = item.service_id;
        if (!validServiceId || validServiceId === 'NaN' || validServiceId === 'undefined' || validServiceId === '') {
          validServiceId = defaultServiceId;
        }

        return {
          order_id: order.id,
          service_id: validServiceId,
          item_name: item.item_name,
          quantity: item.quantity,
          estimated_weight: item.estimated_weight
        };
      });

      devLog('Creating order items:', orderItems);

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        devLog('Error creating order items:', itemsError);
        toast({
          title: "Order Items Error",
          description: `Failed to create order items: ${itemsError.message}`,
          variant: "destructive"
        });
        return { success: false };
      }

      devLog('Order items created successfully');

      // Send order confirmation email
      devLog('Order created, sending confirmation email...');
      const emailSent = await sendStatusEmail(order.id);

      if (emailSent) {
        toast({
          title: "Order Placed Successfully!",
          description: `Your order ${order.order_number} has been placed and confirmation email sent`,
        });
      } else {
        toast({
          title: "Order Placed Successfully!",
          description: `Your order ${order.order_number} has been placed (confirmation email failed)`,
        });
      }

      return { success: true, orderNumber: order.order_number };
    } catch (error: any) {
      devLog('Error creating order:', error);
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${error.message}`,
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createOrder,
    isCreating
  };
};
