import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const AIScreen = () => {
  const route = useRoute();

  // Safely extract parameters with defaults
  const {
    restaurant_id = null,
    table_id = null,
    ai_agent_id = null,
    userData = null,
  } = route.params || {};

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "ai",
      text: "Welcome! Ask me anything about the restaurant.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5555/api/ai/chat", {
        prompt: input,
        restaurant_id,
        table_id,
        ai_agent_id,
        userData,
      });

      const aiResponse = response.data.message;

      setMessages((prev) => [...prev, { from: "ai", text: aiResponse }]);
    } catch (error) {
      console.error("Error communicating with AI:", error);
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "Sorry, something went wrong. Try again!" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/ai.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          style={styles.chatContainer}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                msg.from === "user" ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text
                style={msg.from === "user" ? styles.userText : styles.aiText}
              >
                {msg.text}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Ask something..."
            value={input}
            onChangeText={setInput}
            style={styles.textInput}
            editable={!isLoading}
          />
          <TouchableOpacity onPress={handleSend} disabled={isLoading}>
            <Ionicons name="send" size={24} color="#FF6B00" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default AIScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "flex-end",
  },
  chatContainer: {
    flex: 1,
    marginTop: 50,
  },
  messageBubble: {
    padding: 12,
    marginVertical: 6,
    maxWidth: "80%",
    borderRadius: 12,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#FF6B00",
  },
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  userText: {
    color: "white",
    fontSize: 16,
  },
  aiText: {
    color: "#333",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: "white",
    borderRadius: 30,
    marginBottom: 24,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingRight: 10,
  },
});
