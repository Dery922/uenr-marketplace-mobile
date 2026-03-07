// components/TopBar.js
import { Ionicons } from '@expo/vector-icons';

import { DrawerActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


import { getCurrentUser } from '@/api/authApi';
import { useNavigation } from 'expo-router';


import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';



const TopBar = ({ 
  userName = 'Kwame Ansah', 
  userStatus = 'Verified Student', 
  campusLocation = 'Main Campus',
  notificationCount = 3,
  onNotificationPress,
  onLocationPress,
  onSearch,
  placeholder = 'Search textbooks, food, services...',
  showHamburger = true,
}) => {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [currentUserData, setCurrentUserData] = useState({})
  

 
  const handleSearch = () => {
    if (searchText.trim()) {
      Keyboard.dismiss();
      onSearch?.(searchText);
    }
  };

  const clearSearch = () => {
    setSearchText('');
    Keyboard.dismiss();
  };

const openDrawer = () => {
  navigation.dispatch(DrawerActions.openDrawer());
};

useEffect(() => {
  const fetchUser = async ()=>{
      try {
    const res = await getCurrentUser();
    console.log(res.data)
     setCurrentUserData(res.data);
  } catch (error) {
    console.log(error);
  }
  }

  fetchUser();
},[])
  return (
    // ✅ Remove SafeAreaView wrapper - let parent handle safe area
    <View style={[
      styles.container,
      { paddingTop: insets.top } // Keep padding top for status bar
    ]}>
      {/* Top Section: Perfectly aligned hamburger and notification */}
      <View style={styles.topSection}>
        {/* Left: Hamburger Menu */}
        {showHamburger && (
          <TouchableOpacity 
            style={styles.hamburgerButton}
            onPress={openDrawer}
            activeOpacity={0.7}
          >
            <Ionicons name="menu" size={28} color="#fff" />
          </TouchableOpacity>
        )}
        
        {/* Center: User Info */}
        <View style={styles.centerSection}>
          <Text style={styles.userName}>{currentUserData.name}</Text>
          <View style={styles.statusRow}>
            <View style={styles.verifiedBadge}>
              <Ionicons name="school-outline" size={12} color="#38A169" />
              <Text style={styles.verifiedText}>{userStatus}</Text>
            </View>
            <Text style={styles.dot}>•</Text>
            <TouchableOpacity onPress={onLocationPress}>
              <Text style={styles.campusLocation}>{campusLocation}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Right: Notification Bell with Badge */}
        <TouchableOpacity 
          style={styles.notificationButton} 
          onPress={onNotificationPress}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications" size={24} color="#fff" />
          
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {notificationCount > 99 ? '99+' : notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search Bar Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons 
            name="search" 
            size={20} 
            color="rgba(87, 79, 79, 0.8)" 
            style={styles.searchIcon}
          />
          
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="rgba(87, 79, 79, 0.8)"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          
          {searchText.length > 0 && (
            <TouchableOpacity 
              onPress={clearSearch}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={18} color="rgba(87, 79, 79, 0.8)" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity 
          style={styles.voiceButton}
          onPress={() => console.log('Voice search')}
        >
          <Ionicons name="mic-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {

    backgroundColor: '#00BFFF', // Navy

    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 44,
  },
  hamburgerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 161, 105, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 6,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#38A169',
    marginLeft: 4,
  },
  dot: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginHorizontal: 6,
  },
  campusLocation: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  notificationButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 6, // Adjusted for better positioning
    right: 4, // Adjusted for better positioning
    backgroundColor: '#FF3B30', // Red color for notifications
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 4,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'rgba(87, 79, 79, 0.8)',
    padding: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TopBar;