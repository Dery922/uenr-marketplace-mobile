// screens/ProductDetailScreen.js
import { startConversation } from "@/api/chatApi";
import { getToken } from "@/utils/tokenStorage";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ImageView from "react-native-image-viewing";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import { API_BASE_URL } from "@/api/demon";

const { width } = Dimensions.get("window");

const ProductDetailScreen = () => {
  let { product } = useLocalSearchParams();
  
  product = product ? JSON.parse(product as string) : null;
  const user = useSelector((state: any) => state.auth.user);

  const params = useLocalSearchParams();
  let phoneNumber = product.phoneNumber || "0000000000";
  const [sellerModalVisible, setSellerModalVisible] = useState(false);

    const [viewsCount, setViewsCount] = useState<number>(0);

  if (!user) return null;

  const isOwner = user?._id === product?.seller?._id;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const insets = useSafeAreaInsets();

  const [hasPurchasedFromSeller, setHasPurchasedFromSeller] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const lastTap = useRef(null);
  const [viewerIndex, setViewerIndex] = useState(0);
  const productId = product?._id || product?.id;




  // Simulate checking purchase history
  useEffect(() => {
    // In real app, check your backend/database
    // For now, simulate random
    setHasPurchasedFromSeller(Math.random() > 0.5);
  }, [product.sellerId]);

useEffect(() => {
  const registerProductView = async () => {
    if (isOwner) {
      setViewsCount(product?.views || 0);
      return;
    }

    try {
      // 1. Get your authentication token (adjust this line to match how you get your token elsewhere)
      const token = await getToken(); // e.g., SecureStore.getItemAsync('token') or AsyncStorage.getItem('token')

      const response = await axios.patch(
        `${API_BASE_URL}/${productId}/view`, 
        {}, // 2. Empty body object (PATCH requests require a body parameter before headers)
        {
          headers: {
            'Authorization': `Bearer ${token}`, // 3. Pass the token to satisfy 'protect' middleware
            'Accept': 'application/json',
          }
        }
      );
      
      setViewsCount(response.data.views);
    } catch (error: any) {
      console.log("⚠️ Background view tracking failed:", error.response?.data || error.message);
    }
  };

  if (productId && user) {
    registerProductView();
  }
}, [productId, isOwner]);



  // Animation refs
  const slideAnim = useRef(new Animated.Value(1000)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const imageScaleAnim = useRef(new Animated.Value(0.95)).current;

  const images = product?.images || [];
  const imageUrls = images.map((img) => ({ uri: img }));

  // Start animations on mount
  useEffect(() => {
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Main image scale animation
    Animated.timing(imageScaleAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    // Bottom section slide up
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      easing: Easing.out(Easing.back(1)),
      useNativeDriver: true,
    }).start();

    // Content fade in with delay
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay: 300,
      useNativeDriver: true,
    }).start();
  };

  const shareProduct = async () => {
    try {
      await Share.share({
        message: `Check out this ${product.title} for ${product.price} on CampusMarket: ${product.description}`,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share product.");
    }
  };

  // In ProductDetailScreen.js - Update the chat button handler

  const handleChatPress = async () => {
    try {
      const response = await startConversation({
        productId: product._id,
        receiverId: product.seller._id,
      });

      const conversation = response.data.conversation;

      router.push({
        pathname: `/chat/${conversation._id}`,
        params: {
          sellerName: product.seller.name,
          sellerId: product.seller._id,
          productTitle: product.title,
          productPrice: product.price,
          sellerPhone: product.phoneNumber,
          productImage: product.images?.[0] || "",
          productId: product._id,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };
  // const callSeller = () => {
  //   Linking.openURL(`tel:${product.sellerPhone}`);
  // };

  const callSeller = () => {
    // Clean the number (remove spaces/dashes) to avoid errors
    const cleanNumber = phoneNumber.replace(/[^0-9+]/g, "");

    // telprompt: gives an extra confirmation on iOS before calling
    const url =
      Platform.OS === "ios" ? `telprompt:${cleanNumber}` : `tel:${cleanNumber}`;

    Linking.openURL(url).catch((err) => {
      console.error("Failed to open dialer:", err);
      alert("Could not open the phone dialer.");
    });
  };

  const reportItem = () => {
    router.push({
      pathname: "/report-problem",
      params: {
        targetId: product._id,
        targetType: "product",
        targetTitle: product.title,
        targetImage: product.images?.[0] || "",
      },
    });
  };

  // Handle gallery item press
  const handleGalleryItemPress = (index) => {
    setCurrentImageIndex(index);

    // Animate main image change
    imageScaleAnim.setValue(0.95);
    Animated.spring(imageScaleAnim, {
      toValue: 1,
      tension: 150,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  // Render gallery item
  // Render gallery item
  const renderGalleryItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.galleryItem,
        index === currentImageIndex && styles.galleryItemActive,
      ]}
      onPress={() => handleGalleryItemPress(index)}
      activeOpacity={0.7}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          setViewerIndex(index); // ✅ Set the index to the tapped image
          setViewerVisible(true); // ✅ Open the viewer
        }}
      >
        <Image
          source={{ uri: item }}
          style={styles.galleryImage}
          contentFit="cover"
        />
      </TouchableOpacity>
      {index === currentImageIndex && (
        <View style={styles.selectedOverlay}>
          <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
        </View>
      )}
    </TouchableOpacity>
  );
  // Navigate back with animation
  const handleBackPress = () => {
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
      router.back();
    });
  };

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Blue Section (20%) */}
      <View style={styles.topSection}>
        {/* Main Image Container with blue background */}
        <Animated.View
          style={[
            styles.imageContainer,
            {
              transform: [{ scale: imageScaleAnim }],
            },
          ]}
        >
          <LinearGradient
  colors={["rgba(0,0,0,0.45)", "transparent"]}
  style={styles.topOverlay}
/>
          {images.length > 0 ? (
            <FlatList
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToAlignment="center"
              // Add these two:
              scrollEventThrottle={16} // This makes the scroll tracking high-frequency (60fps)
              onScroll={(e) => {
                const contentOffset = e.nativeEvent.contentOffset.x;
                const currentIndex = Math.round(contentOffset / width);

                // Only update state if the index actually changed to prevent unnecessary re-renders
                if (currentIndex !== currentImageIndex) {
                  setCurrentImageIndex(currentIndex);
                }
              }}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={{ width: width, height: "100%" }}
                  contentFit="cover"
                />
              )}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={40} color="#fff" />
              <Text style={styles.placeholderText}>No Image Available</Text>
            </View>
          )}

          {/* Navigation Buttons */}
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Image Indicators */}
          {images.length > 1 && (
            <View style={styles.imageIndicators}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.imageIndicator,
                    index === currentImageIndex && styles.imageIndicatorActive,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.imageActions}>
            <TouchableOpacity
              style={styles.imageActionButton}
              onPress={() => {
                setIsSaved(!isSaved);
                // Add animation for save button
                Animated.sequence([
                  Animated.timing(imageScaleAnim, {
                    toValue: 1.02,
                    duration: 100,
                    useNativeDriver: true,
                  }),
                  Animated.spring(imageScaleAnim, {
                    toValue: 1,
                    tension: 150,
                    friction: 3,
                    useNativeDriver: true,
                  }),
                ]).start();
              }}
            >
              <Ionicons
                name={isSaved ? "heart" : "heart-outline"}
                size={24}
                color={isSaved ? "#FF4444" : "#FFFFFF"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imageActionButton}
              onPress={shareProduct}
            >
              <Ionicons name="share-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          {/* Price Badge */}
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>{product.price}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPriceBadge}>
                {product.originalPrice}
              </Text>
            )}
          </View>
        </Animated.View>
      </View>

      {/* Bottom White Section (80%) with curved top */}
      <Animated.View
        style={[
          styles.bottomSection,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Product Title and Info */}
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <Text style={styles.productTitle}>{product.title}</Text>
                {product.isVerified && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#FFFFFF"
                    />
                  </View>
                )}
              </View>

              <View style={styles.metaInfo}>
                <View style={styles.metaItem}>
                  <Ionicons name="eye-outline" size={14} color="#718096" />
                  <Text style={styles.metaText}>
                    {viewsCount } views
               
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="heart-outline" size={14} color="#718096" />
                  <Text style={styles.metaText}>
                    {product.saves || 0} saves
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color="#718096" />
                  <Text style={styles.metaText}>
                    {product.time || "Recently"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Product Details */}
            <View style={styles.detailsSection}>
              <View style={styles.detailRow}>
                <Ionicons name="pricetag-outline" size={20} color="#4A5568" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Price</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.currentPrice}>{product.price}</Text>
                    {product.originalPrice && (
                      <Text style={styles.originalPrice}>
                        {product.originalPrice}
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="cube-outline" size={20} color="#4A5568" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Condition</Text>
                  <Text style={styles.detailValue}>
                    {product.condition || "Good"}
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={20} color="#4A5568" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Location</Text>
                  <Text style={styles.detailValue}>{product.location}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="business-outline" size={20} color="#4A5568" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Category</Text>
                  <View style={styles.categoryBadge}>
                    <Ionicons
                      name={
                        product.category === "electronics"
                          ? "laptop-outline"
                          : product.category === "books"
                            ? "book-outline"
                            : product.category === "clothing"
                              ? "shirt-outline"
                              : "cube-outline"
                      }
                      size={14}
                      color="#00BFFF"
                    />
                    <Text style={styles.categoryText}>
                      {product.category?.charAt(0).toUpperCase() +
                        product.category?.slice(1) || "Other"}
                    </Text>
                  </View>
                </View>
              </View>

              {product.isNegotiable && (
                <View style={styles.negotiableBadge}>
                  <Ionicons
                    name="hand-left-outline"
                    size={16}
                    color="#38A169"
                  />
                  <Text style={styles.negotiableText}>Price is negotiable</Text>
                </View>
              )}
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>

            {/* seller info */}

            {/* Image Gallery Section - INSIDE THE WHITE CARD */}
            {images.length > 1 && (
              <View style={styles.gallerySection}>
                <Text style={styles.sectionTitle}>All Photos</Text>
                <FlatList
                  data={images}
                  renderItem={renderGalleryItem}
                  keyExtractor={(item, index) => `gallery-${index}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.galleryList}
                  snapToAlignment="start"
                  decelerationRate="fast"
                  snapToInterval={76} // width + margin
                />
                <Text style={styles.galleryHint}>
                  Tap any photo to view it larger
                </Text>
              </View>
            )}

            {/* Seller Info */}
            {/* Seller Info Segment */}
            {/* Seller Info Segment */}
            <View style={styles.sellerSection}>
              <Text style={styles.sectionTitle}>Seller Information</Text>

              <TouchableOpacity
                style={styles.sellerCard}
                activeOpacity={0.7}
                onPress={() => setSellerModalVisible(true)} // 👈 Opens the modal instantly
              >
                <View style={styles.sellerHeader}>
                  <View style={styles.sellerAvatar}>
                    {product.seller?.avatar ? (
                      <Image
                        source={{ uri: product.seller.avatar }}
                        style={styles.avatarImage}
                      />
                    ) : (
                      <Ionicons name="person" size={24} color="#fff" />
                    )}
                  </View>

                  <View style={styles.sellerInfo}>
                    <Text style={styles.sellerName}>
                      {product.seller?.name || "Campus Seller"}
                    </Text>
                    <Text style={styles.ratingText}>Active Student Vendor</Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="#A0AEC0"
                    style={styles.chevronIcon}
                  />
                </View>
              </TouchableOpacity>
            </View>

            {/* Safety Tips */}
            <View style={styles.safetySection}>
              <Text style={styles.sectionTitle}>Safety Tips</Text>
              <View style={styles.tipsList}>
                <View style={styles.tipItem}>
                  <Ionicons name="shield-checkmark" size={16} color="#38A169" />
                  <Text style={styles.tipText}>
                    Meet in public places on campus
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons name="shield-checkmark" size={16} color="#38A169" />
                  <Text style={styles.tipText}>
                    Inspect the item before paying
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons name="shield-checkmark" size={16} color="#38A169" />
                  <Text style={styles.tipText}>Never pay in advance</Text>
                </View>
              </View>
            </View>

            {/* Report Button */}
            <View style={{ marginVertical: 20, alignItems: "center" }}>
              <TouchableOpacity
                style={styles.reportButton}
                onPress={reportItem}
              >
                <Ionicons name="flag-outline" size={16} color="#1b6ae0" />
                <Text style={styles.reportText}>Report this listing</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Fixed Action Bar */}
        {/* Fixed Action Bar */}
        {/* Fixed Action Bar */}
        <View style={[styles.actionBar, { paddingBottom: 16 + insets.bottom }]}>
          {!isOwner ? (
            <>
              {/* Left Action: Safety Tip Trigger */}
              <TouchableOpacity
                style={styles.safetyButton}
                onPress={() =>
                  Alert.alert(
                    "Campus Market Safety 🛡️",
                    "1. Always meet in a public, well-lit campus area (e.g., library or cafeteria).\n2. Inspect the item thoroughly before exchanging money.\n3. Avoid secluded locations or off-campus meetups alone.",
                  )
                }
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={18}
                  color="#4A5568"
                />
                <Text style={styles.safetyButtonText}>Safety Tips</Text>
              </TouchableOpacity>

              {/* Right Primary Action: Chat with Seller */}
              <TouchableOpacity
                style={styles.chatButtonFull}
                onPress={handleChatPress}
              >
                <Ionicons name="chatbubble-outline" size={20} color="#FFFFFF" />
                <Text style={styles.chatButtonTextFull}>Chat with Seller</Text>
              </TouchableOpacity>
            </>
          ) : (
            /* If the user views their own item listing, show a helpful Management Action instead */
            <TouchableOpacity
              style={styles.ownerManageButton}
              onPress={() => router.push(`/edit-product/${product._id}`)}
            >
              <Ionicons name="create-outline" size={20} color="#FFFFFF" />
              <Text style={styles.ownerManageText}>Edit Item Details</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      <ImageView
        images={imageUrls}
        imageIndex={viewerIndex}
        visible={viewerVisible}
        onRequestClose={() => setViewerVisible(false)}
      />

      {/* Premium Seller Info Bottom-Sheet Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={sellerModalVisible}
        onRequestClose={() => setSellerModalVisible(false)}
      >
        {/* Backdrop overlay that dismisses modal on tap */}
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setSellerModalVisible(false)}
        >
          <View style={styles.modalContentCard}>
            {/* Top decorative handle indicator */}
            <View style={styles.modalHandle} />

            <Text style={styles.modalTitle}>Seller Profile</Text>

            {/* Profile Identity Row */}
            {/* Profile Identity Row */}
            <View style={styles.modalProfileRow}>
              <View style={styles.modalLargeAvatar}>
                {product.seller?.avatar ? (
                  <Image
                    source={{ uri: product.seller.avatar }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Ionicons name="person" size={36} color="#fff" />
                )}
              </View>

              {/* The wrapper must cleanly encapsulate the Text components */}
              <View>
                <Text style={styles.modalSellerName}>
                  {product.seller?.name || "Campus Seller"}
                </Text>
                <View style={styles.modalBadgeRow}>
                  <View style={styles.modalStudentBadge}>
                    <Ionicons name="school" size={12} color="#38A169" />
                    <Text style={styles.modalBadgeText}>Verified Student</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Trust and Activity Metrics Grid */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <Text style={styles.metricNumber}>4.9 ★</Text>
                <Text style={styles.metricLabel}>Rating (24)</Text>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.metricItem}>
                <Text style={styles.metricNumber}>{product.views || 12}</Text>
                <Text style={styles.metricLabel}>Items Sold</Text>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.metricItem}>
                <Text style={styles.metricNumber}>2024</Text>
                <Text style={styles.metricLabel}>Joined</Text>
              </View>
            </View>

            {/* Core Verification Meta Details */}
            <View style={styles.modalDetailsContainer}>
              <View style={styles.modalDetailField}>
                <Ionicons name="location-outline" size={18} color="#718096" />
                <Text style={styles.modalFieldText}>
                  Primary Campus:{" "}
                  <Text style={{ fontWeight: "600", color: "#2D3748" }}>
                    {product.location || "Main Campus"}
                  </Text>
                </Text>
              </View>
            </View>

            {/* Primary Action Call to Close / Proceed */}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setSellerModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close Profile</Text>
            </TouchableOpacity>
          </View>{" "}
          {/* FIXED: Moved the card container closing tag here to encompass all elements */}
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // or "#F8FAFC"
  },
  topOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 120,
  zIndex: 1,
},
  viewerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  viewerCloseArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  viewerImage: {
    width: "100%",
    height: "80%",
  },
  topSection: {
    height: "35%",
    backgroundColor: "#00BFFF",
  },
  imageContainer: {
    flex: 1,
    backgroundColor: "#00BFFF",
    position: "relative",
    overflow: "hidden",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 191, 255, 0.3)", // Blue overlay
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#00BFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 8,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    zIndex:10,
  },
  imageIndicators: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  imageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  imageIndicatorActive: {
    backgroundColor: "#FFFFFF",
    width: 20,
  },
  imageActions: {
    position: "absolute",
    top: 40,
    right: 20,
    flexDirection: "row",
    gap: 10,
  },
  imageActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  priceBadge: {
    position: "absolute",
    bottom: 10,
    right: 29,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  priceBadgeText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00BFFF",
  },
  originalPriceBadge: {
    fontSize: 12,
    color: "#718096",
    textDecorationLine: "line-through",
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
  // Add this to style the native image inside the avatar blob
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
  },
  // Aligns the chevron arrow beautifully to the far right side of the card
  chevronIcon: {
    marginLeft: "auto",
    paddingLeft: 8,
  },

  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  actionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  safetyButton: {
    flex: 1, // Uses exactly enough space for safety details
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EDF2F7", // Neutral off-white/gray style
    borderRadius: 12,
    paddingVertical: 14,
    gap: 6,
  },
  safetyButtonText: {
    color: "#4A5568",
    fontSize: 14,
    fontWeight: "600",
  },
  chatButtonFull: {
    flex: 2.2, // Takes the dominant priority share of the layout width
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00BFFF", // Bold theme brand color
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  chatButtonTextFull: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  ownerManageButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4A5568",
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  ownerManageText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  header: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2D3748",
    flex: 1,
    lineHeight: 28,
  },
  verifiedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#38A169",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  metaInfo: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 12,
    color: "#718096",
    marginLeft: 4,
  },
  detailsSection: {
    backgroundColor: "#F7FAFC",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  detailContent: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: "#718096",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: "#2D3748",
    fontWeight: "500",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00BFFF",
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: "#A0AEC0",
    textDecorationLine: "line-through",
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 191, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  categoryText: {
    fontSize: 14,
    color: "#00BFFF",
    fontWeight: "500",
    marginLeft: 6,
  },
  negotiableBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(56, 161, 105, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  negotiableText: {
    fontSize: 14,
    color: "#38A169",
    fontWeight: "500",
    marginLeft: 6,
  },
  section: {
    marginBottom: 24,
  },
  // Add these styles to your StyleSheet
  ratingSection: {
    marginBottom: 24,
    backgroundColor: "#F7FAFC",
    borderRadius: 16,
    padding: 16,
  },
  ratingDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  ratingStars: {
    flexDirection: "row",
    gap: 2,
  },
  ratingNumbers: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3748",
    marginRight: 8,
  },
  ratingCount: {
    fontSize: 14,
    color: "#718096",
  },
  viewReviewsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    marginBottom: 12,
  },
  viewReviewsText: {
    fontSize: 14,
    color: "#4A5568",
    fontWeight: "500",
  },
  viewProfileButton: {
    backgroundColor: "#EBF8FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewProfileText: {
    color: "#00BFFF",
    fontWeight: "600",
    fontSize: 14,
  },

  addReviewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00BFFF",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  addReviewText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#4A5568",
    lineHeight: 24,
  },
  // Gallery Section Styles
  gallerySection: {
    marginBottom: 24,
    backgroundColor: "#F7FAFC",
    borderRadius: 16,
    padding: 16,
  },
  galleryList: {
    paddingRight: 8,
  },
  galleryItem: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
  },
  galleryItemActive: {
    borderColor: "#00BFFF",
  },
  galleryImage: {
    width: "100%",
    height: "100%",
  },
  selectedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 191, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  galleryHint: {
    fontSize: 12,
    color: "#718096",
    marginTop: 12,
    textAlign: "center",
    fontStyle: "italic",
  },
  sellerSection: {
    marginBottom: 24,
  },
  sellerCard: {
    backgroundColor: "#F7FAFC",
    borderRadius: 16,
    padding: 16,
  },
  sellerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 15,
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#00BFFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginRight: 12,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 4,
  },
  sellerRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: "#4A5568",
    fontWeight: "600",
    marginLeft: 4,
    marginRight: 8,
  },
  ratingCount: {
    fontSize: 12,
    color: "#718096",
  },
  sellerVerified: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(56, 161, 105, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: "#38A169",
    fontWeight: "500",
    marginLeft: 4,
  },
  sellerContact: {
    flexDirection: "row",
    gap: 12,
  },
  contactButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 12,
    borderRadius: 12,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
  },
  safetySection: {
    marginBottom: 24,
  },
  tipsList: {
    backgroundColor: "#F7FAFC",
    borderRadius: 16,
    padding: 16,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: "#4A5568",
    marginLeft: 8,
    flex: 1,
  },
  reportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  reportText: {
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "600",
    marginLeft: 8,
  },
  actionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    gap: 12,
  },
  chatButton: {
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
  chatButtonText: {
    color: "#00BFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  buyButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00BFFF",
    paddingVertical: 16,
    borderRadius: 12,
  },
  buyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },

  //modal style start
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end", // Aligns modal sheet to the bottom
  },
  // Main sheet white container card
  modalContentCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40, // Extra padding for safe area bottom spacing
    paddingTop: 12,
    maxHeight: "80%", // Ensures it doesn't overflow small screens
  },
  // Top decorative drag handle indicator
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A202C",
    marginBottom: 20,
    textAlign: "center",
  },
  // Profile Row layouts
  modalProfileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  modalLargeAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#CBD5E0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  modalSellerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 6,
  },
  modalBadgeRow: {
    flexDirection: "row",
  },
  modalStudentBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6FFFA",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#B2F5EA",
  },
  modalBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#234E52",
    marginLeft: 4,
  },
  // Trust & Activity Grid Layout
  metricsGrid: {
    flexDirection: "row",
    backgroundColor: "#F7FAFC",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  metricItem: {
    alignItems: "center",
    flex: 1,
  },
  metricNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A202C",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: "#718096",
  },
  verticalDivider: {
    width: 1,
    height: "60%",
    backgroundColor: "#E2E8F0",
  },
  // Location details block
  modalDetailsContainer: {
    marginBottom: 32,
  },
  modalDetailField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
    padding: 14,
    borderRadius: 12,
  },
  modalFieldText: {
    fontSize: 14,
    color: "#4A5568",
    marginLeft: 10,
  },
  // Close CTA Button
  modalCloseButton: {
    backgroundColor: "#2B6CB0", // Corporate deep blue accent
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Android shadow
  },
  modalCloseButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProductDetailScreen;
