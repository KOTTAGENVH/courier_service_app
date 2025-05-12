// UserTable.tsx
import React, { useMemo } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from 'material-react-table';
import { useQuery } from '@tanstack/react-query';
import {
    getAllUserNotifications,
    UserNotificationItem,
    UserNotificationResponse,
} from '@/app/api/services/notification/api';

const UserTable: React.FC = () => {
    const { data, isLoading, isError } = useQuery<UserNotificationResponse, Error>({
        queryKey: ['userNotifications'],
        queryFn: () => getAllUserNotifications(),
        retry: 1,
        staleTime: 5 * 60 * 1000,
    });

    // adjust to your actual response shape
    const notifications: UserNotificationItem[] = data?.unread ?? [];

    const columns = useMemo<MRT_ColumnDef<UserNotificationItem>[]>(
        () => [
            {
                accessorKey: 'title',
                header: 'Title',
                size: 200,
            },
            {
                accessorKey: 'shipment.shippingId',
                header: 'Shipping ID',
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

export default UserTable;
