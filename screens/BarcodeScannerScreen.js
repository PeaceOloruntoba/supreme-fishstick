import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as api from "../api/api";

const BarcodeScannerScreen = () => {
  const [hasPermission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const navigation = useNavigation();

  if (!hasPermission) {
    return <View />;
  }

  if (!hasPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", paddingBottom: 10 }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned || loadingUser) {
      return;
    }
    setScanned(true);

    const params = data.split("&").reduce((acc, item) => {
      const [key, value] = item.split("=");
      acc[key] = value;
      return acc;
    }, {});

    const restaurantId = params?.restaurantId ?? null;
    const tableId = params?.tableId ?? null;
    const aiAgentId = params?.aiAgentId ?? null;

    if (restaurantId) {
      setLoadingUser(true);
      try {
        const userResponse = await api.getUser(restaurantId);
        console.log("getUser response:", userResponse);
        setLoadingUser(false);
        navigation.navigate("AIScreen", {
          restaurant_id: restaurantId,
          table_id: params?.tableId,
          ai_agent_id: params?.aiAgentId,
          userData: userResponse?.data,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoadingUser(false);
        Alert.alert("Error", "Failed to retrieve restaurant information.");
        setScanned(false);
      }
    } else {
      Alert.alert(
        "Invalid Barcode",
        "The scanned barcode does not contain the required restaurant ID."
      );
      setScanned(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        type={CameraType}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      {loadingUser && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Fetching Restaurant Info...</Text>
        </View>
      )}
      {scanned && !loadingUser && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
      {!scanned && !loadingUser && (
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
    justifyContent: "center", // Adjusted to center content when permission is loading/denied
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
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "white",
    fontSize: 16,
  },
});

export default BarcodeScannerScreen;
