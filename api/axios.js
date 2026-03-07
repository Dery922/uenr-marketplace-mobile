import axios from "axios";
import * as SecureStore from "expo-secure-store";

//192.168.8.162
//192.168.43.220

const API = axios.create({
  baseURL: "http://192.168.8.162:5000/api",
  timeout: 10000,
});

API.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
