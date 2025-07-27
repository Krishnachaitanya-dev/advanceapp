
interface OrderTimelineData {
  status: string;
  created_at: string;
  pickup_slot_text?: string | null;
  pickup_date_formatted?: string | null;
  actual_pickup_time?: string | null;
  processing_started_at?: string | null;
  ready_for_delivery_at?: string | null;
  delivered_at?: string | null;
}

interface TimelineStep {
  key: string;
  label: string;
  time: string;
  isCompleted: boolean;
  isScheduled: boolean;
}

export const useOrderTimeline = () => {
  const getOrderTimeline = (order: OrderTimelineData): TimelineStep[] => {
    const isConfirmedOnly = order.status === 'confirmed';
    
    // For confirmed status, show scheduled pickup details
    if (isConfirmedOnly && order.pickup_slot_text && order.pickup_date_formatted) {
      return [
        {
          key: 'confirmed',
          label: 'Order Confirmed',
          time: new Date(order.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          isCompleted: true,
          isScheduled: false
        },
        {
          key: 'scheduled_pickup',
          label: 'Scheduled Pickup',
          time: `${order.pickup_slot_text} on ${order.pickup_date_formatted}`,
          isCompleted: false,
          isScheduled: true
        },
        {
          key: 'in_process',
          label: 'In Process',
          time: 'Pending',
          isCompleted: false,
          isScheduled: false
        },
        {
          key: 'ready_for_delivery',
          label: 'Ready for Delivery',
          time: 'Pending',
          isCompleted: false,
          isScheduled: false
        },
        {
          key: 'delivered',
          label: 'Delivered',
          time: 'Pending',
          isCompleted: false,
          isScheduled: false
        }
      ];
    }

    // For all other statuses, show actual progression with admin timestamps
    const steps: TimelineStep[] = [
      {
        key: 'confirmed',
        label: 'Order Confirmed',
        time: new Date(order.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        isCompleted: true,
        isScheduled: false
      }
    ];

    // Add pickup step with actual time if available
    if (order.actual_pickup_time) {
      steps.push({
        key: 'picked_up',
        label: 'Actually Picked Up',
        time: new Date(order.actual_pickup_time).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        isCompleted: true,
        isScheduled: false
      });
    } else if (order.status === 'picked_up' || order.status === 'in_process' || order.status === 'ready_for_delivery' || order.status === 'delivered') {
      // If status is picked_up but no actual_pickup_time, show a placeholder
      steps.push({
        key: 'picked_up',
        label: 'Picked Up',
        time: 'Completed',
        isCompleted: true,
        isScheduled: false
      });
    } else {
      steps.push({
        key: 'picked_up',
        label: 'Pickup',
        time: 'Pending',
        isCompleted: false,
        isScheduled: false
      });
    }

    // Add processing step
    if (order.processing_started_at) {
      steps.push({
        key: 'in_process',
        label: 'Processing Started',
        time: new Date(order.processing_started_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        isCompleted: true,
        isScheduled: false
      });
    } else if (order.status === 'in_process' || order.status === 'ready_for_delivery' || order.status === 'delivered') {
      steps.push({
        key: 'in_process',
        label: 'In Process',
        time: 'Completed',
        isCompleted: true,
        isScheduled: false
      });
    } else {
      steps.push({
        key: 'in_process',
        label: 'In Process',
        time: 'Pending',
        isCompleted: false,
        isScheduled: false
      });
    }

    // Add ready for delivery step
    if (order.ready_for_delivery_at) {
      steps.push({
        key: 'ready_for_delivery',
        label: 'Ready for Delivery',
        time: new Date(order.ready_for_delivery_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        isCompleted: true,
        isScheduled: false
      });
    } else if (order.status === 'ready_for_delivery' || order.status === 'delivered') {
      steps.push({
        key: 'ready_for_delivery',
        label: 'Ready for Delivery',
        time: 'Completed',
        isCompleted: true,
        isScheduled: false
      });
    } else {
      steps.push({
        key: 'ready_for_delivery',
        label: 'Ready for Delivery',
        time: 'Pending',
        isCompleted: false,
        isScheduled: false
      });
    }

    // Add delivered step
    if (order.delivered_at) {
      steps.push({
        key: 'delivered',
        label: 'Delivered',
        time: new Date(order.delivered_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        isCompleted: true,
        isScheduled: false
      });
    } else if (order.status === 'delivered') {
      steps.push({
        key: 'delivered',
        label: 'Delivered',
        time: 'Completed',
        isCompleted: true,
        isScheduled: false
      });
    } else {
      steps.push({
        key: 'delivered',
        label: 'Delivered',
        time: 'Pending',
        isCompleted: false,
        isScheduled: false
      });
    }

    return steps;
  };

  return { getOrderTimeline };
};
