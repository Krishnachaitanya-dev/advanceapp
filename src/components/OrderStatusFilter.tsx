
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Package, Truck, Clock, AlertCircle } from 'lucide-react';

interface OrderStatusFilterProps {
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
  orderCounts: Record<string, number>;
}

const OrderStatusFilter: React.FC<OrderStatusFilterProps> = ({
  selectedStatus,
  onStatusChange,
  orderCounts
}) => {
  const statusOptions = [{
    value: 'confirmed',
    label: 'Confirmed',
    icon: CheckCircle,
    color: 'bg-blue-600 text-blue-100'
  }, {
    value: 'picked_up',
    label: 'Picked Up',
    icon: Package,
    color: 'bg-purple-600 text-purple-100'
  }, {
    value: 'in_process',
    label: 'In Process',
    icon: Clock,
    color: 'bg-orange-600 text-orange-100'
  }, {
    value: 'ready_for_delivery',
    label: 'Ready for Delivery',
    icon: Truck,
    color: 'bg-green-600 text-green-100'
  }, {
    value: 'delivered',
    label: 'Delivered',
    icon: CheckCircle,
    color: 'bg-green-700 text-green-100'
  }, {
    value: 'cancelled',
    label: 'Cancelled',
    icon: AlertCircle,
    color: 'bg-red-600 text-red-100'
  }, {
    value: null,
    label: 'All Orders',
    icon: null,
    color: 'bg-gray-600 text-gray-100'
  }];

  const handleValueChange = (value: string) => {
    onStatusChange(value === 'all' ? null : value);
  };

  const currentValue = selectedStatus || 'all';

  return <div className="bg-white border-2 border-blue-200 rounded-lg p-3 mb-6 shadow-lg">
      <h3 className="text-slate-800 font-semibold mb-2 text-sm">Filter by Status</h3>
      <Tabs value={currentValue} onValueChange={handleValueChange} className="w-full">
        <TabsList className="grid w-full grid-cols-7 bg-slate-100 p-0.5 border h-8">
          {statusOptions.map(status => {
          const Icon = status.icon;
          const count = status.value ? orderCounts[status.value] || 0 : Object.values(orderCounts).reduce((sum, count) => sum + count, 0);
          const tabValue = status.value || 'all';
          return <TabsTrigger key={tabValue} value={tabValue} className="flex items-center space-x-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-700 hover:text-slate-900 transition-colors border border-transparent data-[state=active]:border-blue-700 text-xs px-1 py-0.5 h-7">
                {Icon && <Icon className="w-3 h-3" />}
                <span className="hidden lg:inline truncate">{status.label}</span>
                <Badge className={`${status.color} border-0 text-xs px-1 py-0 min-w-[16px] h-4 flex items-center justify-center`}>
                  {count}
                </Badge>
              </TabsTrigger>;
        })}
        </TabsList>
      </Tabs>
    </div>;
};

export default OrderStatusFilter;
