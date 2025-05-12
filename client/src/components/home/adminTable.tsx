// AdminTable.tsx
import React, { useMemo } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from 'material-react-table';
import { useQuery } from '@tanstack/react-query';
import {
    getAllAdminNotifications,
    type NotificationResponse,
    type NotificationItem,
} from '@/app/api/services/notification/api';

const AdminTable: React.FC = () => {
    const { data, isLoading, isError } = useQuery<NotificationResponse, Error>({
        queryKey: ['adminNotifications'],
        queryFn: () => getAllAdminNotifications(),
        retry: 1,
        staleTime: 5 * 60 * 1000,
    });

    const notifications: NotificationItem[] = data?.notifications ?? [];

    const columns = useMemo<MRT_ColumnDef<NotificationItem>[]>(
        () => [
            {
                accessorKey: 'title',
                header: 'Title',
                size: 200,
            },
            {
                accessorKey: 'description',
                header: 'Description',
                size: 300,
            },
            {
                accessorKey: 'date',
                header: 'Date',
                size: 180,
                Cell: ({ cell }) => {
                    const raw = cell.getValue<string>();
                    const dt = new Date(raw);
                    return dt.toLocaleString('en-GB', {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    });
                },
            },
            {
                accessorKey: 'viewed',
                header: 'Viewed',
                size: 80,
                Cell: ({ cell }) => (cell.getValue<boolean>() ? 'Yes' : 'No'),
            },
            {
                accessorKey: 'user.email',
                header: 'User Email',
                size: 200,
            },
            {
                accessorKey: 'user.firstName',
                header: 'First Name',
                size: 150,
            },
            {
                accessorKey: 'user.lastName',
                header: 'Last Name',
                size: 150,
            },
            {
                accessorKey: 'shipment.shippingId',
                header: 'Shipping ID',
                size: 200,
            },
            {
                accessorKey: 'shipment.status',
                header: 'Status',
                size: 150,
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data: notifications,
    });

    if (isLoading) return <div>Loading notifications…</div>;
    if (isError) return <div>Error loading notifications.</div>;

    return <MaterialReactTable table={table} />;
};

export default AdminTable;
