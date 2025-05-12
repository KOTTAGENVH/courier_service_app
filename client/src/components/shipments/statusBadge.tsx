import { ShippingItem } from '@/app/api/services/shipping/api';
import React from 'react';

export type ShipmentStatus = ShippingItem['status'];

const statusStyles: Record<ShipmentStatus,string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
    ON_ROUTE_TO_COLLECT: 'bg-yellow-100 text-yellow-800',
  COLLECTED: 'bg-indigo-100 text-indigo-800',
  SHIPPED: 'bg-violet-100 text-violet-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELED: 'bg-red-100 text-red-800',
};

const StatusBadge = ({ status }: { status: ShipmentStatus }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
  >
    {status.replace(/_/g, ' ')}
  </span>
);

export default StatusBadge;
