// App.js (Example - adjust based on your actual file)
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignupScreen from "./screens/SignupScreen";
import LoginScreen from "./screens/LoginScreen";
import BarcodeScannerScreen from "./screens/BarcodeScannerScreen";
import AIScreen from "./screens/AIScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="BarcodeScanner" component={BarcodeScannerScreen} />
        <Stack.Screen name="AIScreen" component={AIScreen} />
        {/* ... other screens */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
