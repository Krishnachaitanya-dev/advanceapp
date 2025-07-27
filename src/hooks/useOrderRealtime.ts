
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useOrderRealtime = (onOrderUpdate?: () => void) => {
  const { toast } = useToast();

  useEffect(() => {
    console.log('Setting up real-time subscription for orders');

    const subscription = supabase
      .channel('order-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order updated in real-time:', payload);
          
          // Show toast notification for status changes
          if (payload.new.status !== payload.old.status) {
            toast({
              title: "Order Status Updated",
              description: `Order status changed to ${payload.new.status.replace('_', ' ')}`,
            });
          }

          // Trigger callback to refresh data
          if (onOrderUpdate) {
            onOrderUpdate();
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscription');
      subscription.unsubscribe();
    };
  }, [onOrderUpdate, toast]);
};
