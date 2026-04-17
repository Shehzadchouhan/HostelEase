import axios from "axios";

// Create axios instance with environment variable
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

// 🔐 Attach token automatically (IMPORTANT for auth)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ================= AUTH =================

// Register user
export const registerUser = (data) => API.post("/auth/register", data);

// Login user
export const loginUser = (data) => API.post("/auth/login", data);

// ================= SHOPS =================

// Get all shops
export const getShops = () => API.get("/shops");

// Get shop by ID
export const getShopById = (id) => API.get(`/shops/${id}`);

// 🎯 Get nearby shops based on user location (within 2km)
export const getNearbyShops = (lat, lng) => 
  API.get("/shops/nearby", { params: { lat, lng } });

// ================= EXPORT DEFAULT =================
export default API;