// app/(tabs)/index.js
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import TopBar from "@/components/TopBar";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { getAllProducts } from "@/api/productApi";
import { darkTheme, lightTheme } from "@/constants/theme";
import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

export default function HomeScreen() {
  const CAMPUS_STORAGE_KEY = "selected_campus_location";
  const campusOptions = ["Main Campus", "Dormaa Ahenkro", "All Campuses"];

  //Loading states start here
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showSecondText, setShowSecondText] = useState(false);
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  // const [products, setProducts] = useState([]);

  const navigation = useNavigation();
  const [notificationCount, setNotificationCount] = useState(3);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationAnim = useState(new Animated.Value(0))[0];
  const fadeAnim = useRef(new Animated.Value(0)).current; // Start invisible
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("Main Campus");
  const [showCampusPicker, setShowCampusPicker] = useState(false);

  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const darkMode = useSelector((state) => state.theme.darkMode);
  const activeTheme = darkMode ? darkTheme : lightTheme;

  useEffect(() => {
    const interval = setInterval(() => {
      if (!scrollRef.current) return;

      const nextIndex =
        currentIndex + 1 >= featuredVendors.length ? 0 : currentIndex + 1;

      scrollRef.current.scrollTo({
        x: nextIndex * 172, // 👈 card width + margin
        animated: true,
      });

      setCurrentIndex(nextIndex);
    }, 3000); // change every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  // Product data

  // Categories with icons
  const categories = [
    { id: "all", label: "All", icon: "grid", color: "#1E3A8A" },
    { id: "books", label: "Books", icon: "book", color: "#1E3A8A" },
    {
      id: "electronics",
      label: "Electronics",
      icon: "phone-portrait",
      color: "#38B2AC",
    },
    { id: "clothing", label: "Clothing", icon: "shirt", color: "#ED64A6" },
    { id: "accessories", label: "Accessories", icon: "bag", color: "#9F7AEA" },
    { id: "software", label: "Software", icon: "desktop", color: "#4299E1" },
    { id: "supplies", label: "Supplies", icon: "briefcase", color: "#ED8936" },
    { id: "appliances", label: "Appliances", icon: "tv", color: "#48BB78" },
  ];
  const featuredVendors = [
    {
      id: "1",
      name: "Ama Electronics",
      category: "Phones & Gadgets",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      sponsored: true,
    },
    {
      id: "2",
      name: "Campus Drip",
      category: "Fashion",
      image: "https://media.istockphoto.com/id/2208803520/photo/young-woman-choosing-clothes-in-a-second-hand-shop-promoting-sustainable-fashion.jpg?s=1024x1024&w=is&k=20&c=3orgB4x4YTSo_2sbmTdeVRKfVvJFag_RszFAQNb9Dd4=",
      sponsored: false,
    },
    {
      id: "3",
      name: "Book Hub",
      category: "Textbooks",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
      sponsored: true,
    },
    {
      id: "4",
      name: "KichenMaster",
      category: "Food",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      sponsored: true,
    },
  ];
  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    const matchesSearch =
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const campusValue =
      product?.campus || product?.campusLocation || product?.location;
    // const matchesCampus =
    //   selectedCampus === "All Campuses" ||
    //   !campusValue ||
    //   campusValue === selectedCampus;

    const matchesCampus =
      selectedCampus === "All Campuses" || campusValue === selectedCampus;

    return matchesCategory && matchesSearch && matchesCampus;
  });

  const loadProducts = async () => {
    const res = await getAllProducts();
    setProducts(res.data.allProducts);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, []),
  );

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getAllProducts();
        setProducts(response.data.allProducts);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadSavedCampus = async () => {
      try {
        const savedCampus = await AsyncStorage.getItem(CAMPUS_STORAGE_KEY);
        if (savedCampus) {
          setSelectedCampus(savedCampus);
        }
      } catch (error) {
        console.log("Failed to load campus location", error);
      }
    };

    loadSavedCampus();
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipped(true);
      setTimeout(() => {
        setShowSecondText((prev) => !prev);
        setIsFlipped(false);
      }, 300); // Flip animation duration
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log("SEARCH:", searchQuery);
  }, [searchQuery]);

  const texts = [
    "UENR Marketplace 🎓",
    "Made for UENR Students 🦅",
    "Find Campus Accommodation ✨",
    "Buy & Sell Made Easy 💪",
    "Smart Campus Trading 🛒",
    "Fast Campus Delivery 🚀",

  ];

  useEffect(() => {
    // Initial entrance animation
    animateEntrance();

    // Set up interval for text changes
    const interval = setInterval(() => {
      changeTextWithAnimation();
    }, 4000); // Change text every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const animateEntrance = () => {
    // Animate from bottom to original position
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.back(0.5)),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const changeTextWithAnimation = () => {
    // First animate out (slide down and fade out)
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -50, // Slide up and out
        duration: 400,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Change text after animation completes
      setCurrentTextIndex((prev) => (prev + 1) % texts.length);

      // Reset position to bottom
      slideAnim.setValue(50);

      // Animate in (slide up and fade in)
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.back(0.3)),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNotificationPress = () => {
    if (!showNotifications) {
      setShowNotifications(true);

      Animated.spring(notificationAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
      }).start();
    } else {
      Animated.timing(notificationAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setShowNotifications(false));
    }

    setNotificationCount(0);
  };

  const handleLocationPress = () => {
    setShowCampusPicker((prev) => !prev);
  };

  const handleCampusSelection = async (campus: string) => {
    setSelectedCampus(campus);
    setShowCampusPicker(false);
    try {
      await AsyncStorage.setItem(CAMPUS_STORAGE_KEY, campus);
      Toast.show({
        type: "success",
        text1: "Campus updated",
        text2: `Now showing results for ${campus}`,
      });
    } catch (error) {
      console.log("Failed to save campus location", error);
      Toast.show({
        type: "error",
        text1: "Could not save campus",
        text2: "Please try again",
      });
    }
  };

  const handleSearch = (searchTerm) => {
    setSearchQuery(searchTerm);
  };

  const handleProductPress = useCallback((product) => {
    router.push({
      pathname: `/product/${product._id}`,
      params: { product: JSON.stringify(product) },
    });
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  return (
    <>
      {showNotifications && (
        <Animated.View
          style={[
            styles.notificationPopup,
            {
              opacity: notificationAnim,
              transform: [
                {
                  translateY: notificationAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
                {
                  scale: notificationAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.notificationTitle}>Notifications</Text>

          <View style={styles.notificationItem}>
            <Text>Ama rated you ⭐⭐⭐⭐⭐</Text>
          </View>

          <View style={styles.notificationItem}>
            <Text>Kwame sent you a message</Text>
          </View>

          <View style={styles.notificationItem}>
            <Text>Your listing was approved</Text>
          </View>
        </Animated.View>
      )}
      {showCampusPicker && (
        <View style={styles.campusPickerOverlay}>
          <View style={styles.campusPickerCard}>
            <Text style={styles.campusPickerTitle}>Choose Campus</Text>
            {campusOptions.map((campus) => (
              <TouchableOpacity
                key={campus}
                style={[
                  styles.campusOptionButton,
                  selectedCampus === campus && styles.campusOptionButtonActive,
                ]}
                onPress={() => handleCampusSelection(campus)}
              >
                <Text
                  style={[
                    styles.campusOptionText,
                    selectedCampus === campus && styles.campusOptionTextActive,
                  ]}
                >
                  {campus}
                </Text>
                {selectedCampus === campus && (
                  <Ionicons name="checkmark-circle" size={18} color="#00BFFF" />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.campusPickerCloseButton}
              onPress={() => setShowCampusPicker(false)}
            >
              <Text style={styles.campusPickerCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <StatusBar style="light" backgroundColor="#00BFFF" translucent={false} />
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        {/* Top Bar */}
        <TopBar
          userName="Kwame Ansah"
          userStatus="Verified Student"
          campusLocation={selectedCampus}
          notificationCount={notificationCount}
          onNotificationPress={handleNotificationPress}
          onLocationPress={handleLocationPress}
          onSearch={handleSearch}
          placeholder="Search textbooks, food, services..."
        />

        {/* Main Content */}
        <View style={styles.contentWrapper}>
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={["#00BFFF"]}
                tintColor="#00BFFF"
              />
            }
          >
            {/* White background with curved corners */}
            <View style={styles.whiteBackground}>
              {/* Welcome Section */}
              <View style={styles.welcomeSection}>
                <View style={styles.welcomeText}>
                  <Animated.View
                    style={[
                      styles.textContainer,
                      {
                        transform: [{ translateY: slideAnim }],
                        opacity: fadeAnim,
                      },
                    ]}
                  >
                    <Text style={styles.welcomeTitle} numberOfLines={1}>
                      {texts[currentTextIndex]}
                    </Text>
                  </Animated.View>

                  <Text style={styles.welcomeSubtitle} numberOfLines={1}>
                    Buy & sell with verified campus members
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.sellButton}
                  onPress={() => router.push("/sell")}
                >
                  <Ionicons name="add-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.sellButtonText}>Sell</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.featuredSection}>
                <View style={styles.featuredHeader}>
                  <Text style={styles.featuredTitle}>
                    Featured Campus Vendors
                  </Text>
                  <TouchableOpacity>
                    <Text style={styles.seeAll}>See All</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView
                  ref={scrollRef}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingBottom: 5,
                  }}
                  scrollEventThrottle={16}
                >
                  {featuredVendors.map((vendor) => (
                    <TouchableOpacity
                      key={vendor.id}
                      style={styles.vendorCard}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={{ uri: vendor.image }}
                        style={styles.vendorImage}
                      />

                      {/* Sponsored Badge */}
                      {vendor.sponsored && (
                        <View style={styles.sponsoredBadge}>
                          <Text style={styles.sponsoredText}>Sponsored</Text>
                        </View>
                      )}

                      <View style={styles.vendorInfo}>
                        <Text style={styles.vendorName}>{vendor.name}</Text>
                        <Text style={styles.vendorCategory}>
                          {vendor.category}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Category Filters - Horizontal Scroll */}
          {/* Category Filters - Horizontal Scroll */}
<View style={styles.categorySection}>
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.categoryContent}
    decelerationRate="fast" // 🚀 Smoother momentum on iOS/Android fling actions
  >
    {categories.map((category) => {
      const isActive = selectedCategory === category.id;
      
      return (
        <TouchableOpacity
          key={category.id}
          activeOpacity={0.8}
          style={[
            styles.categoryButton,
            isActive ? styles.categoryButtonActive : styles.categoryButtonInactive
          ]}
          onPress={() => setSelectedCategory(category.id)}
        >
          <Ionicons
            name={isActive ? category.focusedIcon : category.icon}
            size={18}
            color={isActive ? "#FFFFFF" : "#00BFFF"} // 🚀 Brand color accents icons elegantly
          />
          <Text
            style={[
              styles.categoryButtonText,
              isActive ? styles.categoryButtonTextActive : styles.categoryButtonTextInactive
            ]}
          >
            {category.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
</View>


              {/* Products Header */}
              <View style={styles.productsHeader}>
                <View>
                  <Text style={styles.productsTitle}>
                    {selectedCategory === "all"
                      ? "All Listings"
                      : categories.find((c) => c.id === selectedCategory)
                          ?.label}
                  </Text>
                  <Text style={styles.productCount}>
                    {filteredProducts.length}{" "}
                    {filteredProducts.length === 1 ? "item" : "items"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.sortButton}
                  onPress={() =>
                    Toast.show({
                      type: "info",
                      text1: "Sorting options",
                      text2: "Advanced filters are coming soon.",
                    })
                  }
                >
                  <Ionicons name="funnel" size={18} color="#1E3A8A" />
                  <Text style={styles.sortText}>Filter</Text>
                </TouchableOpacity>
              </View>

              {/* Products Grid */}
              <View style={styles.productsGrid}>
                {loading ? (
                  <>
                    <ProductSkeleton />
                    <ProductSkeleton />
                    <ProductSkeleton />
                    <ProductSkeleton />
                  </>
                ) : (
                  filteredProducts.map((p) => (
                    <ProductCard
                      key={p._id}
                      product={p}
                      onPress={() => handleProductPress(p)}
                    />
                  ))
                )}
              </View>

              {/* Campus Safety Tip */}
              <View style={styles.safetyTip}>
                <Ionicons name="shield-checkmark" size={24} color="#38A169" />
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Safety First</Text>
                  <Text style={styles.tipText}>
                    Always meet in public campus spots like the library or
                    cafeteria.
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  whiteBackground: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
    minHeight: "100%",
  },
  welcomeSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A365D",
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#718096",
  },
  sellButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E3A8A",

    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    flexShrink: 0, // ✅ VERY IMPORTANT
  },

  sellButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
categorySection: {
  marginVertical: 16,
},
categoryContent: {
  paddingHorizontal: 20,
  paddingVertical: 4,
},
categoryButton: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 18,
  paddingVertical: 10,
  borderRadius: 100, // 🚀 Perfect pill shape layout anchor
  marginRight: 12,
  gap: 6,
},
categoryButtonInactive: {
  backgroundColor: "rgba(0, 191, 255, 0.06)", // 🚀 6% brand color tint instead of raw dull gray
  borderWidth: 1,
  borderColor: "rgba(0, 191, 255, 0.12)", // Soft baseline ring
},
categoryButtonActive: {
  backgroundColor: "#00BFFF", // Full premium active brand pop
  borderWidth: 1,
  borderColor: "#00BFFF",
  // Modern Elevation Drop Shadow
  shadowColor: "#00BFFF",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 6,
},
categoryButtonText: {
  fontSize: 14,
  fontWeight: "600",
  letterSpacing: 0.15,
},
categoryButtonTextInactive: {
  color: "#1E3A8A", // Deep professional blue text for high contrast readability
},
categoryButtonTextActive: {
  color: "#FFFFFF",
},

  productsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  productsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A365D",
  },
  productCount: {
    fontSize: 14,
    color: "#718096",
    marginTop: 2,
  },
  welcomeText: {
    flex: 1,
    paddingRight: 12,
  },

  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  sortText: {
    fontSize: 14,
    color: "#1E3A8A",
    fontWeight: "600",
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  safetyTip: {
    flexDirection: "row",
    backgroundColor: "rgba(56, 161, 105, 0.1)",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginBottom: 30,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(56, 161, 105, 0.2)",
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2F855A",
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: "#38A169",
    lineHeight: 20,
  },

  //popup notifications
  notificationPopup: {
    position: "absolute",
    top: 80,
    right: 20,
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 1000,
  },

  notificationTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },

  textContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  featuredSection: {
    marginBottom: 24,
  },

  featuredHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },

  featuredTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A365D",
  },

  seeAll: {
    color: "#00BFFF",
    fontWeight: "600",
  },

  vendorCard: {
    width: 160,
    height: 180,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    elevation: 3,
  },

  vendorImage: {
    width: "100%",
    height: 110,
  },

  vendorInfo: {
    padding: 10,
  },

  vendorName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A365D",
  },

  vendorCategory: {
    fontSize: 12,
    color: "#718096",
  },

  sponsoredBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FF3B30",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  sponsoredText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },

  notificationItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  campusPickerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.35)",
    justifyContent: "center",
    paddingHorizontal: 20,
    zIndex: 999,
  },
  campusPickerCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  campusPickerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A365D",
    marginBottom: 12,
  },
  campusOptionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: "#F8FAFC",
  },
  campusOptionButtonActive: {
    backgroundColor: "rgba(0, 191, 255, 0.12)",
  },
  campusOptionText: {
    color: "#334155",
    fontWeight: "500",
  },
  campusOptionTextActive: {
    color: "#0F172A",
    fontWeight: "700",
  },
  campusPickerCloseButton: {
    marginTop: 8,
    alignSelf: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  campusPickerCloseText: {
    color: "#1E3A8A",
    fontWeight: "600",
  },
});
