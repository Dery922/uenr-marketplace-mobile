// components/CustomDrawerContent.tsx
import { getCurrentUser } from "@/api/authApi";
import API from "@/api/axios";
import env from "@/config/env";
import { deleteToken, getToken } from "@/utils/tokenStorage";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
const CustomDrawerContent = (props: any) => {
  const handleLogout = async () => {
    try {
      await deleteToken();
      console.log("Token deleted");
      router.push("/(auth)/LandingScreen");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission required to access gallery");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];

      uploadImage(selectedImage);
    }
  };



//   const uploadImage = async (image: any) => {
//       console.log("🟢 UPLOAD FUNCTION CALLED", new Date().toISOString());
//   // Validation
//   if (!image || !image.uri) {
//     console.error("Invalid image object provided");
//     alert("Invalid image selected");
//     return;
//   }
  

//       setIsUploading(true)
//   const formData = new FormData();
  
//   // Android URI normalization
//   const imageUri = Platform.OS === "android" && !image.uri.startsWith("file://")
//     ? `file://${image.uri}`
//     : image.uri;

//   // Append file
//   formData.append("avatar", {
//     uri: imageUri,
//     name: image.fileName || "profile.jpg",
//     type: image.mimeType || "image/jpeg",
//   } as any);

//   try {
//     console.log("🚀 STEP 1: Initiating Cloudinary synchronization pipeline...");

//     const token = await getToken();
//     if (!token) {
//       alert("Session Expired: Please re-authenticate to change profile media.");
//       return;
//     }

//     // Clean URL construction
//     const cleanBaseURL = BASE_URL.replace(/^https?:\/\//, '');
//     const apiUrl = `http://${cleanBaseURL}/api/auth/upload-avatar`;

//     const response = await axios.post(apiUrl, formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         Accept: "application/json",
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     console.log("📦 FULL RESPONSE OBJECT:", JSON.stringify(response, null, 2));
// console.log("📦 RESPONSE DATA STRUCTURE:", response.data);
// console.log("📦 RESPONSE DATA TYPE:", typeof response.data);
// console.log("📦 RESPONSE STATUS:", response.status);

// // Then check the structure

// console.log("🔍 data.avatar exists?", data.avatar);
// console.log("🔍 Full data object keys:", Object.keys(data));

//     console.log("🛰️ STEP 2: Network stream completed. Server HTTP status:", response.status);

//     // Handle auth errors
//     if (response.status === 401 || response.status === 403) {
//       alert("Security Token Mismatch: Re-log into the marketplace platform application.");
//       return;
//     }

//     const data = response.data;

//     // Check for success (Axios throws on 4xx/5xx by default, but double-check)
//     if (!data || !data.avatar) {
//       console.log("❌ Execution Failure: avatarUrl was missing inside backend payload return properties.");
//       alert("Upload succeeded but no avatar URL was returned");
//       return;
//     }

//     console.log("☁️ STEP 3: Cloudinary upload complete. CDN Endpoint:", data.avatar);

//     // Update state
//     setCurrentUserData((prev: any) => ({
//       ...prev,
//       avatar: data.avatar,
//     }));

//     alert("Success: Profile picture updated smoothly!");
    
//   } catch (error: any) {
//     console.log("❌ Comprehensive upload stream error pipeline breakdown caught:", error);
    
//     // More specific error messages
//     if (error.response?.status === 413) {
//       alert("Image file too large. Please choose a smaller image.");
//     } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
//       alert("Upload timeout. Please check your connection and try again.");
//     } else {
//       alert(`Upload Error: ${error.response?.data?.message || error.message || "Network processing connection timed out."}`);
//     }
//   }
// };

const [isUploading,setIsUploading] = useState(false)

// const uploadImage = async (image: any) => {
//   if (!image || !image.uri) {
//     console.error("Invalid image object provided");
//     alert("Invalid image selected");
//     return;
//   }

//   // ✅ Add loading state
//   setIsUploading(true);
  
//   const formData = new FormData();
//   const imageUri = Platform.OS === "android" && !image.uri.startsWith("file://")
//     ? `file://${image.uri}`
//     : image.uri;

//   formData.append("avatar", {
//     uri: imageUri,
//     name: image.fileName || "profile.jpg",
//     type: image.mimeType || "image/jpeg",
//   } as any);

//   try {
//     const token = await getToken();
//     if (!token) {
//       alert("Session Expired");
//       setIsUploading(false);
//       return;
//     }

//     const cleanBaseURL = BASE_URL.replace(/^https?:\/\//, '');
//     const apiUrl = `http://${cleanBaseURL}/api/auth/upload-avatar`;

//     // ✅ Show uploading indicator
//     alert("Uploading image, please wait...");

//     const response = await axios.post(apiUrl, formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         Accept: "application/json",
      
//       },
//       timeout: 10000, // 10 second timeout
//     });

//     const data = response.data;
    
//     if (!data || !data.avatar) {
//       throw new Error("No avatar URL returned");
//     }

//     // ✅ Update state BEFORE showing success
//     setCurrentUserData((prev: any) => ({
//       ...prev,
//       avatar: data.avatar,
//     }));

//     // ✅ Also store in async storage for persistence
//     await storeAvatarLocally(data.avatar);
    
//     alert("Success: Profile picture updated!");
//     setIsUploading(false);
    
//   } catch (error: any) {
//     console.error("Upload error:", error);
//     setIsUploading(false);
    
//     if (error.code === 'ECONNABORTED') {
//       alert("Upload taking too long. Please try again with a smaller image.");
//     } else {
//       alert(`Upload Error: ${error.response?.data?.message || error.message}`);
//     }
//   }
// };

// Store avatar locally when upload succeeds


// const uploadImage = async (image: any) => {
//   if (!image || !image.uri) {
//     console.error("Invalid image object provided");
//     alert("Invalid image selected");
//     return;
//   }

//   setIsUploading(true);
  
//   const formData = new FormData();
  
//   // ✅ Fix 1: Normalize URI for Android content providers vs local files
//   let imageUri = image.uri;
//   if (Platform.OS === 'android') {
//     imageUri = image.uri.startsWith('file://') ? image.uri : `file://${image.uri}`;
//   }

//   // ✅ Fix 2: Explicitly extract or fallback mime types and names
//   const fileName = image.fileName || image.uri.split('/').pop() || `avatar_${Date.now()}.jpg`;
//   const fileType = image.mimeType || "image/jpeg";

//   formData.append("avatar", {
//     uri: imageUri,
//     name: fileName,
//     type: fileType,
//   } as any);

//   try {
//     const token = await getToken();
//     if (!token) {
//       alert("Session Expired");
//       setIsUploading(false);
//       return;
//     }

//     const cleanBaseURL = API_BASE_URL.replace(/^https?:\/\//, '');
//     const apiUrl = `http://${cleanBaseURL}/api/auth/upload-avatar`;

//     // ✅ Fix 3: Explicit multi-part header + extended timeout for large Cloudinary transfers
//     const response = await axios.post(apiUrl, formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         Accept: "application/json",
//         "Content-Type": "multipart/form-data", 
//       },
//       transformRequest: (data, headers) => {
//         return data; // Prevents Axios from breaking FormData objects in some RN versions
//       },
//       timeout: 45000, // 45 seconds (Cloudinary uploads can take time on slow UENR campus networks)
//     });

//     const data = response.data;
    
//     if (!data || !data.avatar) {
//       throw new Error("No avatar URL returned");
//     }

//     setCurrentUserData((prev: any) => ({
//       ...prev,
//       avatar: data.avatar,
//     }));

//     await storeAvatarLocally(data.avatar);
    
//     alert("Success: Profile picture updated!");
//     setIsUploading(false);
    
//   } catch (error: any) {
//     // ✅ Fix 4: Log detailed error breakdown to pinpoint the network jump failure
//     if (error.response) {
//       console.error("Server Error Data:", error.response.data);
//       console.error("Server Error Status:", error.response.status);
//       alert(`Upload Failed: ${error.response.data.message || "Server Error"}`);
//     } else if (error.request) {
//       console.error("No response received from request:", error.request);
//       alert("Network Error: Cannot connect to server. Check your internet or local IP backend setup.");
//     } else {
//       console.error("Error setting up request:", error.message);
//       alert(`Upload Error: ${error.message}`);
//     }
//     setIsUploading(false);
//   }
// };


const uploadImage = async (image: any) => {
  if (!image || !image.uri) {
    console.error("Invalid image object provided");
    alert("Invalid image selected");
    return;
  }

  setIsUploading(true);
  
  const formData = new FormData();
  
  // Normalize URI for Android content providers vs local files
  let imageUri = image.uri;
  if (Platform.OS === 'android') {
    imageUri = image.uri.startsWith('file://') ? image.uri : `file://${image.uri}`;
  }

  // Explicitly extract or fallback mime types and names
  const fileName = image.fileName || image.uri.split('/').pop() || `avatar_${Date.now()}.jpg`;
  const fileType = image.mimeType || "image/jpeg";

  formData.append("avatar", {
    uri: imageUri,
    name: fileName,
    type: fileType,
  } as any);

  try {
    const token = await getToken();
    if (!token) {
      alert("Session Expired");
      setIsUploading(false);
      return;
    }

    // FIXED: Use the global API instance with a relative endpoint path. 
    // It automatically prefixes API_BASE_URL and respects http/https.
    const response = await API.post('/auth/upload-avatar', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "multipart/form-data", 
      },
      transformRequest: (data) => {
        return data; // Prevents Axios from breaking FormData objects in React Native
      },
      timeout: 60000, // Increased to 60s to handle both Render sleep and Cloudinary processing
    });

    const data = response.data;
    
    if (!data || !data.avatar) {
      throw new Error("No avatar URL returned");
    }

    setCurrentUserData((prev: any) => ({
      ...prev,
      avatar: data.avatar,
    }));

    await storeAvatarLocally(data.avatar);
    
    alert("Success: Profile picture updated!");
    setIsUploading(false);
    
  } catch (error: any) {
    // Log detailed error breakdown to pinpoint network failure
    if (error.response) {
      console.error("Server Error Data:", error.response.data);
      console.error("Server Error Status:", error.response.status);
      alert(`Upload Failed: ${error.response.data.message || "Server Error"}`);
    } else if (error.request) {
      console.error("No response received from request:", error.request);
      alert("Network Error: Cannot connect to server. Check your connection or server environment.");
    } else {
      console.error("Error setting up request:", error.message);
      alert(`Upload Error: ${error.message}`);
    }
    setIsUploading(false);
  }
};




