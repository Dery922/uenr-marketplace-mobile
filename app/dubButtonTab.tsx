import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { darkTheme, lightTheme } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useSocketEvents } from "@/hooks/useSocketEvents";
import { fetchUnreadCount } from "@/store/slices/chatSlice";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { unreadCount } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const darkMode = useSelector((state: any) => state.theme.darkMode);

  const theme = darkMode ? darkTheme : lightTheme;

  // Fetch unread count when user is logged in
  useEffect(() => {
    if (user) {
      dispatch(fetchUnreadCount());

      // Refresh every 30 seconds
      const interval = setInterval(() => {
        dispatch(fetchUnreadCount());
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user, dispatch]);

  useSocketEvents();
  // List of tabs to hide from tab bar
  const hiddenTabs = [
    "printing",
    "campus-housing",
    "privacy-policy",
    "terms-conditions",
    "campus-events",
  ];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarShowLabel: false,

        tabBarActiveTintColor: "#0EA5E9",
        tabBarInactiveTintColor: "#94A3B8",

        tabBarStyle: styles.tabBar,

        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
        ),

        tabBarButton: (props) => (
          <TouchableOpacity
            {...props}
            activeOpacity={0.9}
            style={[props.style, styles.tabButton]}
          />
        ),
      }}
    >
      {/* 🚀 Points directly to the index directory stack wrapper */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[styles.iconWrapper, focused && styles.activeIconWrapper]}
            >
              <Ionicons
                size={24}
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={24}
              name={focused ? "chatbubble" : "chatbubble-outline"}
              color={color}
            />
          ),
        }}
      />
 <Tabs.Screen
  name="sell"
  options={{
    title: "Sell",
    tabBarIcon: ({ focused }) => (
      <View
        style={[
          styles.sellButton,
          focused && styles.sellButtonActive,
        ]}
      >
        <Ionicons
          size={26}
          name="add"
          color="#FFF"
        />
      </View>
    ),
  }}
/>
      <Tabs.Screen
        name="profile"
        options={{
          title: "You",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={24}
              name={focused ? "person" : "person-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="printing"
        options={{
          title: "Printing",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={24}
              name={focused ? "print" : "print-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",

    left: 16,
    right: 16,
    bottom: 18,

    height: 74,

    borderRadius: 30,

    backgroundColor: "rgba(255,255,255,0.75)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",

    paddingHorizontal: 12,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 20,

    elevation: 10,

    overflow: "hidden",
  },

  tabButton: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  iconWrapper: {
    width: 46,
    height: 46,

    borderRadius: 23,

    justifyContent: "center",
    alignItems: "center",
  },

  activeIconWrapper: {
    backgroundColor: "rgba(14,165,233,0.12)",
  },

  sellButton: {
    width: 58,
    height: 58,

    borderRadius: 29,

    backgroundColor: "#0EA5E9",

    justifyContent: "center",
    alignItems: "center",

    marginTop: -22,

    shadowColor: "#0EA5E9",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.35,
    shadowRadius: 12,

    elevation: 10,
  },

  sellButtonActive: {
    transform: [{ scale: 1.05 }],
  },
});
