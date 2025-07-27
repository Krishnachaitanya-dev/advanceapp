
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Clock } from 'lucide-react';
import { useOrderCancellation } from '@/hooks/useOrderCancellation';
import type { Order } from '@/hooks/useOrders';

interface CancelOrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  order,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [reason, setReason] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { cancelOrder, isCancelling, getTimeRemaining } = useOrderCancellation();

  useEffect(() => {
    if (!order || !isOpen) return;

    const updateTimer = () => {
      const remaining = getTimeRemaining(order.created_at);
      setTimeRemaining(remaining);
      
      if (remaining <= 0) {
        onClose();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [order, isOpen, getTimeRemaining, onClose]);

  const formatTimeRemaining = (ms: number) => {
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const handleCancel = async () => {
    if (!order) return;

    const result = await cancelOrder({
      orderId: order.id,
      reason: reason.trim() || undefined,
      cancelledBy: 'customer'
    });

    if (result.success) {
      onSuccess();
      onClose();
    }
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span>Cancel Order</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">
              Are you sure you want to cancel order <strong>{order.order_number}</strong>?
            </p>
            <p className="text-xs text-red-600 mt-1">
              This action cannot be undone. Any refunds will be processed according to our cancellation policy.
            </p>
          </div>

          {timeRemaining > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-amber-800">
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  Time remaining to cancel: <strong>{formatTimeRemaining(timeRemaining)}</strong>
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for cancellation (optional)
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please let us know why you're cancelling this order..."
              rows={3}
              className="w-full"
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isCancelling}
            >
              Keep Order
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              className="flex-1"
              disabled={isCancelling || timeRemaining <= 0}
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Order'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancelOrderModal;
