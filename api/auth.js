import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://nikita-backend.onrender.com/api/v1/auth",
  timeout: 15000, // 15 seconds
});

export const signup = async (userData) => {
  try {
    const response = await axiosInstance.post("/register", userData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post("/login", credentials);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUser = async (credentials) => {
  try {
    const response = await axiosInstance.post("/user", credentials);
    return response;
  } catch (error) {
    throw error;
  }
};
