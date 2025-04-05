import axios from "axios";

const API_BASE_URL = "https://nikita-backend.onrender.com/api/v1/auth";

export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, credentials);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user`, credentials);
    return response;
  } catch (error) {
    throw error;
  }
};

// You might have other API calls here, e.g., for fetching data using the token
