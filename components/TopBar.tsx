// components/TopBar.js
import { getCurrentUser } from "@/api/authApi";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";

import {
  Animated,
  Easing,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TopBar = ({
  userStatus = "Verified Student",
  campusLocation = "Main Campus",
  notificationCount = 3,
  onNotificationPress,
  onLocationPress,
  onSearch,
  placeholder = "Search textbooks, food, services...",
  showHamburger = true,
}) => {
  const [searchText, setSearchText] = useState("");
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [currentUserData, setCurrentUserData] = useState({});
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const shimmerAnim = useRef(new Animated.Value(-200)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 400,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    loop.start();
    return () => loop.stop();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        console.log(res.data);

        setCurrentUserData(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  const handleSearch = () => {
    if (searchText.trim()) {
      Keyboard.dismiss();
      onSearch?.(searchText);
    }
  };

  const clearSearch = () => {
    setSearchText("");
    onSearch?.("");
    Keyboard.dismiss();
  };

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  // Get display name with fallback
  const displayName = currentUserData.name || "Loading...";

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>


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
      {/* Center: User Info */}
<View style={styles.centerSection}>
  <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
    {displayName}
  </Text>
  <View style={styles.statusRow}>
    <View style={styles.verifiedBadge}>
      <Ionicons name="school-outline" size={12} color="#38A169" />
      <Text style={styles.verifiedText} numberOfLines={1}>{userStatus}</Text>
    </View>
    
    <Text style={styles.dot}>•</Text>
    
<TouchableOpacity
  style={styles.locationButton}
  onPress={onLocationPress}
  activeOpacity={0.7}
>
  <Ionicons name="location-outline" size={14} color="#fff" style={styles.iconStyle} />

  <Text 
    style={styles.locationText} 
    numberOfLines={1} 
    ellipsizeMode="tail"
    textBreakStrategy="simple" /* 👈 Stops native layout calculation clipping on real devices */
  >
    {/* 💥 FIX: Adding a trailing space template literal gives the real device layout engine */}
    {/* the padding it requires so it never clips off the final characters */}
    {`${campusLocation} `} 
  </Text>

  <Ionicons name="chevron-down" size={14} color="#fff" style={styles.iconStyle} />
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
                {notificationCount > 99 ? "99+" : notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search Bar Section - Fixed height to prevent jumping */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="rgba(87, 79, 79, 0.8)"
            style={styles.searchIcon}
          />

          <TextInput
            ref={inputRef}
            style={styles.input}
            // If focused or has text, remove placeholder to stop the "jump" logic
            placeholder={isFocused || searchText ? "" : placeholder}
            placeholderTextColor="rgba(87, 79, 79, 0.8)"
            value={searchText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChangeText={(text) => {
              setSearchText(text);
              onSearch?.(text);
            }}
            underlineColorAndroid="transparent" // CRITICAL for Android overlap
          />

          {searchText.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons
                name="close-circle"
                size={18}
                color="rgba(87, 79, 79, 0.8)"
              />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.voiceButton}
          onPress={() => console.log("Voice search")}
        >
          <Ionicons name="mic-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#00BFFF",
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: "hidden",
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 50,
  },
  hamburgerButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    // ✅ Ensure it stays on left
    flexShrink: 0,
  },
    userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    // ✅ Ensure name doesn't overflow
    maxWidth: "100%",
  },
    centerSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    justifyContent: "center",
    width: "100%", 
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(56, 161, 105, 0.2)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 12,
    flexShrink: 0, // Forces the system to never compress your verified badge
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#38A169",
    marginLeft: 4,
    includeFontPadding: false, // Critical Android fix for layout cutting
  },
  dot: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    marginHorizontal: 4,
    flexShrink: 0,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 20,
    flexShrink: 1, // Allows it to scale down only if screen size runs completely out
    maxWidth: '55%', // Prevents the button from knocking out of the flex container boundaries
  },
  textWrapper: {
    flexShrink: 1, // Crucial wrapper behavior to safely contain the text metrics engine
  },
  locationText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 2,
    marginRight: 2,
    includeFontPadding: false, // Prevents custom device line-heights from breaking layout
  },
  iconStyle: {
    flexShrink: 0, // Prevents device scaling engines from shrinking the icons to 0 width
  },

  notificationButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    // ✅ Keep notification button fixed
    flexShrink: 0,
  },
  // ... rest of your styles remain the same
  badge: {
    position: "absolute",
    top: 6,
    right: 4,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    paddingHorizontal: 4,
  },
  searchSection: {
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 10, // Added margin instead of fixed height wrapper
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15, // Match hostel
    paddingHorizontal: 15,
    minHeight: 45, // Use minHeight instead of fixed height
    elevation: 2,
    margin:6
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === "ios" ? 12 : 8, // Use padding, not height
    fontSize: 14,
    color: "#334155",
    marginLeft: 10,
    textAlignVertical: "center",
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 120,
    height: "100%",
    zIndex: 1,
  },
  gradient: {
    flex: 1,
  },
});

export default TopBar;
