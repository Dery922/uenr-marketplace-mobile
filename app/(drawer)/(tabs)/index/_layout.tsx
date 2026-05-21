import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import { useSelector } from "react-redux";

export default function HomeStackLayout() {
    const darkMode = useSelector((state) => state.theme.darkMode);
  return (
    <Stack screenOptions={{ headerShown: false, 
          contentStyle: {
      backgroundColor: darkMode ? "#0F172A" : "#FFFFFF",
    },
        tabBarIcon: ({ color, focused }) => (
            <Ionicons size={24} name={focused ? "chatbubble" : "chatbubble-outline"} color={color} />
          ), }}>
      {/* The main dashboard landing view */}
      {/* <Stack.Screen name="index" /> 

      <Stack.Screen name="printing" />
      <Stack.Screen name="campus-housing" />
      <Stack.Screen name="campus-events" />
      <Stack.Screen name="privacy-policy" />
      <Stack.Screen name="terms-conditions" /> */}
    </Stack>
  );
}
