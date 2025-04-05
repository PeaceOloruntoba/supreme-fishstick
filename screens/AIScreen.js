import React, { useState, useEffect } from "react";
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
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons, Entypo, FontAwesome } from "@expo/vector-icons";
import * as api from "../api/api";

const AIScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { restaurant_id, table_id, ai_agent_id, userData } = route.params || {};

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "ai", text: "Welcome! Ask me anything about the restaurant." },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [reviewType, setReviewType] = useState("positive");
  const [reviewMessage, setReviewMessage] = useState("");
  const [supportsText, setSupportsText] = useState(false);
  const [supportsAudio, setSupportsAudio] = useState(false);
  const [supportsVideo, setSupportsVideo] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);

  useEffect(() => {
    if (userData?.restaurant) {
      setSupportsText(
        userData.restaurant.text_support ||
          userData.restaurant.audio_support ||
          userData.restaurant.video_support
      );
      setSupportsAudio(
        userData.restaurant.audio_support || userData.restaurant.video_support
      );
      setSupportsVideo(userData.restaurant.video_support);
    }
  }, [userData]);

  console.log(userData);

  const handleSend = async () => {
    if (!input.trim() || !supportsText) return;

    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    const setup = {
      message: input,
      ai_agent_id,
    };

    try {
      const response = await api.sendChatMessage(setup);
      console.log(response);
      const aiResponse = response.data.message;
      setMessages((prev) => [...prev, { from: "ai", text: aiResponse }]);
    } catch (error) {
      console.error("Error communicating with AI:", error);
      Alert.alert("Error", "Failed to send message.");
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "Sorry, something went wrong. Try again!" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleOpenReviewModal = () => {
    setIsMenuVisible(false);
    setIsReviewModalVisible(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalVisible(false);
    setReviewType("positive");
    setReviewMessage("");
  };

  const handleSubmitReview = async () => {
    if (!reviewMessage.trim() || !restaurant_id) {
      Alert.alert("Error", "Please enter a review message.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.postReview(reviewMessage, restaurant_id);
      Alert.alert("Success", "Your review has been submitted.");
      handleCloseReviewModal();
    } catch (error) {
      console.error("Error submitting review:", error);
      Alert.alert("Error", "Failed to submit review.");
    } finally {
      setIsLoading(false);
    }
  };

  const startAudioRecording = () => {
    if (!supportsAudio) {
      Alert.alert(
        "Audio Not Supported",
        "This restaurant does not support audio chat."
      );
      return;
    }
    // Implement audio recording logic using Expo AV
    setIsRecordingAudio(true);
    Alert.alert("Recording", "Start speaking..."); // Placeholder
  };

  const stopAudioRecording = () => {
    setIsRecordingAudio(false);
    Alert.alert("Recording Stopped", "Processing audio..."); // Placeholder
    // Implement stop and send audio logic
  };

  const handleVideoChat = () => {
    if (!supportsVideo) {
      Alert.alert(
        "Video Not Supported",
        "This restaurant does not support video chat."
      );
      return;
    }
    Alert.alert(
      "Video Chat",
      "Video chat functionality will be implemented here."
    );
  };

  return (
    <ImageBackground
      source={require("../assets/ai.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={handleToggleMenu} style={styles.menuIcon}>
          <Entypo name="dots-three-vertical" size={24} color="white" />
        </TouchableOpacity>
        {isMenuVisible && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              onPress={handleOpenReviewModal}
              style={styles.menuItem}
            >
              <Text>Post Review</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          style={styles.chatContainer}
          contentContainerStyle={{ paddingBottom: 80 }}
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
          {isLoading && (
            <View style={styles.loading}>
              <ActivityIndicator size="small" color="#FF6B00" />
            </View>
          )}
        </ScrollView>

        <View style={styles.inputArea}>
          {supportsAudio && (
            <TouchableOpacity
              onPress={
                isRecordingAudio ? stopAudioRecording : startAudioRecording
              }
              style={styles.audioButton}
            >
              <FontAwesome
                name={isRecordingAudio ? "stop-circle" : "microphone"}
                size={24}
                color={isRecordingAudio ? "red" : "gray"}
              />
            </TouchableOpacity>
          )}
          <TextInput
            placeholder="Ask something..."
            value={input}
            onChangeText={setInput}
            style={[styles.textInput, !supportsText && styles.disabledInput]}
            editable={!isLoading && supportsText}
          />
          {supportsText && (
            <TouchableOpacity
              onPress={handleSend}
              style={styles.sendButton}
              disabled={isLoading || !supportsText}
            >
              <Ionicons name="send" size={24} color="#FF6B00" />
            </TouchableOpacity>
          )}
          {supportsVideo && (
            <TouchableOpacity
              onPress={handleVideoChat}
              style={styles.videoButton}
            >
              <Ionicons name="videocam" size={24} color="gray" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Review Modal */}
      <Modal
        visible={isReviewModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Submit Review</Text>
            <View style={styles.reviewTypeContainer}>
              <Text style={styles.reviewLabel}>Review Type:</Text>
              <TouchableOpacity
                style={[
                  styles.reviewTypeButton,
                  reviewType === "positive" && styles.reviewTypeButtonActive,
                ]}
                onPress={() => setReviewType("positive")}
              >
                <Text
                  style={
                    reviewType === "positive" &&
                    styles.reviewTypeButtonTextActive
                  }
                >
                  Positive
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.reviewTypeButton,
                  reviewType === "neutral" && styles.reviewTypeButtonActive,
                ]}
                onPress={() => setReviewType("neutral")}
              >
                <Text
                  style={
                    reviewType === "neutral" &&
                    styles.reviewTypeButtonTextActive
                  }
                >
                  Neutral
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.reviewTypeButton,
                  reviewType === "negative" && styles.reviewTypeButtonActive,
                ]}
                onPress={() => setReviewType("negative")}
              >
                <Text
                  style={
                    reviewType === "negative" &&
                    styles.reviewTypeButtonTextActive
                  }
                >
                  Negative
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.reviewLabel}>Message:</Text>
            <TextInput
              style={styles.reviewInput}
              multiline
              value={reviewMessage}
              onChangeText={setReviewMessage}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCloseReviewModal}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitReview}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? "Submitting..." : "Submit"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingHorizontal: 16,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    paddingBottom: 10,
  },
  menuIcon: {
    padding: 10,
  },
  dropdownMenu: {
    position: "absolute",
    top: Platform.OS === "ios" ? 90 : 60,
    right: 16,
    backgroundColor: "white",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    padding: 10,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "flex-end",
  },
  chatContainer: {
    flex: 1,
    marginTop: 20,
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
  inputArea: {
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
  disabledInput: {
    backgroundColor: "#eee",
    color: "#999",
  },
  sendButton: {
    marginLeft: 10,
    padding: 8,
  },
  audioButton: {
    padding: 8,
    marginRight: 10,
  },
  videoButton: {
    marginLeft: 10,
    padding: 8,
  },
  loading: {
    alignItems: "center",
    marginTop: 10,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  reviewLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    minHeight: 80,
    textAlignVertical: "top",
  },
  reviewTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  reviewTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  reviewTypeButtonActive: {
    backgroundColor: "#FF6B00",
    borderColor: "#FF6B00",
  },
  reviewTypeButtonTextActive: {
    color: "white",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: "#FF6B00",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
});

export default AIScreen;
