import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, Alert } from "react-native";
import CheckBox from "@react-native-community/checkbox"; // Standard import for CheckBox
import { useNavigation } from "@react-navigation/native";
import * as authApi from "../api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignupScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigation = useNavigation();

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      Alert.alert("Error", "Please agree to the terms and conditions.");
      return;
    }

    const userData = {
      email,
      password,
      role: "user",
    };

    try {
      const response = await authApi.signup(userData);
      console.log("Signup successful:", response.data);
      if (response.data && response.data.token) {
        await AsyncStorage.setItem("authToken", response.data.token);
        console.log("Token saved successfully!");
        navigation.navigate("BarcodeScanner");
      } else {
        Alert.alert(
          "Signup Successful",
          "Account created, but no token received."
        );
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error(
        "Signup error:",
        error.response ? error.response.data : error.message
      );
      Alert.alert(
        "Signup Failed",
        error.response
          ? error.response.data.message || "Something went wrong"
          : "Something went wrong"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <View style={styles.termsContainer}>
        <CheckBox value={agreeTerms} onValueChange={setAgreeTerms} />
        <Text style={styles.termsText}>Agree to terms and conditions</Text>
      </View>
      <Button title="Sign Up" onPress={handleSignup} />
      <Button
        title="Already have an account? Log In"
        onPress={() => navigation.navigate("Login")}
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
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  termsText: {
    marginLeft: 10,
  },
});

export default SignupScreen;
