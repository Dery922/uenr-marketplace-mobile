import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function HostelDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [showImageViewer, setShowImageViewer] = useState(false);
  const fullscreenRef = useRef(null);
  // TO DO: Fetch hostel data from MongoDB using the ID
  // Mock data for layout design:
  const hostel = {
    id: id || "1",
    name: "Elite Campus Residency",
    price: "4,500",
    priceUnit: "per semester",
    location: "UENR Front Gate, Sunyani",
    distance: "3 mins walk to Main Gate", // Clear proximity
    isSubscribed: true,
    videoUrl: "https://www.youtube.com/watch?v=TPzfyNtXz_M", // Virtual tour target link
    images: ["https://unsplash.com", "https://unsplash.com"],
    description:
      "Modern self-contained rooms located right next to the UENR campus. Equipped with a reliable borehole system so water never stops flowing, individual prepaid ECG meters, and 24/7 security patrol.",
    amenities: [
      "Self-Contained Toilet",
      "Borehole Water",
      "Prepaid Meter",
      "Study Room",
      "WiFi Included",
      "Standby Generator",
      "AC Optional",
    ],

    // NEW Feature: Real-Time Availability Tracker Breakdown
    roomTypes: [
      { name: "1-in-1 (Private)", price: "6,500", slotsLeft: 1 },
      { name: "2-in-1 (Shared)", price: "4,500", slotsLeft: 3 },
      { name: "4-in-1 (Standard)", price: "2,800", slotsLeft: 0 }, // Fully booked
    ],

    // NEW Feature: Verified Student Reviews & Scores Breakdown
    rating: 4.7,
    reviewCount: 42,
    reviewBreakdown: {
      water: 4.9,
      security: 4.8,
      electricity: 4.5,
      friendliness: 4.6,
    },

    managerName: "Mr. Kwaku Mensah",
    managerPhone: "+233241234567",
  };

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const insets = useSafeAreaInsets();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${hostel.name} near UENR on the Marketplace app! Price: GH₵${hostel.price}/${hostel.priceUnit}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // PASTE THIS INTO YOUR app/hostel/[id].js LOGIC BLOCK (Above the return statement):

  const handleWhatsAppChat = () => {
    if (!hostel.isSubscribed) {
      Alert.alert("Locked", "Manager contact information is hidden.");
      return;
    }
    // Formats and cleans phone string patterns safely for the WhatsApp API
    const cleanedPhone = hostel.managerPhone.replace(/[^0-9]/g, "");
    Linking.openURL(`https://wa.me{cleanedPhone}`).catch(() =>
      Alert.alert("Error", "WhatsApp is not installed on this device."),
    );
  };

  const handleDirectCall = () => {
    if (!hostel.isSubscribed) {
      Alert.alert("Locked", "Manager contact information is hidden.");
      return;
    }
    Linking.openURL(`tel:${hostel.managerPhone}`).catch(() =>
      Alert.alert("Error", "Direct calling is not supported on this device."),
    );
  };

  const handlePlayVideoTour = () => {
    if (!hostel.videoUrl) return;
    Linking.openURL(hostel.videoUrl).catch(() =>
      Alert.alert("Error", "Could not launch virtual tour video."),
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Dynamic Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Image Gallery */}
        {/* Modern Swipeable Image Gallery */}
        <View style={styles.imageContainer}>
          <ScrollView
            ref={fullscreenRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onContentSizeChange={() => {
              fullscreenRef.current?.scrollTo({
                x: activeImageIndex * width,
                animated: false,
              });
            }}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width,
              );
              setActiveImageIndex(index);
            }}
          >
            {hostel.images.map((image, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.95}
                onPress={() => setShowImageViewer(true)}
                style={styles.imageSlide}
              >
                <Image
                  source={{ uri: image }}
                  style={styles.mainHeroImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Top Floating Navigation */}
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.circularButton}
            >
              <Ionicons name="arrow-back" size={22} color="#1A365D" />
            </TouchableOpacity>

            <View style={styles.topBarRight}>
              <TouchableOpacity
                onPress={handleShare}
                style={styles.circularButton}
              >
                <Ionicons
                  name="share-social-outline"
                  size={22}
                  color="#1A365D"
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.circularButton}>
                <Ionicons name="heart-outline" size={22} color="#1A365D" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Image Counter */}
          <View style={styles.imageCounter}>
            <Ionicons name="images-outline" size={14} color="#FFF" />
            <Text style={styles.imageCounterText}>
              {activeImageIndex + 1}/{hostel.images.length}
            </Text>
          </View>

          {/* Pagination 
  {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            {hostel.images.map((image, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  activeImageIndex === index && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Property Core Info */}
        <View style={styles.infoWrapper}>
          <View style={styles.titlePriceRow}>
            <Text style={styles.hostelTitle}>{hostel.name}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>GH₵{hostel.price}</Text>
              <Text style={styles.priceUnit}>/{hostel.priceUnit}</Text>
            </View>
          </View>

          {/* Location & Distance Badge */}
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color="#00BFFF" />
            <Text style={styles.locationText}>{hostel.location}</Text>
          </View>
          <View style={styles.distanceBadge}>
            <Ionicons name="walk" size={14} color="#2B6CB0" />
            <Text style={styles.distanceText}>
              {hostel.distance} from UENR campus
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Amenities Grid */}
          <Text style={styles.sectionHeading}>What this place offers</Text>
          <View style={styles.amenitiesGrid}>
            {hostel.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityItem}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color="#00BFFF"
                />
                <Text style={styles.amenityLabel}>{amenity}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionHeading}>About this hostel</Text>
          <Text style={styles.descriptionText}>{hostel.description}</Text>

          <View style={styles.divider} />

          {/* 🌟 FEATURE 1: REAL-TIME ROOM AVAILABILITY TRACKER */}
          <Text style={styles.sectionHeading}>
            Room Types & Live Availability
          </Text>
          <View style={styles.roomListContainer}>
            {hostel.roomTypes.map((room, index) => {
              const isFull = room.slotsLeft === 0;
              const isUrgent = room.slotsLeft > 0 && room.slotsLeft <= 2;

              return (
                <View key={index} style={styles.roomTypeRow}>
                  <View>
                    <Text style={styles.roomTypeName}>{room.name}</Text>
                    <Text style={styles.roomTypePrice}>
                      GH₵{room.price}{" "}
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: "normal",
                          color: "#718096",
                        }}
                      >
                        /semester
                      </Text>
                    </Text>
                  </View>

                  {/* Status pills based on remaining counts */}
                  <View
                    style={[
                      styles.availabilityPill,
                      isFull
                        ? { backgroundColor: "#FEE2E2" }
                        : isUrgent
                          ? { backgroundColor: "#FEF3C7" }
                          : { backgroundColor: "#DCFCE7" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.availabilityPillText,
                        isFull
                          ? { color: "#EF4444" }
                          : isUrgent
                            ? { color: "#D97706" }
                            : { color: "#16A34A" },
                      ]}
                    >
                      {isFull
                        ? "Fully Booked"
                        : isUrgent
                          ? `Only ${room.slotsLeft} beds left!`
                          : `${room.slotsLeft} rooms available`}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.divider} />

          {/* 🌟 FEATURE 2: VIRTUAL VIDEO TOUR SECTION */}
          <Text style={styles.sectionHeading}>Virtual Room Walkthrough</Text>
          <TouchableOpacity
            style={styles.videoTourCard}
            activeOpacity={0.9}
            onPress={handlePlayVideoTour}
          >
            <Image
              source={{ uri: hostel.images[0] }}
              style={styles.videoThumbnail}
              blurRadius={2}
            />
            {/* Dark overlay sheet masking thumbnail */}
            <View style={styles.videoOverlayShadow} />
            <View style={styles.playButtonCircle}>
              <Ionicons
                name="play"
                size={28}
                color="#00BFFF"
                style={{ marginLeft: 4 }}
              />
            </View>
            <Text style={styles.videoTourText}>Watch Room Video Tour</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* 🌟 FEATURE 3: VERIFIED STUDENT REVIEWS & CRITERIA RATINGS */}
          <View style={styles.reviewHeaderRow}>
            <Text style={styles.sectionHeading}>
              Student Reviews ({hostel.reviewCount})
            </Text>
            <View style={styles.totalRatingBadge}>
              <Ionicons name="star" size={14} color="#FFF" />
              <Text style={styles.totalRatingText}>{hostel.rating}</Text>
            </View>
          </View>

          <View style={styles.reviewGrid}>
            <View style={styles.reviewScoreCard}>
              <Ionicons name="water-outline" size={20} color="#00BFFF" />
              <Text style={styles.scoreMetricLabel}>Water Flow</Text>
              <Text style={styles.scoreMetricValue}>
                {hostel.reviewBreakdown.water} / 5.0
              </Text>
            </View>

            <View style={styles.reviewScoreCard}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color="#16A34A"
              />
              <Text style={styles.scoreMetricLabel}>Security</Text>
              <Text style={styles.scoreMetricValue}>
                {hostel.reviewBreakdown.security} / 5.0
              </Text>
            </View>

            <View style={styles.reviewScoreCard}>
              <Ionicons name="flash-outline" size={20} color="#D97706" />
              <Text style={styles.scoreMetricLabel}>Electricity</Text>
              <Text style={styles.scoreMetricValue}>
                {hostel.reviewBreakdown.electricity} / 5.0
              </Text>
            </View>

            <View style={styles.reviewScoreCard}>
              <Ionicons name="happy-outline" size={20} color="#6B7280" />
              <Text style={styles.scoreMetricLabel}>Management</Text>
              <Text style={styles.scoreMetricValue}>
                {hostel.reviewBreakdown.friendliness} / 5.0
              </Text>
            </View>
          </View>

          <View style={styles.managerCard}>
            <Ionicons name="person-circle-outline" size={40} color="#718096" />
            <View>
              <Text style={styles.managerTitle}>Managed by</Text>
              <Text style={styles.managerName}>{hostel.managerName}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Footer */}
      {/* 🌟 FIXING THE BUTTON TEXTS TO MATCH THE SUBSCRIPTION LEAD MODEL */}
      <View style={styles.actionFooter}>
        {hostel.isSubscribed ? (
          <>
            {/* Old 'Ask a Question' converted to instant WhatsApp Lead */}
            <TouchableOpacity
              style={[
                styles.internalChatButton,
                { backgroundColor: "#25D366", borderColor: "#25D366" },
              ]}
              onPress={handleWhatsAppChat}
            >
              <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
              <Text
                style={[
                  styles.internalChatText,
                  { color: "#FFFFFF", marginLeft: 8 },
                ]}
              >
                WhatsApp
              </Text>
            </TouchableOpacity>

            {/* Old 'Book a Room' converted to instant Voice Call Lead */}
            <TouchableOpacity
              style={styles.bookNowButton}
              onPress={handleDirectCall}
            >
              <Ionicons
                name="call"
                size={18}
                color="#FFFFFF"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.bookNowText}>Call Manager</Text>
            </TouchableOpacity>
          </>
        ) : (
          /* Lock screen displayed to students if the manager's subscription lapses */
          <TouchableOpacity
            style={[
              styles.bookNowButton,
              { backgroundColor: "#718096", width: "100%", marginLeft: 0 },
            ]}
            onPress={() =>
              Alert.alert(
                "Listing Inactive",
                "The manager must renew their semester subscription plan to unlock contact links.",
              )
            }
          >
            <Ionicons
              name="lock-closed"
              size={18}
              color="#FFFFFF"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.bookNowText}>
              Listing Inactive — Contact Locked
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Fullscreen Image Viewer */}
      <Modal visible={showImageViewer} transparent={true} animationType="fade">
        <View style={styles.fullscreenContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width,
              );
              setActiveImageIndex(index);
            }}
          >
            {hostel.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.fullscreenImage}
                resizeMode="contain"
              />
            ))}
          </ScrollView>

          {/* Close Button */}
          <TouchableOpacity
            style={styles.fullscreenClose}
            onPress={() => setShowImageViewer(false)}
          >
            <Ionicons name="close" size={28} color="#FFF" />
          </TouchableOpacity>

          {/* Fullscreen Counter */}
          <View style={styles.fullscreenCounter}>
            <Text style={styles.fullscreenCounterText}>
              {activeImageIndex + 1}/{hostel.images.length}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 110, // Gives breathing room above the fixed footer
  },
  imageContainer: {
    position: "relative",
    height: 280,
    width: width,
  },
  mainHeroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  // Append these items smoothly onto your details screen stylesheet object:
  roomListContainer: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  roomTypeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  roomTypeName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A365D",
  },
  roomTypePrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#00BFFF",
    marginTop: 2,
  },
  availabilityPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  availabilityPillText: {
    fontSize: 12,
    fontWeight: "700",
  },
  videoTourCard: {
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  videoThumbnail: {
    width: "100%",
    height: "100%",
  },
  videoOverlayShadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(26, 54, 93, 0.4)", // Thematic blueprint blue tint overlay
  },
  playButtonCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
    elevation: 4,
  },
  videoTourText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
    marginTop: 10,
    zIndex: 5,
  },
  reviewHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  totalRatingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A365D",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  totalRatingText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
    marginLeft: 4,
  },
  reviewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  reviewScoreCard: {
    width: (width - 52) / 2, // Scales split items clean across displays
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
  },
  scoreMetricLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2D3748",
    marginTop: 8,
  },
  scoreMetricValue: {
    fontSize: 12,
    color: "#718096",
    fontWeight: "700",
    marginTop: 2,
  },

  topBar: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
  },
  topBarRight: {
    flexDirection: "row",
    alignItems: "center",
    // Added margin constraints for complete native engine safety support
    marginRight: -4,
  },
  imageCounter: {
    position: "absolute",
    bottom: 20,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  imageCounterText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 5,
  },
  paginationContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.4)",
    marginHorizontal: 3,
  },
  paginationDotActive: {
    backgroundColor: "#FFFFFF",
    width: 22,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  fullscreenImage: {
    width: width,
    height: "100%",
  },
  fullscreenClose: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 30,
    right: 20,
    zIndex: 100,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenCounter: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  fullscreenCounterText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
  circularButton: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    marginHorizontal: 6, // Prevents gap-clipping crashes on layout rendering
  },
  infoWrapper: {
    padding: 20,
  },
  titlePriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  imageSlide: {
    width: width,
    height: 280,
  },
  hostelTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A365D",
    flex: 1,
    paddingRight: 8,
  },
  priceContainer: {
    alignItems: "flex-end",
    minWidth: 100,
  },
  priceText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#00BFFF",
  },
  priceUnit: {
    fontSize: 12,
    color: "#718096",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  locationText: {
    fontSize: 14,
    color: "#4A5568",
    fontWeight: "500",
    marginLeft: 4,
  },
  distanceBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF8FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  distanceText: {
    color: "#2B6CB0",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    // REMOVED: Crash causing 'verticalMargin' property to protect layout engine compilation
    marginVertical: 20,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A365D",
    marginBottom: 12,
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    width: (width - 52) / 2, // Perfect 2 column grid split configuration
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  amenityLabel: {
    fontSize: 13,
    color: "#4A5568",
    fontWeight: "500",
    marginLeft: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: "#4A5568",
    lineHeight: 22,
  },
  managerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  managerTitle: {
    fontSize: 12,
    color: "#718096",
  },
  managerName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A365D",
    marginLeft: 12,
  },
  actionFooter: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,

    flexDirection: "row",
    alignItems: "center",

    zIndex: 100,

    elevation: 10,
  },
  internalChatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: 50,
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  internalChatText: {
    fontSize: 15,
    fontWeight: "600",
  },
  bookNowButton: {
    flex: 1.3,
    height: 50,
    backgroundColor: "#00BFFF",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#00BFFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  bookNowText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