const storeAvatarLocally = async (avatarUrl: string) => {
  try {
    await AsyncStorage.setItem('user_avatar', avatarUrl);
    console.log("✅ Avatar saved locally");
  } catch (error) {
    console.error("Failed to save avatar locally:", error);
  }
};

// Load avatar when app starts
const loadStoredAvatar = async () => {
  try {
    const storedAvatar = await AsyncStorage.getItem('user_avatar');
    if (storedAvatar) {
      setCurrentUserData((prev: any) => ({
        ...prev,
        avatar: storedAvatar,
      }));
    }
  } catch (error) {
    console.error("Failed to load stored avatar:", error);
  }
};

// Call this in useEffect when component mounts
useEffect(() => {
  loadStoredAvatar();
}, []);

  const animatedHeight = useRef(new Animated.Value(0)).current;

  const heightInterpolate = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 140], // adjust based on number of items
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        setCurrentUserData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  const [currentUserData, setCurrentUserData] = useState({});
  const [expandedMenu, setExpandedMenu] = useState(null);

  const BASE_URL = env.API_URL;
  const toggleMenu = (menu) => {
    const isOpening = expandedMenu !== menu;

    setExpandedMenu(isOpening ? menu : null);

    Animated.timing(animatedHeight, {
      toValue: isOpening ? 1 : 0,
      duration: 300,
      useNativeDriver: false, // height animation needs this
    }).start();
  };
  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} showsVerticalScrollIndicator={false}>
        {/* 🔷 MODERN HEADER */}
        <LinearGradient
          colors={["#00BFFF", "#1E3A8A"]}
          style={styles.drawerHeader}
        >
          <TouchableOpacity
            style={styles.profileImageWrapper}
            onPress={pickImage}
          >
            <Image
              style={styles.profileImage}
              source={
                currentUserData?.avatar
                  ? { uri: currentUserData.avatar }
                  : require("../assets/images/avatar.png")
              }
            />
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={14} color="#FFF" />
            </View>
          </TouchableOpacity>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {currentUserData.name || "Student Name"}
            </Text>
            <Text style={styles.userEmail}>
              {currentUserData.email || "id@uenr.edu.gh"}
            </Text>

            <View style={styles.badgeRow}>
              <View style={styles.statusBadge}>
                <Ionicons name="checkmark-circle" size={12} color="#38A169" />
                <Text style={styles.statusText}>Verified Student</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* 🔷 SCROLLABLE CONTENT */}
        <View style={styles.menuSection}>
          <SectionHeader title="Campus Life" />
          <DrawerItem icon="library" label="Library Books" />
          <DrawerItem icon="fast-food" label="Cafeteria Deals" />
          <DrawerItem 
          icon="calendar" 
          label="Campus Events" 
          onPress={() => router.push("/(drawer)/campus-events")}
          />

          <SectionHeader title="Campus Services" />
          <DrawerItem
            icon="print"
            label="Printing Services"
            onPress={() => router.push("/(drawer)/printing")}
          />
          <DrawerItem
            icon="business"
            label="Campus Estate"
            onPress={() => router.push("/(drawer)/campus-housing")}
          />

          <SectionHeader title="Legal & Help" />
          <DrawerItem
            icon="document-text"
            label="Terms & Conditions"
            onPress={() => router.push("/(drawer)/terms-conditions")}
          />
          <DrawerItem
            icon="shield-checkmark"
            label="Privacy Policy"
            onPress={() => router.push("/(drawer)/privacy-policy")}
          />
        </View>
      </DrawerContentScrollView>

      {/* 🔷 FOOTER */}
      <View style={styles.drawerFooter}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#E53E3E" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        <Text style={styles.versionText}>UENR Marketplace v1.0.0</Text>
      </View>
    </View>
  );
};
// 1. Put this helper component near the bottom of your file
const SectionHeader = ({ title }: { title: string }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

// 2. Put this one there too for the clickable items
const DrawerItem = ({ icon, label, onPress }: any) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuIconBg}>
      <Ionicons name={icon} size={20} color="#1E3A8A" />
    </View>
    <Text style={styles.menuText}>{label}</Text>
    <Ionicons name="chevron-forward" size={16} color="#CBD5E0" />
  </TouchableOpacity>
);
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  drawerHeader: {
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomRightRadius: 30,
  },
  profileImageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  profileImage: { width: 74, height: 74, borderRadius: 37 },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#00BFFF",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  userName: { color: "#FFF", fontSize: 18, fontWeight: "800" },
  userEmail: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 2 },
  badgeRow: { flexDirection: "row", marginTop: 10 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#38A169",
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 4,
  },

  menuSection: { padding: 20 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#A0AEC0",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 15,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  menuIconBg: {
    width: 36,
    height: 36,
    backgroundColor: "#F0F9FF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuText: { flex: 1, color: "#2D3748", fontSize: 15, fontWeight: "600" },

  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#EDF2F7",
    backgroundColor: "#F8FAFC",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
    padding: 12,
    borderRadius: 12,
  },
  logoutText: {
    color: "#E53E3E",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 10,
  },
  versionText: {
    color: "#A0AEC0",
    fontSize: 11,
    textAlign: "center",
    marginTop: 15,
  },
});

export default CustomDrawerContent;
