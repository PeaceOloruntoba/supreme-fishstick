import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "https://nikita-backend.onrender.com/api/v1";

export const getUser = async (restaurantId) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.get(
      `${API_BASE_URL}/profile/get/${restaurantId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    return response;
  } catch (error) {
    console.log(error.response);
    throw error;
  }
};

export const sendChatMessage = async (setup) => {
  const { message, ai_agent_id } = setup;
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.post(
      `${API_BASE_URL}/ai/chat`,
      { ai_agent_id, message },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
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

export const getChatHistory = async () => {
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
  postReview,
};
