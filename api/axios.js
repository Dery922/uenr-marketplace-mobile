import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "./demon";

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

API.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");

  // Add debug logs
  console.log("=== Axios Interceptor Debug ===");
  console.log("Token exists:", !!token);
  console.log("Token value:", token ? token.substring(0, 20) + "..." : "null");
  console.log("Request URL:", config.url);
  console.log("Request method:", config.method);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

//export const BASE_URL = `http://${IP_ADDRESS}:5000/api`;

export default API;
