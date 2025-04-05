import axios from "axios";

const API_BASE_URL = "https://localhost:5555/api/v1";

export const getUser = async (userData) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/user`, userData);
    return response;
  } catch (error) {
    throw error;
  }
};


// You might have other API calls here, e.g., for fetching data using the token
