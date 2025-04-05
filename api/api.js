import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "https://nikita-backend.onrender.com/api/v1";

export const getUser = async (restaurantId) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.post(
      `${API_BASE_URL}/profile/restaurants/${restaurantId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const sendChatMessage = async (message) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.post(
      `${API_BASE_URL}/ai/chat`,
      { message },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const sendAudioMessage = async (message) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.post(
      `${API_BASE_URL}/ai/audio-chat`,
      { message },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getChatHistory = async (threadId) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.get(`${API_BASE_URL}/ai/chat-messages`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const postReview = async (message, restaurantId) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.post(
      `${API_BASE_URL}/post-review/${restaurantId}`,
      { message },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export default {
  getUser,
  sendChatMessage,
  sendAudioMessage,
  getChatHistory,
};
