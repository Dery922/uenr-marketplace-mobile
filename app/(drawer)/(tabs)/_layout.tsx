import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, TouchableOpacity, View } from "react-native";

import { useSocketEvents } from "@/hooks/useSocketEvents";
import { fetchUnreadCount } from "@/store/slices/chatSlice";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { unreadCount } = useSelector((state: any) => state.chat);
  const { user } = useSelector((state: any) => state.auth);
  const darkMode = useSelector((state: any) => state.theme.darkMode);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (user) {
      dispatch(fetchUnreadCount());
      const interval = setInterval(() => {
        dispatch(fetchUnreadCount());
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user, dispatch]);

  useSocketEvents();

  const hiddenTabs = [
    "index",
    "printing",
    "campus-housing", 
    "privacy-policy",
    "terms-conditions",
    "campus-events"
  ];

  const animatePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.12,
      useNativeDriver: true,
      friction: 4,
    }).start();
  };

  const animatePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.0,
      useNativeDriver: true,
      friction: 4,
    }).start();
  };

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: "#00BFFF",
        tabBarInactiveTintColor: "#94A3B8",
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
        // ✅ CRITICAL FIX 1: Forces uniform internal layout calculations and centers icon/label content pairs
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 8,
        },
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: darkMode ? "rgba(15, 23, 42, 0.85)" : "rgba(255, 255, 255, 0.85)",
            bottom: insets.bottom > 0 ? insets.bottom : 16,
            height: insets.bottom > 0 ? 72 : 64,
            paddingBottom: insets.bottom > 0 ? insets.bottom / 2 : 0,
          }
        ],
        // ✅ FIX: Apply matching border radius configurations to the background layer to stop bleeding
        tabBarBackground: () => (
          <BlurView 
            intensity={90} 
            tint={darkMode ? "dark" : "light"} 
            style={[StyleSheet.absoluteFill, { borderRadius: 24 }]} 
          />
        ),

      }}
    >
      {/* Hidden Screens */}
      {hiddenTabs.map((tabName) => (
        <Tabs.Screen
          key={tabName}
          name={tabName}
          options={{
            href: null,
          }}
        />
      ))}

      {/* Visible Screens */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={22} name={focused ? "home" : "home-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconWrapper}>
              <Ionicons size={22} name={focused ? "chatbubble" : "chatbubble-outline"} color={color} />
              {unreadCount > 0 && (
                <View style={styles.modernBadge}>
                  <Animated.Text style={styles.badgeText}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Animated.Text>
                </View>
              )}
            </View>
          ),
        }}
      />
         <Tabs.Screen
        name="sell"
        options={{
          tabBarLabel: "",
          // ✅ FIX: Perfectly zeroes out parent layout shifting 
          tabBarItemStyle: {
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 25,
            height: "100%", // Ensures it fills the safe tab area fully
          },
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              activeOpacity={0.9}
              onPressIn={animatePressIn}
              onPressOut={animatePressOut}
              // ✅ FIX: Shifts the target wrap downward into horizontal alignment with home/messages icons
              style={[styles.sellButtonContainer, { transform: [{ translateY: 2 }] }]}
            />
          ),
          tabBarIcon: ({ focused }) => (
            <Animated.View
              style={[
                styles.sellButton,
                { transform: [{ scale: scaleAnim }] },
                focused && styles.sellButtonActive,
              ]}
            >
              <Ionicons name="add" size={28} color="#FFF" />
            </Animated.View>
          ),
        }}
      />

      <Tabs.Screen
        name="security"
        options={{
          title: "Security",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={22} name={focused ? "shield" : "shield-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "You",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={22} name={focused ? "person" : "person-outline"} color={color} />
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
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.15)",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    borderTopWidth: 1, 
    paddingHorizontal: 8,
    marginRight:10,
    marginLeft:10,
    overflow: "hidden",
  },
  iconWrapper: {
    position: "relative",
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.1,
    marginTop: 4,
  },
  modernBadge: {
    position: "absolute",
    top: -4,
    right: -10,
    backgroundColor: "#FF3B30",
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: "#FFF",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "800",
  },
  sellButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sellButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#0EA5E9",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#0EA5E9",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  sellButtonActive: {
    backgroundColor: "#00BFFF",
  },
});
