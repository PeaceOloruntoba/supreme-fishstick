import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import { Camera } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import * as api from "../api/api";

const BarcodeScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    console.log("Barcode data:", { type, data });

    // Assuming the barcode data contains something like:
    // "restaurantId=123&tableId=456&aiAgentId=789"
    const params = data.split("&").reduce((acc, item) => {
      const [key, value] = item.split("=");
      acc[key] = value;
      return acc;
    }, {});

    const { restaurantId, tableId, aiAgentId } = params;

    if (restaurantId && tableId && aiAgentId) {
      try {
        // Make the getUser request to your backend
        const userResponse = await api.getUser({
          restaurantId: restaurantId,
          tableId: tableId,
          barcodeData: data, // You might send the raw barcode data too
        });

        console.log("getUser response:", userResponse.data);

        // Navigate to the AI screen and pass the necessary data
        navigation.navigate("AIScreen", {
          restaurant_id: restaurantId,
          table_id: tableId,
          ai_agent_id: aiAgentId,
          userData: userResponse.data, // Pass the user data received
        });
      } catch (error) {
        console.error(
          "Error fetching user data:",
          error.response ? error.response.data : error.message
        );
        Alert.alert("Error", "Failed to retrieve user information.");
        setScanned(false); // Allow scanning again
      }
    } else {
      Alert.alert(
        "Invalid Barcode",
        "The scanned barcode does not contain the required information."
      );
      setScanned(false); // Allow scanning again
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFillObject}
        type={Camera.Constants.Type.back}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
      {!scanned && (
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            Point the camera at the barcode
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  instructionContainer: {
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 20,
    alignItems: "center",
  },
  instructionText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
});

export default BarcodeScannerScreen;
