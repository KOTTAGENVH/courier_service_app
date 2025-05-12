"use client";

import React from 'react';
import Drawer from '@/components/drawer';
import Header from '@/components/header';
import BgBlurLoader from '@/components/bgBlurLoader';
import { useDrawerContext } from '@/contextApi/drawerState';
import { useShipIDContext } from '@/contextApi/shipIDState';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cancelShipment, flagShipmentDelay, getOneShipment, getOneShipmentUser, updateShipmentStatus } from '../api/services/shipping/api';
import StatusBadge, { ShipmentStatus } from '@/components/shipments/statusBadge';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/global_redux/store';

export interface Notification {
    id: number;
    title: string;
    description: string;
    date: string;
    viewed: boolean;
}

export interface User {
    firstName: string;
    lastName: string;
    email: string;
}

export default function Page() {
    const [ismLoading, setIsMLoading] = React.useState(false);
    const router = useRouter();
    const { id } = useShipIDContext();
    const { status: drawerOpen, toggleDrawer } = useDrawerContext();
    const userEmail = useSelector((state: RootState) => state.user.email);
    const isAdmin = userEmail === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const queryKey = isAdmin ? ['oneShipment', id] : ['oneShipmentUser', id];
    const queryFn = () => isAdmin ? getOneShipment(id) : getOneShipmentUser(id);
    const { data, isLoading, isError } = useQuery({
        queryKey,
        queryFn,
        retry: 1,
        staleTime: 5 * 60 * 1000,
    });
    const queryClient = useQueryClient();

    if (!id) {
        router.push('/shipments');
    };
    const statusStyles: Record<ShipmentStatus, string> = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        ON_ROUTE_TO_COLLECT: 'bg-yellow-100 text-yellow-800',
        COLLECTED: 'bg-indigo-100 text-indigo-800',
        SHIPPED: 'bg-violet-100 text-violet-800',
        COMPLETED: 'bg-green-100 text-green-800',
        CANCELED: 'bg-red-100 text-red-800',
    };
    const handleStatusChange = async (newStatus: ShipmentStatus) => {
        try {
            setIsMLoading(true);
            const res = await updateShipmentStatus(id, newStatus);
            await queryClient.invalidateQueries({ queryKey: ['adminOneShipment', id] });
            if (res) {
                alert(`Shipment status updated to ${newStatus}`);
                setIsMLoading(false);
            }
        } catch (error) {
            console.error('Error updating shipment status:', error);
            setIsMLoading(false);
            //@ts-expect-error injected by your auth middleware
            alert(error?.response?.data?.error || 'Error updating shipment status');
        }
    };

    const handleCancel = async () => {
        try {
            setIsMLoading(true);
            const res = await cancelShipment(id);
            await queryClient.invalidateQueries({ queryKey });
            alert(res.message || 'Cancellation request submitted');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error cancelling shipment:', error);
            alert(error?.response?.data?.error || 'Error cancelling shipment');
        } finally {
            setIsMLoading(false);
        }
    };

    const handleFlagDelay = async () => {
        try {
            setIsMLoading(true);
            const res = await flagShipmentDelay(id);
            await queryClient.invalidateQueries({ queryKey });
            alert(res.message || 'Delay flagged successfully');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error flaging shipment:', error);
            alert(error?.response?.data?.error || 'Error flaging shipment');
        } finally {
            setIsMLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen dark:bg-[#525252] dark:bg-[linear-gradient(to_right,_#3d72b4,_#525252)] bg-[#8e9eab]   bg-[linear-gradient(to_right,_#eef2f3,_#8e9eab)] overflow-hidden">
            <Header />
            <Drawer isOpen={drawerOpen} toggleDrawerloc={() => toggleDrawer(false)} />

            <main className="flex-1 p-4 overflow-auto">
                {isLoading || ismLoading && <BgBlurLoader />}
                {isError && <div className="text-red-500">Error loading shipment data.</div>}

                {data && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-28">
                        <div className="bg-transparent  backdrop-blur-2xl shadow-2xl  rounded-lg p-8 bg-opacity-80 ">
                            <h2 className="text-lg font-semibold mb-2">Shipment Details</h2>
                            <p><span className="font-medium">ID:</span> {data.shippingId}</p>
                            <p><span className="font-medium">Status:</span> <StatusBadge status={data.status} /></p>
                            <p><span className="font-medium">Weight:</span> {data.weight} kg</p>
                            <p><span className="font-medium">Request Cancel:</span> {data.requestCancel ? 'Yes' : 'No'}</p>
                            <p><span className="font-medium">Delay Flag:</span> {data.delayFlag ? 'Yes' : 'No'}</p>
                        </div>

                        <div className="bg-transparent  backdrop-blur-2xl shadow-2xl  rounded-lg p-8 bg-opacity-80 ">
                            <h2 className="text-lg font-semibold mb-2">Sender Details</h2>
                            <p><span className="font-medium">Name:</span> {data.user.firstName} {data.user.lastName}</p>
                            <p><span className="font-medium">Email:</span> {data.user.email}</p>
                            <p><span className="font-medium">Sender Address:</span> {data.senderAddress}</p>
                        </div>

                        <div className="bg-transparent  backdrop-blur-2xl shadow-2xl  rounded-lg p-8 bg-opacity-80 ">
                            <h2 className="text-lg font-semibold mb-2">Receiver Details</h2>
                            <p><span className="font-medium">Name:</span> {data.receiverFirstName} {data.receiverLastName}</p>
                            <p><span className="font-medium">Address:</span> {data.receiverAddress}</p>
                            <p><span className="font-medium">Tel:</span> {data.receiverTelephone}</p>
                        </div>

                        <div className="bg-transparent  backdrop-blur-2xl shadow-2xl  rounded-lg p-8 bg-opacity-80 ">
                            <h2 className="text-lg font-semibold mb-2">Timeline</h2>
                            <p><span className="font-medium">Placed:</span> {data.placedDate ? new Date(data.placedDate).toLocaleString() : '-'}</p>
                            <p><span className="font-medium">Collected:</span> {data.collectedDate ? new Date(data.collectedDate).toLocaleString() : '-'}</p>
                            <p><span className="font-medium">Shipped:</span> {data.shippedDate ? new Date(data.shippedDate).toLocaleString() : '-'}</p>
                            <p><span className="font-medium">Completed:</span> {data.completedDate ? new Date(data.completedDate).toLocaleString() : '-'}</p>
                            <p><span className="font-medium">Canceled:</span> {data.canceledDate ? new Date(data.canceledDate).toLocaleString() : '-'}</p>
                        </div>

                        <div className="bg-transparent backdrop-blur-2xl shadow-2xl rounded-lg p-8 bg-opacity-80">
                            <h2 className="text-lg font-semibold mb-2">Other Details</h2>
                            <p><span className="font-medium">Flagged:</span> {data.delayFlag ? 'Yes' : 'No'}</p>
                            <p><span className="font-medium">Request to cancel:</span> {data.requestCancel ? 'Yes' : 'No'}</p>
                        </div>

                        <div className="bg-transparent backdrop-blur-2xl shadow-2xl rounded-lg p-8 bg-opacity-80">
                            <h2 className="text-lg font-semibold mb-2">Actions</h2>
                            {userEmail === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <button
                                        className={`${statusStyles.PENDING} cursor-pointer px-4 py-2 rounded text-sm font-semibold`}
                                        onClick={() => handleStatusChange('PENDING')}
                                        disabled={data.status === 'PENDING'}
                                    >Mark as Pending</button>
                                    <button
                                        className={`${statusStyles.COLLECTED} cursor-pointer px-4 py-2 rounded text-sm font-semibold`}
                                        onClick={() => handleStatusChange('COLLECTED')}
                                        disabled={data.status === 'COLLECTED'}
                                    >Mark as Collected</button>
                                    <button
                                        className={`${statusStyles.ON_ROUTE_TO_COLLECT} cursor-pointer px-4 py-2 rounded text-sm font-semibold`}
                                        onClick={() => handleStatusChange('ON_ROUTE_TO_COLLECT')}
                                        disabled={data.status === 'ON_ROUTE_TO_COLLECT'}
                                    >Mark as On route to be collected</button>
                                    <button
                                        className={`${statusStyles.SHIPPED} cursor-pointer px-4 py-2 rounded text-sm font-semibold`}
                                        onClick={() => handleStatusChange('SHIPPED')}
                                        disabled={data.status === 'SHIPPED'}
                                    >Mark as Shipped</button>
                                    <button
                                        className={`${statusStyles.COMPLETED} cursor-pointer px-4 py-2 rounded text-sm font-semibold`}
                                        onClick={() => handleStatusChange('COMPLETED')}
                                        disabled={data.status === 'COMPLETED'}
                                    >Mark as Completed</button>
                                    <button
                                        className={`${statusStyles.CANCELED} cursor-pointer px-4 py-2 rounded text-sm font-semibold`}
                                        onClick={() => handleStatusChange('CANCELED')}
                                        disabled={data.status === 'CANCELED'}
                                    >Mark as Canceled</button>
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <button
                                        className={`bg-red-500 cursor-pointer px-4 py-2 rounded text-sm font-semibold`}
                                        onClick={() => handleCancel()}
                                    >Cancel</button>
                                    <button
                                        className={`${statusStyles.ON_ROUTE_TO_COLLECT} cursor-pointer px-4 py-2 rounded text-sm font-semibold`}
                                        onClick={() => handleFlagDelay()}
                                    >Flag delay</button>
                                </div>
                            )}
                        </div>


                    </div>
                )}
            </main>
        </div>
    );
}
