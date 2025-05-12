import { apiClient } from "../../axios/base";

export interface ShippingPayload {
  senderAddress: string;
  receiverFirstName: string;
  receiverLastName: string;
  receiverAddress: string;
  receiverTelephone: string;
  userEmail: string;
  weight: number;
}

export interface ShippingResponse {
  success: boolean;
  message: string;
}

export interface ShippingItem {
  shippingId: string;
  senderAddress: string;
  receiverFirstName: string;
  receiverLastName: string;
  receiverAddress: string;
  receiverTelephone: string;
  status: "PENDING" | "ON_ROUTE_TO_COLLECT" | "COLLECTED" | "SHIPPED" | "COMPLETED" | "CANCELED";
  requestCancel: boolean;
  placedDate: string;
  collectedDate: string | null;
  shippedDate: string | null;
  completedDate: string | null;
  canceledDate: string | null;
  delayFlag: boolean;
  weight: number;
  notifications: {
    id: number;
    title: string;
    description: string;
    date: string;
    viewed: boolean;
  }[];
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface GetAllShipmentsResponse {
  ReturnMessage: {
    shippingItems: ShippingItem[];
  };
}

export interface GetOneShipmentResponse {
  ReturnMessage: { shippingItem: ShippingItem };
}

//Shipping
export async function newShipment(
  payload: ShippingPayload
): Promise<ShippingResponse> {
  const { data } = await apiClient.post<ShippingResponse>(
    "/ship/shipments",
    payload,
    { withCredentials: true }
  );
  return data;
}

//Get all shipments Admin
export async function getAllShipmentsAdmin(): Promise<GetAllShipmentsResponse> {
  const { data } = await apiClient.get<GetAllShipmentsResponse>(
    "/ship/admin/shipments",
    { withCredentials: true }
  );
  return data;
}



//Get all shipments User
export async function getAllShipmentsUser(): Promise<GetAllShipmentsResponse> {
  const { data } = await apiClient.get<GetAllShipmentsResponse>(
    "/ship/users/shipments",
    { withCredentials: true }
  );
  return data;
}

//Get one shipment (admin)
export async function getOneShipment(id: string): Promise<ShippingItem> {
  const { data } = await apiClient.get<GetOneShipmentResponse>(
    `/ship/admin/shipments/${id}`,
    { withCredentials: true }
  );
  return data.ReturnMessage.shippingItem;
}

//Get one shipment (user)
export async function getOneShipmentUser(id: string): Promise<ShippingItem> {
  const { data } = await apiClient.get<GetOneShipmentResponse>(
    `/ship/users/shipments/${id}`,
    { withCredentials: true }
  );
  return data.ReturnMessage.shippingItem;
}


//Update shipment status
export async function updateShipmentStatus(
  id: string,
  status: string
): Promise<ShippingResponse> {
  const { data } = await apiClient.patch<ShippingResponse>(
    `/ship/admin/shipments/status/${id}`,
    { status },
    { withCredentials: true }
  );
  return data;
}

//Cancel shipment
export async function cancelShipment(
  id: string
): Promise<ShippingResponse> {
  const { data } = await apiClient.patch<ShippingResponse>(
    `/ship/users/shipments/cancel/${id}`,
    {},
    { withCredentials: true }
  );
  return data;
}

//Flag shipment delay
export async function flagShipmentDelay(
  id: string
): Promise<ShippingResponse> {
  const { data } = await apiClient.patch<ShippingResponse>(
    `/ship/users/shipments/delay/${id}`,
    {},
    { withCredentials: true }
  );
  return data;
}