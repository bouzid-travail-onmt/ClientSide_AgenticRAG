import axios from "axios";

const apiAdmin = axios.create({
  baseURL: "http://192.168.0.102:8000/api/admin",
});

apiAdmin.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiAdmin;
