import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native"; // If using react-navigation
import * as authApi from "../api/auth"; // Assuming you have an auth API file

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation(); // If using react-navigation

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const userData = {
      email,
      password,
    };

    try {
      const response = await authApi.login(userData);
      console.log("Login successful:", response.data);
      // Save the token and user data
      // Navigate to the barcode scanner screen
      navigation.navigate("BarcodeScanner"); // If using react-navigation
    } catch (error) {
      console.error(
        "Login error:",
        error.response ? error.response.data : error.message
      );
      Alert.alert(
        "Login Failed",
        error.response
          ? error.response.data.message || "Invalid credentials"
          : "Something went wrong"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Log In" onPress={handleLogin} />
      <Button
        title="Don't have an account? Sign Up"
        onPress={() => navigation.navigate("Signup")} // If using react-navigation
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});

export default LoginScreen;
