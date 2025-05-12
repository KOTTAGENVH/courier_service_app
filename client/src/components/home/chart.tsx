// Chart.tsx
import React, { useRef, useEffect, useMemo } from 'react';
import Chart from 'chart.js/auto';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/global_redux/store';
import { useShipIDContext } from '@/contextApi/shipIDState';
import {
    getAllShipmentsAdmin,
    getAllShipmentsUser,

} from '@/app/api/services/shipping/api';

interface ShippingItem {
    shippingId: string
    senderAddress: string
    receiverFirstName: string
    receiverLastName: string
    receiverAddress: string
    receiverTelephone: string
    status: 'PENDING' | 'COLLECTED' | 'SHIPPED' | 'COMPLETED' | 'CANCELED' | 'ON_ROUTE_TO_COLLECT'
    requestCancel: boolean
    placedDate: string
    collectedDate: string | null
    shippedDate: string | null
    completedDate: string | null
    canceledDate: string | null
    delayFlag: boolean
    weight: number
    notifications: Notification[]
    user: User
}

export interface Notification {
    id: number
    title: string
    description: string
    date: string
    viewed: boolean
    userId?: number
    shipmentId?: number
}

export interface User {
    firstName: string
    lastName: string
    email: string
    address?: string
    telephone?: string
    password?: string
}

type ShippingData = {
    ReturnMessage: {
        shippingItems: ShippingItem[]
    }
}

const ChartComponent: React.FC = () => {
    const { id } = useShipIDContext();
    const userEmail = useSelector((state: RootState) => state.user.email);
    const isAdmin = userEmail === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const queryKey = isAdmin ? ['adminShipments', id] : ['userShipments', id];
    const queryFn = () => (isAdmin ? getAllShipmentsAdmin() : getAllShipmentsUser());

    const { data, isLoading, isError } = useQuery<ShippingData, Error>({
        queryKey,
        queryFn,
        retry: 1,
        staleTime: 5 * 60 * 1000,
    });

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart | null>(null);

    const shipments: ShippingItem[] = data?.ReturnMessage.shippingItems ?? [];

    const statusCounts = useMemo(() => {
        return shipments.reduce<Record<string, number>>((acc, s) => {
            acc[s.status] = (acc[s.status] ?? 0) + 1;
            return acc;
        }, {});
    }, [shipments]);

    const chartData = useMemo(() => ({
        labels: Object.keys(statusCounts),
        datasets: [
            {
                data: Object.values(statusCounts),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                ].slice(0, Object.keys(statusCounts).length),
            },
        ],
    }), [statusCounts]);

    const isDarkMode =
        typeof window !== 'undefined' &&
        document.documentElement.classList.contains('dark');

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const options: Chart['options'] = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: isDarkMode ? '#fff' : '#000',
                },
            },
            tooltip: {
                callbacks: {
                    label: ctx => {
                        const label = ctx.label ?? '';
                        const value = ctx.parsed as number;
                        return `${label}: ${value}`;
                    },
                },
            },
        },
    };

    useEffect(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        chartRef.current = new Chart(ctx, {
            type: 'pie',
            data: chartData,
            options,
        });

        return () => {
            chartRef.current?.destroy();
        };
    }, [chartData, options]);

    if (isLoading) return <div>Loading chart…</div>;
    if (isError) return <div>Error loading shipments.</div>;

    return (
        <div className="w-auto mx-full ">
            <h2 className='dark:text-white text-black'>Shipments by Status</h2>
            <canvas ref={canvasRef} />
        </div>
    );
};

export default ChartComponent;
