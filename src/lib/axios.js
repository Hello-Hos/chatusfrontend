import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://chatusbackend-25nc.onrender.com/api",
  withCredentials: true,
});