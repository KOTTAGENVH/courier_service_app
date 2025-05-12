import axios from "axios";

// Api Client
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL, 
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export { apiClient };