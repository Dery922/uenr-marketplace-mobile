import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



export default function TabLayout() {
   const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#00BFFF",
        tabBarInactiveTintColor: '#94A3B8',
        
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: [
          styles.tabBar,
          { paddingBottom: insets.bottom + 8, height: 70 + insets.bottom }, // dynamically add inset
        ],
        tabBarBackground: () => (
          <BlurView
            intensity={90}
            tint={colorScheme === 'dark' ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
        ),
      }}
    >

      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              size={24} 
              name={focused ? 'home' : 'home-outline'} 
            color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              size={24} 
              name={focused ? 'chatbubble' : 'chatbubble-outline'} 
              color={color}
            />
          ),
        tabBarBadge: 3, // This is your static design placeholder
        tabBarBadgeStyle: {
          backgroundColor: '#FF3B30', // The standard "alert" red color
          fontSize: 12,
          minWidth: 18, // Makes the badge circular
          height: 18,
        },
        }}
      />

      <Tabs.Screen
        name="sell"
        options={{ 
          title: 'Sell',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              size={24} 
              name={focused ? 'cash' : 'cash-outline'} 
              color={color}
            />
          ),
        }}
      />
   
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              size={24} 
              name={focused ? 'person' : 'person-outline'} 
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
  height: 70, // base height
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  borderTopLeftRadius: 30,
  borderTopRightRadius: 30,
  borderTopWidth: 0,
  position: 'absolute',
  overflow: 'hidden',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -4 },
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 10,
  paddingHorizontal: 16,
}

});