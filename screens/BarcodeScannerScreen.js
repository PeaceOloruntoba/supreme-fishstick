import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import { Camera } from "expo-camera";
import { useNavigation } from "@react-navigation/native"; // If using react-navigation

const BarcodeScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState(null);
  const navigation = useNavigation(); // If using react-navigation

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

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setBarcodeData({ type, data });
    Alert.alert(
      "Barcode Scanned!",
      `Type: ${type}\nData: ${data}`,
      [
        { text: "OK", onPress: () => setScanned(false) },
        {
          text: "Use Data",
          onPress: () => {
            // Save or pass this barcodeData to the rest of your app
            console.log("Barcode Data:", { type, data });
            // You might navigate to another screen to display or use this data
            // navigation.navigate('SomeOtherScreen', { barcode: { type, data } });
            setScanned(false);
          },
        },
      ],
      { cancelable: false }
    );
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
