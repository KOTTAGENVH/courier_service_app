import { apiClient } from "../../axios/base";

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  telephone: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  telephone: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  details?: { field: string; constraints: Record<string, string> }[];
}

//Login
export const login = async (email: string, password: string) => {
  const response = await apiClient.post("/auth/login", {
    email,
    password,
  },
    { withCredentials: true });
  return response;
};

//Signup
export async function signup(
  payload: SignupPayload
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(
    "/auth/signup",
    payload,
    { withCredentials: true }
  );
  return data;
}

//Logout
export async function logout(): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(
    "/auth/logout",
    {},
    { withCredentials: true }
  );
  return data;
}

//Forget Password
export async function forgetPassword(
  email: string
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(
    "/auth/forgot-password",
    { email },
    { withCredentials: true }
  );
  return data;
}

//Reset Password
export async function resetPassword(
  password: string,
  confirmPassword: string,
  token: string
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(
    "/auth/reset-password",
    { password, confirmPassword, token },
    { withCredentials: true }
  );
  return data;
}