import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native"; // Import useRoute
import { Ionicons } from "@expo/vector-icons"; // For the three dots icon
import * as authApi from "../api/auth"; // Assuming you have auth API for logout

const AIScreen = () => {
  const navigation = useNavigation();
  const route = useRoute(); // To get data passed from the previous screen
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const { restaurant_id, table_id, ai_agent_id, userData } = route.params || {}; // Get data passed from BarcodeScanner
  // userData will be the response from the getUser request

  useEffect(() => {
    console.log("AIScreen received data:", {
      restaurant_id,
      table_id,
      ai_agent_id,
      userData,
    });
    // You can initialize the chat with a welcome message or AI introduction here
  }, [restaurant_id, table_id, ai_agent_id, userData]);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage = { text: inputText, user: true };
      setMessages([...messages, newMessage]);
      setInputText("");
      // Here you would typically send the message to your AI agent
      console.log(
        "Sending message to AI:",
        inputText,
        "with agent ID:",
        ai_agent_id
      );
      // You'd likely have an API call to send the message and receive a response
      // For now, let's simulate an AI response after a short delay
      setTimeout(() => {
        const aiResponse = {
          text: `AI response to: "${inputText}"`,
          user: false,
        };
        setMessages((currentMessages) => [...currentMessages, aiResponse]);
      }, 1000);
    }
  };

  const handleLogout = async () => {
    try {
      // Assuming your auth API has a logout function (optional)
      // await authApi.logout();
      // Clear any stored tokens/user data
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Logout error:", error.message);
      Alert.alert("Logout Failed", "Something went wrong during logout.");
    }
  };

  const handleReviewRestaurant = () => {
    // Navigate to the review restaurant screen (you'll need to create this)
    navigation.navigate("ReviewRestaurant", { restaurantId: restaurant_id });
  };

  const handleThreeDotsPress = () => {
    // You can implement a modal or an action sheet here to show the options
    Alert.alert(
      "Options",
      "Choose an action:",
      [
        { text: "Logout", onPress: handleLogout },
        { text: "Review Restaurant", onPress: handleReviewRestaurant },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Left: Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Top Right: Three Dots Button */}
      <TouchableOpacity
        style={styles.optionsButton}
        onPress={handleThreeDotsPress}
      >
        <Ionicons name="ellipsis-vertical" size={24} color="black" />
      </TouchableOpacity>

      <ScrollView style={styles.chatContainer}>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.message,
              msg.user ? styles.userMessage : styles.aiMessage,
            ]}
          >
            <Text>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="send" size={24} color="blue" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, // Adjust for status bar
    paddingHorizontal: 10,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
    padding: 10,
    zIndex: 1,
  },
  optionsButton: {
    position: "absolute",
    top: 20,
    right: 10,
    padding: 10,
    zIndex: 1,
  },
  chatContainer: {
    flex: 1,
    paddingBottom: 70, // Adjust for input container
  },
  message: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: "80%",
  },
  userMessage: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  aiMessage: {
    backgroundColor: "#ECECEC",
    alignSelf: "flex-start",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    padding: 10,
  },
});

export default AIScreen;
