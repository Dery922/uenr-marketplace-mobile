// screens/ProfileScreen.js
import { getCurrentUser } from "@/api/authApi";
import { toggleUserTheme } from "@/redux/themeSlice";
import { fetchUnreadCount } from "@/store/slices/chatSlice";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getMyProductCount } from "@/api/productApi";
import { darkTheme, lightTheme } from "@/constants/theme";
import { setTheme } from "@/redux/themeSlice";
import { deleteToken } from "@/utils/tokenStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
const { width } = Dimensions.get("window");
const ProfileScreen = () => {
  const { unreadCount } = useSelector((state) => state.chat);
  const darkMode = useSelector((state: any) => state.theme.darkMode);

  const theme = darkMode ? darkTheme : lightTheme;

  const dispatch = useDispatch();

  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80",
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [isVisible, setIsVisible] = useState(false);

  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [currentUserData, setCurrentUserData] = useState({});
  const [productCount, setProductCount] = useState();

  // Animation refs
  const slideAnim = useRef(new Animated.Value(1000)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const profileImageScale = useRef(new Animated.Value(0.5)).current;
  const statsScaleAnims = useRef(
    Array(5)
      .fill()
      .map(() => new Animated.Value(0)),
  ).current;
  const userId = currentUserData?._id;

  const user = {
    name: "Kwame Asare",
    email: "uenr.edu.gh",
    phone: "+233 24 123 4567",
    university: "University of Energy....",
    campus: "Fiapre Campus",
    studentId: "UENR2023001",
    rating: 4.8,
    listings: 12,
    sold: 8,
    memberSince: "2023",
  };

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

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        try {
          const res = await getCurrentUser();
          const count = await getMyProductCount();

          setProductCount(count.data.totalProducts);
          setCurrentUserData(res.data);
        } catch (error) {
          console.log(error);
        }
      };

      fetchUser();
    }, []),
  );


  //loading theme code
  useEffect(() => {
    const loadTheme = async () => {
      if (!currentUserData?._id) return;

      const savedTheme = await AsyncStorage.getItem(
        `theme_${currentUserData._id}`,
      );

      dispatch(setTheme(savedTheme === "dark"));
    };

    loadTheme();
  }, [currentUserData?._id]);

  const handleEditProfilePress = () => {
    // Animate the button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 150,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Navigate after animation completes
      animateExit(() => {
        router.push("/edit-profile");
      });
    });
  };

  const handleReportProblemPress = () => {
    // Animate the button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,

        tension: 150,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Navigate after animation completes
      animateExit(() => {
        const userData: any = currentUserData;
        const reportTargetId = userData?._id || userData?.id || userId;
        const reportTargetTitle =
          userData?.name ||
          userData?.fullName ||
          userData?.username ||
          user.name;
        const reportTargetImage =
          userData?.avatar || userData?.profileImage || profileImage || "";

        if (!reportTargetId) {
          Alert.alert("Unable to report", "Profile details are not ready yet.");
          return;
        }

        router.push({
          pathname: "/report-problem",
          params: {
            targetId: reportTargetId,
            targetType: "user",
            targetTitle: reportTargetTitle,
            targetImage: reportTargetImage,
          },
        });
      });
    });
  };

  const handleAboutAppPress = () => {
    // Animate the button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 150,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Navigate after animation completes
      animateExit(() => {
        router.push("/about-app");
      });
    });
  };

  const handleSecurityPress = () => {
    // Animate the button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 150,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Navigate after animation completes
      animateExit(() => {
        router.push("/security");
      });
    });
  };

  const menuItems = [
    {
      id: "my-listings",
      title: "My Listings",
      icon: "list",
      count: productCount,
      color: "#00BFFF",
    },
    {
      id: "up-coming-compus-events",
      title: "Compus Events",
      icon: "checkmark-circle",
      count: user.sold,
      color: "#38A169",
    },
    {
      id: "shops",
      title: "Shop",
      icon: "heart",
      count: 5,
      color: "#D53F8C",
    },
    {
      id: "estates",
      title: "Campus Hostel",
      icon: "star",
      count: 24,
      color: "#D69E2E",
    },
    {
      id: "messages",
      title: "Messages",
      icon: "chatbubble",
      count: unreadCount > 0 ? unreadCount : undefined,
      color: "#ED8936",
      badge: true,
    },
  ];
  const settingsItems = [
    {
      id: "edit-profile",
      title: "Edit Profile",
      icon: "create-outline",
      type: "link",
      onPress: handleEditProfilePress,
    },
    {
      id: "report-problem",
      title: "Report a Problem",
      icon: "warning-outline",
      type: "link",
      onPress: handleReportProblemPress,
    },
    {
      id: "security",
      title: "Security",
      icon: "shield-checkmark-outline",
      type: "link",
      onPress: handleSecurityPress,
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: "notifications-outline",
      type: "switch",
      value: notificationsEnabled,
      onValueChange: (value) => setNotificationsEnabled(value),
    },
    {
      id: "dark-mode",
      title: "Dark Mode",
      icon: "moon-outline",
      type: "switch",
      value: darkMode,
      onValueChange: () => {
        if (user?._id) return;
        dispatch(toggleUserTheme(user._id));
      },
    },
    {
      id: "help",
      title: "Help & Support",
      icon: "help-circle-outline",
      type: "link",
    },

    {
      id: "about-app",
      title: "About App",
      icon: "information-circle-outline",
      type: "link",
      onPress: handleAboutAppPress,
    },
  ];

  // Use useFocusEffect to trigger animations on every visit
  useFocusEffect(
    useCallback(() => {
      // Reset all animations to starting positions
      slideAnim.setValue(1000);
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
      profileImageScale.setValue(0.5);
      statsScaleAnims.forEach((anim) => anim.setValue(0));

      setIsVisible(true);
      settingsItems;

      // Start animations with a small delay to ensure UI is ready
      setTimeout(() => {
        startAnimations();
      }, 100);

      return () => {
        setIsVisible(false);
        // Cleanup: stop any ongoing animations
        slideAnim.stopAnimation();
        fadeAnim.stopAnimation();
        scaleAnim.stopAnimation();
        profileImageScale.stopAnimation();
        statsScaleAnims.forEach((anim) => anim.stopAnimation());
      };
    }, []),
  );

  //getting profile image
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

  // In ProfileScreen.js, add this function for edit profile navigation:

  const startAnimations = () => {
    // Profile image animation (grows from center)
    Animated.spring(profileImageScale, {
      toValue: 1,
      tension: 150,
      friction: 10,
      useNativeDriver: true,
      delay: 200,
    }).start();

    // Bottom section slide up
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    }).start();

    // Content fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay: 300,
      useNativeDriver: true,
    }).start();

    // Scale animation for main content
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
      delay: 350,
    }).start();

    // Staggered animation for stats cards
    setTimeout(() => {
      Animated.stagger(
        80,
        statsScaleAnims.map((anim, index) =>
          Animated.spring(anim, {
            toValue: 1,
            tension: 180,
            friction: 12,
            useNativeDriver: true,
            delay: index * 60,
          }),
        ),
      ).start();
    }, 400);
  };

  const pickProfileImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        // Animate profile image change
        Animated.sequence([
          Animated.timing(profileImageScale, {
            toValue: 0.8,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.spring(profileImageScale, {
            toValue: 1,
            tension: 150,
            friction: 10,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setProfileImage(result.assets[0].uri);
        });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image.");
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

  const uploadImage = async (image: any) => {
    // Validation
    if (!image || !image.uri) {
      console.error("Invalid image object provided");
      alert("Invalid image selected");
      return;
    }

    const formData = new FormData();

    // Android URI normalization
    const imageUri =
      Platform.OS === "android" && !image.uri.startsWith("file://")
        ? `file://${image.uri}`
        : image.uri;

    // Append file
    formData.append("avatar", {
      uri: imageUri,
      name: image.fileName || "profile.jpg",
      type: image.mimeType || "image/jpeg",
    } as any);

    try {
      console.log(
        "🚀 STEP 1: Initiating Cloudinary synchronization pipeline...",
      );

      const token = await getToken();
      if (!token) {
        alert(
          "Session Expired: Please re-authenticate to change profile media.",
        );
        return;
      }

      // Clean URL construction
      const cleanBaseURL = BASE_URL.replace(/^https?:\/\//, "");
      const apiUrl = `http://${cleanBaseURL}/api/auth/upload-avatar`;

      const response = await axios.post(apiUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(
        "🛰️ STEP 2: Network stream completed. Server HTTP status:",
        response.status,
      );

      // Handle auth errors
      if (response.status === 401 || response.status === 403) {
        alert(
          "Security Token Mismatch: Re-log into the marketplace platform application.",
        );
        return;
      }

      const data = response.data;

      // Check for success (Axios throws on 4xx/5xx by default, but double-check)
      if (!data || !data.avatar) {
        console.log(
          "❌ Execution Failure: avatarUrl was missing inside backend payload return properties.",
        );
        alert("Upload succeeded but no avatar URL was returned");
        return;
      }

      console.log(
        "☁️ STEP 3: Cloudinary upload complete. CDN Endpoint:",
        data.avatar,
      );

      // Update state
      setCurrentUserData((prev: any) => ({
        ...prev,
        avatar: data.avatar,
      }));

      alert("Success: Profile picture updated smoothly!");
    } catch (error: any) {
      console.log(
        "❌ Comprehensive upload stream error pipeline breakdown caught:",
        error,
      );

      // More specific error messages
      if (error.response?.status === 413) {
        alert("Image file too large. Please choose a smaller image.");
      } else if (
        error.code === "ECONNABORTED" ||
        error.message.includes("timeout")
      ) {
        alert("Upload timeout. Please check your connection and try again.");
      } else {
        alert(
          `Upload Error: ${error.response?.data?.message || error.message || "Network processing connection timed out."}`,
        );
      }
    }
  };

  const handleMenuItemPress = (id) => {
    // Animate the pressed stat card
    const index = menuItems.findIndex((item) => item.id === id);
    if (statsScaleAnims[index]) {
      Animated.sequence([
        Animated.timing(statsScaleAnims[index], {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(statsScaleAnims[index], {
          toValue: 1,
          tension: 150,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    }

    switch (id) {
      case "my-listings":
        // Navigate to the My Listings page
        router.push("/my-listings");
        break;
      case "sold-items":
        // Navigate to the Sold Items page (create this file too)
        router.push("/sold-items");
        break;
      case "saved":
        // Navigate to the Saved Items page
        router.push("/saved");
        break;

      case "up-coming-compus-events":
        // Navigate to the Saved Items page
        router.push("/up-coming-events");
        break;
      case "reviews":
        // Navigate to the Reviews page
        router.push("/reviews");
        break;
      case "messages":
        router.push("/messages");
        break;
      default:
        // Just show alert with animation
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.02,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 150,
            friction: 3,
            useNativeDriver: true,
          }),
        ]).start(() => {
          Alert.alert("Coming Soon", "This feature is coming soon!");
        });
    }
  };

  const animateExit = (callback) => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1000,
        duration: 400,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (callback) callback();
    });
  };

  const handleBackPress = () => {
    animateExit(() => {
   
       router.replace("/(drawer)/(tabs)/home");
    });
  };

  const animateSwitchToggle = (callback, value) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.01,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 150,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback(value !== undefined ? !value : undefined);
    });
  };
  // const animateLogoutPress = () => {
  //   Animated.sequence([
  //     Animated.timing(scaleAnim, {
  //       toValue: 0.95,
  //       duration: 100,
  //       useNativeDriver: true,
  //     }),
  //     Animated.spring(scaleAnim, {
  //       toValue: 1,
  //       tension: 150,
  //       friction: 3,
  //       useNativeDriver: true,
  //     }),
  //   ]).start(() => {
  //     Alert.alert("Logout", "Are you sure you want to logout?", [
  //       {
  //         text: "Cancel",
  //         style: "cancel",
  //         onPress: () => {
  //           // Reset animation
  //           Animated.spring(scaleAnim, {
  //             toValue: 1,
  //             tension: 150,
  //             friction: 3,
  //             useNativeDriver: true,
  //           }).start();
  //         },
  //       },
  //       {
  //         text: "Logout",
  //         style: "destructive",
  //         onPress: () => {
  //           // Animate exit before logout
  //           animateExit(() => {
  //             Alert.alert(
  //               "Logged Out",
  //               "You have been logged out successfully",
  //             );
  //           });
  //         },
  //       },
  //     ]);
  //   });
  // };

  const animateLogoutPress = async () => {
  Alert.alert("Logout", "Are you sure you want to logout?", [
    {
      text: "Cancel",
      style: "cancel",
      onPress: () => {
        // Reset animation
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 150,
          friction: 3,
          useNativeDriver: true,
        }).start();
      },
    },
    {
      text: "Logout",
      style: "destructive",
      onPress: () => {
        // Animate button press
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 150,
            friction: 3,
            useNativeDriver: true,
          }),
        ]).start(async () => {
          // Animate exit before logout
          await animateExit(async () => {
            try {
              await deleteToken();
              console.log("Token deleted");
              
              // Show success message
              Alert.alert(
                "Logged Out",
                "You have been logged out successfully",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      router.push("/(auth)/LandingScreen");
                    },
                  },
                ]
              );
            } catch (error) {
              console.log("Logout error:", error);
              Alert.alert(
                "Error",
                "Failed to logout. Please try again."
              );
            }
          });
        });
      },
    },
  ]);
};

  const handleSettingsPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.02,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 150,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Alert.alert("Settings", "Advanced settings coming soon!");
    });
  };

  const handleSharePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 150,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Alert.alert("Share Profile", "Share your profile link");
    });
  };

  if (!isVisible) {
    return (
      <View style={styles.container}>
        <View style={styles.topSection}>
          <View style={styles.topContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Blue Section (20%) */}
      <View style={styles.topSection}>
        <View style={styles.topContent}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Settings Button */}
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={handleSettingsPress}
          >
            <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* User Profile with Animation */}
          <View style={styles.profileContainer}>
            {/* Profile Image with scale animation */}
            <Animated.View
              style={{ transform: [{ scale: profileImageScale }] }}
            >
              <TouchableOpacity onPress={pickProfileImage} activeOpacity={0.8}>
                <View style={styles.profileImageWrapper}>
                  {/* <Image 
                    source={{ uri: profilelogo }} 
                    style={styles.profileImage}
                  /> */}
                  <Image
                    style={styles.profileImage}
                    source={
                      currentUserData?.avatar
                        ? { uri: currentUserData.avatar }
                        : require("../../../assets/images/avatar.png")
                    }
                  />
                  <View style={styles.editImageButton}>
                    <Ionicons name="camera" size={14} color="#FFFFFF" />
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* User Info */}
            <Text style={styles.userName}>{currentUserData.name}</Text>

            {/* Rating */}
            {/* <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#F6AD55" />
              <Text style={styles.ratingText}>{user.rating}</Text>
              <Text style={styles.ratingLabel}>Seller Rating</Text>
            </View> */}
          </View>
        </View>
      </View>

      {/* Bottom White Section (80%) with curved top - Animated */}
      <Animated.View
        style={[
          styles.bottomSection,
          {
            backgroundColor: theme.background,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Animated.ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: tabBarHeight + insets.bottom + 5,
            },
          ]}
        >
          <Animated.View
            style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
          >
            {/* University Info Card */}
            {/* University Info Card - Layout 1 */}
            <View
              style={[styles.universityCard, { backgroundColor: theme.card }]}
            >
              {/* Left Icon */}
              <Ionicons
                name="school"
                size={28}
                color="#00BFFF"
                style={styles.cardIcon}
              />

              {/* Main Content Area */}
              <View style={styles.universityContent}>
                {/* Row 1: University Name */}
                <Text
                  style={[styles.universityName, { color: theme.text }]}
                  numberOfLines={1}
                >
                  {currentUserData?.university ||
                    user.university ||
                    "University of Energy and Natural Resources"}
                </Text>

                {/* Row 2: Campus and Join Date on same line */}
                <View style={styles.universityRow}>
                  <View style={styles.campusContainer}>
                    <Ionicons
                      name="location-outline"
                      size={12}
                      color="#718096"
                    />
                    <Text style={styles.campusText} numberOfLines={1}>
                      {currentUserData?.campus ||
                        user.campus ||
                        "Fiapre Campus"}
                    </Text>
                  </View>

                  <View style={styles.joinDateContainer}>
                    <Ionicons
                      name="calendar-outline"
                      size={12}
                      color="#718096"
                    />
                    <Text style={styles.joinDateText}>
                      {currentUserData?.createdAt
                        ? new Date(
                            currentUserData.createdAt,
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                          })
                        : "Joined"}
                    </Text>
                  </View>
                </View>

                {/* Row 3: Student ID */}
                <View style={styles.studentIdContainer}>
                  <Ionicons name="card-outline" size={12} color="#718096" />
                  <Text style={styles.studentIdText} numberOfLines={1}>
                    ID:{" "}
                    {currentUserData?.studentId ||
                      user.studentId ||
                      "UENR2023001"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Quick Stats Grid with animations */}
            <View style={styles.statsGrid}>
              {menuItems.map((item, index) => (
                <Animated.View
                  key={item.id}
                  style={{
                    transform: [{ scale: statsScaleAnims[index] }],
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.statCard,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                      },
                    ]}
                    onPress={() => handleMenuItemPress(item.id)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[styles.statIcon, { backgroundColor: item.color }]}
                    >
                      <Ionicons name={item.icon} size={20} color="#FFFFFF" />
                    </View>
                    <Text style={[styles.statCount, { color: theme.text }]}>
                      {item.count}
                    </Text>
                    <Text style={[styles.statTitle, { color: theme.text }]}>
                      {item.title}
                    </Text>
                    {item.badge && (
                      <Animated.View
                        style={[
                          styles.badge,
                          {
                            transform: [
                              {
                                scale: statsScaleAnims[index].interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0.5, 1],
                                }),
                              },
                            ],
                          },
                        ]}
                      >
                        <Text style={styles.badgeText}>{unreadCount}</Text>
                      </Animated.View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>

            {/* Settings Section */}
            <View
              style={[
                styles.settingsSection,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Settings
              </Text>
              {settingsItems.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.settingItem}
                  onPress={() => {
                    if (item.id === "edit-profile" && item.onPress) {
                      item.onPress(); // This will trigger the animated navigation
                    } else if (item.id === "report-problem" && item.onPress) {
                      item.onPress();
                    } else if (item.id === "about-app" && item.onPress) {
                      router.push("/about-app");
                    } else if (
                      item.id === "up-coming-compus-events" &&
                      item.onPress
                    ) {
                      router.push("/up-coming-events");
                    } else if (item.id === "security") {
                      router.push("/security");
                    } else if (item.type === "link") {
                      // Add press animation for other links
                      Animated.sequence([
                        Animated.timing(scaleAnim, {
                          toValue: 1.01,
                          duration: 100,
                          useNativeDriver: true,
                        }),
                        Animated.spring(scaleAnim, {
                          toValue: 1,
                          tension: 150,
                          friction: 3,
                          useNativeDriver: true,
                        }),
                      ]).start(() => {
                        Alert.alert(
                          "Coming Soon",
                          `${item.title} is coming soon!`,
                        );
                      });
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIcon}>
                      <Ionicons name={item.icon} size={22} color="gray" />
                    </View>
                    <Text style={[styles.settingText, { color: theme.text }]}>
                      {item.title}
                    </Text>
                  </View>

                  {item.type === "switch" ? (
                    <Switch
                      value={item.value}
                      onValueChange={() =>
                        animateSwitchToggle(item.onValueChange, item.value)
                      }
                      trackColor={{ false: "#E2E8F0", true: "#00BFFF" }}
                      thumbColor="#FFFFFF"
                    />
                  ) : (
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#A0AEC0"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Contact Info */}
            <View
              style={[
                styles.contactSection,
                { backgroundColor: theme.background },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Contact Information
              </Text>
              <View
                style={[styles.contactItem, { backgroundColor: theme.card }]}
              >
                <Ionicons name="call-outline" size={20} color="#718096" />
                <Text style={[styles.contactText, { color: theme.text }]}>
                  {currentUserData.phoneNumber}
                </Text>
              </View>
              <View
                style={[styles.contactItem, { backgroundColor: theme.card }]}
              >
                <Ionicons name="mail-outline" size={20} color="#718096" />
                <Text style={[styles.contactText, { color: theme.text }]}>
                  {currentUserData.email}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.shareButton}
                onPress={handleSharePress}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="share-social-outline"
                  size={20}
                  color="#00BFFF"
                />
                <Text style={styles.shareButtonText}>Share Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={animateLogoutPress}
                activeOpacity={0.8}
              >
                <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

// Styles remain exactly the same as your provided code...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#00BFFF',
    backgroundColor: "#00BFFF",
  },
  topSection: {
    height: "20%",
    backgroundColor: "#00BFFF",
    paddingTop: 40,
  },
  topContent: {
    flex: 1,
    paddingHorizontal: 20,
    padding: 10,
    position: "relative",
  },
  backButton: {
    position: "absolute",

    top: 10, // Changed from 0 to 10
    left: 20, // Changed from 0 to 20

    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  settingsButton: {
    position: "absolute",
    top: 10, // Changed from 0 to 10
    right: 20, // Changed from 0 to 20
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  profileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 3,
  },
  profileImageWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#00BFFF",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  ratingText: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 4,
    marginRight: 6,
  },
  ratingLabel: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.9)",
  },
  bottomSection: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },

  universityCard: {
    flexDirection: "row",
    alignItems: "flex-start", // Align to top, not center
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    marginRight: 14,
    marginTop: 2, // Align icon with first line of text
  },
  universityContent: {
    flex: 1,
  },
  universityName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 8,
    lineHeight: 20,
  },
  universityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  campusContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  campusText: {
    fontSize: 13,
    color: "#4A5568",
    marginLeft: 4,
    flex: 1,
  },
  joinDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  joinDateText: {
    fontSize: 11,
    color: "#00BFFF",
    fontWeight: "500",
    marginLeft: 4,
  },
  studentIdContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  studentIdText: {
    fontSize: 12,
    color: "#718096",
    marginLeft: 4,
  },

  universityInfo: {
    flex: 1,
    marginLeft: 12,
  },

  campusName: {
    fontSize: 14,
    color: "#4A5568",
    marginBottom: 2,
  },
  studentId: {
    fontSize: 12,
    color: "#718096",
  },
  memberSince: {
    alignItems: "center",
  },
  memberSinceText: {
    fontSize: 10,
    color: "#A0AEC0",
    marginBottom: 2,
  },
  memberSinceYear: {
    fontSize: 20,
    fontWeight: "700",
    color: "#00BFFF",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: (width - 72) / 3,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statCount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 12,
    color: "#718096",
    textAlign: "center",
  },
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FF4444",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  settingsSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 24,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3748",
    padding: 9,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F7FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: "#2D3748",
    fontWeight: "500",
  },
  contactSection: {
    marginBottom: 24,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 15,
    color: "#4A5568",
    marginLeft: 12,
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  shareButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#00BFFF",
    paddingVertical: 16,
    borderRadius: 12,
  },
  shareButtonText: {
    color: "#00BFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  logoutButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF4444",
    paddingVertical: 16,
    borderRadius: 12,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default ProfileScreen;
