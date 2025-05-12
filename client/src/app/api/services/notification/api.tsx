import { apiClient } from "../../axios/base";

export interface NotificationResponse {
  notifications: NotificationItem[];
}
export interface UserNotificationResponse {
  unread: UserNotificationItem[];
}

export interface UserNotificationItem {
  id: number;
  title: string;
  description: string;
  date: string;
  shipment: {
    shippingId: string;
    status: ShipmentStatus;
  };
}

export interface NotificationItem {
  id: number;
  title: string;
  description: string;
  date: string;            
  viewed: boolean;
  user: NotificationUser;  
  shipment: ShipmentPoint; 
}

export interface NotificationUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface ShipmentPoint {
  id: number;
  shippingId: string;
  status: ShipmentStatus;
}

export type ShipmentStatus =
  | 'PENDING'
  | 'ON_ROUTE_TO_COLLECT'
  | 'COLLECTED'
  | 'SHIPPED'
  | 'COMPLETED'
  | 'CANCELED';

//Get all notifications(admin)
export async function getAllAdminNotifications(): Promise<NotificationResponse> {
  const { data } = await apiClient.post<NotificationResponse>(
    `/alert/admin/allnotifications`,
    {},
    { withCredentials: true }
  );
  return data;
}
//Get all notifications(user)
export async function getAllUserNotifications(): Promise<UserNotificationResponse> {
  const { data } = await apiClient.post<UserNotificationResponse>(
    `/alert/users/allnotifications`,
    {},
    { withCredentials: true }
  );
  return data;
}