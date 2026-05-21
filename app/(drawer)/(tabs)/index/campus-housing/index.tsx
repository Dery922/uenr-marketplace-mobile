import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

// Dummy data for hostels/housing
const hostelsData = [
  {
    id: "1",
    name: "Green Campus Hostel",
    type: "hostel",
    price: 350,
    priceUnit: "per semester",
    location: "Main Campus - North Wing",
    distance: "5 min walk",
    rating: 4.5,
    reviewCount: 128,
    amenities: ["WiFi", "Security", "Study Room", "Kitchen", "Laundry"],
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
    ],
    available: true,
    availableRooms: 12,
    gender: "mixed",
    description:
      "Modern hostel with all amenities, close to lecture halls and cafeteria.",
    landlord: {
      name: "Mrs. Sarah Mensah",
      phone: "+233 24 123 4567",
      email: "sarah@greencampus.com",
      rating: 4.8,
    },
  },
  {
    id: "2",
    name: "Scholars Haven",
    type: "apartment",
    price: 550,
    priceUnit: "per semester",
    location: "Main Campus - South",
    distance: "10 min walk",
    rating: 4.8,
    reviewCount: 89,
    amenities: ["WiFi", "Security", "Study Room", "Parking", "Gym", "Laundry"],
    images: [
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
    ],
    available: true,
    availableRooms: 5,
    gender: "female",
    description:
      "Premium apartments for serious students. Quiet environment with 24/7 security.",
    landlord: {
      name: "Prof. James Asare",
      phone: "+233 24 234 5678",
      email: "james@scholarshaven.com",
      rating: 4.9,
    },
  },
  {
    id: "3",
    name: "Campus View Lodge",
    type: "hostel",
    price: 280,
    priceUnit: "per semester",
    location: "Dormaa Ahenkro Campus",
    distance: "2 min walk",
    rating: 4.2,
    reviewCount: 56,
    amenities: ["WiFi", "Security", "Common Room"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d",
    ],
    available: true,
    availableRooms: 8,
    gender: "mixed",
    description:
      "Budget-friendly hostel with basic amenities. Great for students on a budget.",
    landlord: {
      name: "Mr. Kwame Boateng",
      phone: "+233 24 345 6789",
      email: "kwame@campusview.com",
      rating: 4.3,
    },
  },
  {
    id: "4",
    name: "Executive Suites",
    type: "apartment",
    price: 750,
    priceUnit: "per semester",
    location: "Main Campus - East",
    distance: "15 min walk",
    rating: 4.9,
    reviewCount: 34,
    amenities: [
      "WiFi",
      "Security",
      "Study Room",
      "Kitchen",
      "Parking",
      "Gym",
      "Laundry",
      "Air Conditioning",
    ],
    images: [
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8",
    ],
    available: false,
    availableRooms: 0,
    gender: "mixed",
    description:
      "Luxury apartments with premium facilities. Fully furnished and serviced.",
    landlord: {
      name: "Ms. Adwoa Serwaa",
      phone: "+233 24 456 7890",
      email: "adwoa@executivesuites.com",
      rating: 5.0,
    },
  },
  {
    id: "5",
    name: "Peaceful Gardens",
    type: "hostel",
    price: 320,
    priceUnit: "per semester",
    location: "Main Campus - West Wing",
    distance: "8 min walk",
    rating: 4.6,
    reviewCount: 92,
    amenities: [
      "WiFi",
      "Security",
      "Study Room",
      "Kitchen",
      "Laundry",
      "Garden Area",
    ],
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
    ],
    available: true,
    availableRooms: 15,
    gender: "mixed",
    description:
      "Serene environment with beautiful gardens. Perfect for focused studying.",
    landlord: {
      name: "Mrs. Elizabeth Owusu",
      phone: "+233 24 567 8901",
      email: "elizabeth@peacefulgardens.com",
      rating: 4.7,
    },
  },
];

const filters = [
  { id: "all", label: "All", icon: "grid" },
  { id: "hostel", label: "Hostels", icon: "business" },
  { id: "apartment", label: "Apartments", icon: "home" },
  { id: "mixed", label: "Mixed Gender", icon: "people" },
  { id: "female", label: "Female Only", icon: "female" },
  { id: "male", label: "Male Only", icon: "male" },
];

const sortOptions = [
  { id: "price_low", label: "Price: Low to High" },
  { id: "price_high", label: "Price: High to Low" },
  { id: "rating", label: "Highest Rated" },
  { id: "distance", label: "Closest First" },
];

export default function HostelsScreen() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedSort, setSelectedSort] = useState("price_low");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSortModal, setShowSortModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryText, setInquiryText] = useState("");
  const [bookingStep, setBookingStep] = useState(1);

  const [bookingDetails, setBookingDetails] = useState({
    name: "",
    studentId: "",
    phone: "",
    email: "",
    moveInDate: "",
    duration: "1 semester",
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Filter and sort hostels
  const filteredHostels = hostelsData
    .filter((hostel) => {
      if (selectedFilter === "all") return true;
      if (selectedFilter === "hostel") return hostel.type === "hostel";
      if (selectedFilter === "apartment") return hostel.type === "apartment";
      if (selectedFilter === "mixed") return hostel.gender === "mixed";
      if (selectedFilter === "female") return hostel.gender === "female";
      if (selectedFilter === "male") return hostel.gender === "male";
      return true;
    })
    .filter(
      (hostel) =>
        hostel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hostel.location.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      if (selectedSort === "price_low") return a.price - b.price;
      if (selectedSort === "price_high") return b.price - a.price;
      if (selectedSort === "rating") return b.rating - a.rating;
      return 0;
    });

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Toast.show({
        type: "success",
        text1: "Refreshed",
        text2: "Latest listings loaded",
      });
    }, 1500);
  };
  const handleInquiry = (hostel) => {
    // 1. Store the hostel the student is asking about
    setSelectedHostel(hostel);

    // 2. Clear any old text from the previous time the modal was opened
    setInquiryText("");

    // 3. Open the Modal
    setShowInquiryModal(true);
  };

  const handleBookNow = (hostel) => {
    setSelectedHostel(hostel);
    setBookingStep(1);
    setShowBookingModal(true);
  };

  const handleSendInquiry = async () => {
    if (!inquiryText.trim()) {
      Alert.alert("Empty Message", "Please type a question before sending.");
      return;
    }

    // Optional: Add a loading state here if you have one
    try {
      // 1. Logic to send to your Render/MongoDB backend
      const inquiryData = {
        hostelId: selectedHostel.id,
        hostelName: selectedHostel.name,
        message: inquiryText,
        timestamp: new Date().toISOString(),
        studentId: "current_user_id", // Replace with your actual auth user ID
      };

      console.log("Sending Inquiry:", inquiryData);

      // 2. Clear text and close modal
      setInquiryText("");
      setShowInquiryModal(false);

      // 3. Give student feedback
      Alert.alert(
        "Message Sent",
        `Your inquiry has been sent to ${selectedHostel.name} management. Check your inbox for their reply!`,
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to send message. Please check your connection.",
      );
    }
  };

  const handleBookingSubmit = () => {
    if (!selectedHostel) {
      Toast.show({
        type: "error",
        text1: "Booking failed",
        text2: "Please select a hostel and try again.",
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Booking Request Sent!",
      text2: `You'll hear from ${selectedHostel.landlord.name} within 24 hours`,
    });
    setShowBookingModal(false);
    setBookingDetails({
      name: "",
      studentId: "",
      phone: "",
      email: "",
      moveInDate: "",
      duration: "1 semester",
    });
  };

  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={14}
          color="#FFB800"
        />,
      );
    }
    return stars;
  };

  const renderHostelCard = ({ item }) => {
    const isFullyBooked = !item.available;
    const isLimited = item.available && item.availableRooms <= 5;

    return (
      <TouchableOpacity
        style={styles.hostelCard}
        activeOpacity={0.95}
        onPress={() => router.push(`/hostel/${item.id}`)}
      >
        {/* Top Section: Image & Badges */}
        <View style={styles.imageWrapper}>
          {/* Replace your single Image with this inside the hostelCard */}
          <View style={styles.imageWrapper}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
            >
              {item.images.map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: img }}
                  style={styles.hostelImage} // width should be Dimensions.get('window').width - 40
                />
              ))}
            </ScrollView>

            {/* Image Count Indicator */}
            <View style={styles.imageCountBadge}>
              <Ionicons name="images" size={12} color="#FFF" />
              <Text style={styles.imageCountText}>{item.images.length}</Text>
            </View>
          </View>

          {/* Urgent Badges */}
          {isFullyBooked && (
            <View style={[styles.statusBadge, { backgroundColor: "#EF4444" }]}>
              <Text style={styles.badgeText}>Fully Booked</Text>
            </View>
          )}
          {isLimited && (
            <View style={[styles.statusBadge, { backgroundColor: "#F59E0B" }]}>
              <Ionicons name="flash" size={12} color="#FFF" />
              <Text style={styles.badgeText}>
                Only {item.availableRooms} beds left!
              </Text>
            </View>
          )}

          {/* Price Tag Overlay - Clean and high-visibility */}
          <View style={styles.priceOverlay}>
            <Text style={styles.priceText}>GH₵{item.price}</Text>
            <Text style={styles.priceUnitText}>/{item.priceUnit}</Text>
          </View>
        </View>

        {/* Bottom Section: Content */}
        <View style={styles.hostelInfo}>
          <View style={styles.cardHeader}>
            <Text style={styles.hostelName} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.ratingBox}>
              <Ionicons name="star" size={12} color="#F6AD55" />
              <Text style={styles.ratingScore}>{item.rating}</Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color="#00BFFF" />
            <Text style={styles.locationText} numberOfLines={1}>
              {item.location} •{" "}
              <Text style={styles.distanceText}>
                {item.distance} from campus
              </Text>
            </Text>
          </View>

          {/* Amenities - Limited to 3 to keep UI clean */}
          <View style={styles.amenitiesRow}>
            {item.amenities.slice(0, 3).map((amenity, index) => (
              <View key={index} style={styles.amenityPill}>
                <Text style={styles.amenityPillText}>{amenity}</Text>
              </View>
            ))}
          </View>

          {/* Action Buttons: Split Layout */}
          {/* <View style={styles.cardActions}>
          <TouchableOpacity 
            style={styles.secondaryAction}
            onPress={() => handleInquiry(item)} // Our internal message system
          >
            <Ionicons name="chatbubble-ellipses-outline" size={18} color="#1A365D" />
            <Text style={styles.secondaryActionText}>Ask</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryAction, isFullyBooked && styles.disabledAction]}
            onPress={() => handleBookNow(item)}
            disabled={isFullyBooked}
          >
            <Text style={styles.primaryActionText}>
              {isFullyBooked ? 'Full' : 'Book Now'}
            </Text>
            {!isFullyBooked && <Ionicons name="arrow-forward" size={16} color="#FFF" />}
          </TouchableOpacity>
        </View> */}
          {/* Replace the previous dual action buttons on your hostel card with this clean layout */}
          <View style={styles.cardActionsMinimal}>
            <TouchableOpacity
              style={styles.minimalAskButton}
              onPress={() => handleInquiry(item)}
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={18}
                color="#FFFFFF"
              />
              <Text style={styles.minimalAskButtonText}>
                Check Availability
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.replace("/(drawer)/(tabs)/home")}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Campus Housing</Text>
          <TouchableOpacity style={styles.favButton}>
            <Ionicons name="heart-outline" size={24} color="#1A365D" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#718096" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by hostel name or location..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#A0AEC0"
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#718096" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                selectedFilter === filter.id && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Ionicons
                name={filter.icon}
                size={16}
                color={selectedFilter === filter.id ? "#FFFFFF" : "#4A5568"}
              />
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === filter.id && styles.filterChipTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Sort & Results */}
        <View style={styles.sortContainer}>
          <Text style={styles.resultsCount}>
            {filteredHostels.length} properties found
          </Text>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setShowSortModal(true)}
          >
            <Ionicons name="options-outline" size={18} color="#1E3A8A" />
            <Text style={styles.sortButtonText}>Sort</Text>
          </TouchableOpacity>
        </View>

        {/* Hostels List */}
        <FlatList
          data={filteredHostels}
          renderItem={renderHostelCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#00BFFF"]}
              tintColor="#00BFFF"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="home-outline" size={64} color="#CBD5E0" />
              <Text style={styles.emptyTitle}>No properties found</Text>
              <Text style={styles.emptyText}>
                Try adjusting your filters or search query
              </Text>
            </View>
          }
        />

        {/* Sort Modal */}
        <Modal
          visible={showSortModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSortModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowSortModal(false)}
          >
            <View style={styles.sortModal}>
              <Text style={styles.sortModalTitle}>Sort by</Text>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.sortOption}
                  onPress={() => {
                    setSelectedSort(option.id);
                    setShowSortModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.sortOptionText,
                      selectedSort === option.id && styles.sortOptionTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {selectedSort === option.id && (
                    <Ionicons name="checkmark" size={20} color="#00BFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Inquiry Modal */}
        <Modal
          visible={showInquiryModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowInquiryModal(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalOverlay}
          >
            <View style={styles.inquiryModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Inquire about {selectedHostel?.name}</Text>
                <TouchableOpacity onPress={() => setShowInquiryModal(false)}>
                  <Ionicons name="close" size={24} color="#1A365D" />
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                <View style={styles.landlordQuickCard}>
                  <Ionicons name="person-circle" size={44} color="#1A365D" />
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.landlordName}>{selectedHostel?.landlord.name}</Text>
                    <Text style={styles.landlordRole}>Hostel Manager</Text>
                  </View>
                </View>

                {/* Direct Action Layer for Lead Generation */}
                <Text style={styles.inputLabel}>Connect Instantly</Text>
                <TouchableOpacity 
                  style={[styles.minimalAskButton, { backgroundColor: "#25D366", marginBottom: 12 }]}
                  onPress={() => Linking.openURL(`https://wa.me{selectedHostel?.landlord.phone.replace(/[^0-9]/g, '')}`)}
                >
                  <Ionicons name="logo-whatsapp" size={18} color="#FFF" />
                  <Text style={[styles.minimalAskButtonText, { marginLeft: 8 }]}>Chat on WhatsApp</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.minimalAskButton, { backgroundColor: "#1A365D" }]}
                  onPress={() => handleDirectCall(selectedHostel?.landlord.phone)}
                >
                  <Ionicons name="call" size={18} color="#FFF" />
                  <Text style={[styles.minimalAskButtonText, { marginLeft: 8 }]}>Place Voice Call</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaView>
      <Toast />
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#00BFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#E2E8F0",
  },
  favButton: {
    padding: 4,
  },
  imageWrapper: {
    position: "relative",
    height: 180,
    width: "100%",
  },
  statusBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    zIndex: 2,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  priceOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#00BFFF",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderTopLeftRadius: 16,
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "800",
  },
  priceUnitText: {
    color: "#fff",
    fontSize: 11,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FEF3C7",
  },
  ratingScore: {
    fontSize: 12,
    fontWeight: "700",
    color: "#D97706",
    marginLeft: 2,
  },
  amenityPill: {
    backgroundColor: "#EDF2F7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  amenityPillText: {
    fontSize: 11,
    color: "#4A5568",
    fontWeight: "600",
  },
  cardActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 5,
  },
  secondaryAction: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    height: 44,
  },
  secondaryActionText: {
    color: "#1A365D",
    fontWeight: "700",
    marginLeft: 6,
  },
  primaryAction: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00BFFF",
    borderRadius: 10,
    height: 44,
    gap: 8,
  },
  disabledAction: {
    backgroundColor: "#E2E8F0",
  },
  primaryActionText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 15,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1A202C",
  },
  filtersContainer: {
    marginBottom: 16,
    height:65,
 
  },
  filtersContent: {
    paddingHorizontal: 20,
  
    gap: 10,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
    gap: 6,
    height: 36, // Add fixed height for consistency
  },

  filterChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#4A5568",
    lineHeight: 16, // Add lineHeight for better vertical alignment
  },
  filterChipActive: {
    backgroundColor: "#00BFFF",
  },

  filterChipTextActive: {
    color: "#FFFFFF",
  },
  sortContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 14,
    color: "#718096",
    fontWeight: "500",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  sortButtonText: {
    fontSize: 13,
    color: "#1E3A8A",
    fontWeight: "500",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
hostelCard: {
  backgroundColor: "#FFFFFF",
  borderRadius: 16,
  marginBottom: 20,
  overflow: "hidden",
  width: width - 40,
  alignSelf: "center",

  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 8,
  elevation: 3,
},
  // Add these properties inside your existing StyleSheet.create({...})
  
  inquiryModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    width: '100%',
    maxHeight: '80%', // Ensures it doesn't clip off notches
    position: 'absolute',
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A365D',
    maxWidth: '85%',
  },
  landlordQuickCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  landlordName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  landlordRole: {
    fontSize: 13,
    color: '#718096',
    marginTop: 2,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // minimalAskButton: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   height: 52,
  //   borderRadius: 12,
  //   width: '100%',
  // },
  minimalAskButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dims background out completely
    justifyContent: 'end',
  },

  hostelImage: {
    width: width - 40,
    height: 180,
  },
  rentedBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#EF4444",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  rentedBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  limitedBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#FF9800",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  limitedBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  hostelInfo: {
    padding: 16,
  },
  hostelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  hostelName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A365D",
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: "#718096",
    marginLeft: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    fontSize: 13,
    color: "#718096",
    marginLeft: 4,
  },
  distanceText: {
    fontSize: 13,
    color: "#A0AEC0",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: "#00BFFF",
  },
  priceUnit: {
    fontSize: 12,
    color: "#718096",
    marginLeft: 4,
  },
  amenitiesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  amenityBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  amenityText: {
    fontSize: 11,
    color: "#4A5568",
  },
  moreAmenities: {
    fontSize: 11,
    color: "#718096",
  },
  bookButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00BFFF",
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  bookButtonDisabled: {
    backgroundColor: "#CBD5E0",
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A365D",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#718096",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  sortModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    width: "80%",
  },
  sortModalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A365D",
    marginBottom: 16,
  },
  sortOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  sortOptionText: {
    fontSize: 14,
    color: "#4A5568",
  },
  sortOptionTextActive: {
    color: "#00BFFF",
    fontWeight: "600",
  },
  bookingModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A365D",
  },
  hostelPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A365D",
    marginBottom: 4,
  },
  previewPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#00BFFF",
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A365D",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 16,
    backgroundColor: "#F8FAFC",
  },
  durationOptions: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  durationOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
  },
  durationOptionActive: {
    backgroundColor: "#00BFFF",
  },
  durationOptionText: {
    fontSize: 13,
    color: "#4A5568",
    fontWeight: "500",
  },
  durationOptionTextActive: {
    color: "#FFFFFF",
  },
  bookingSummary: {
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A365D",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#718096",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#00BFFF",
  },
  summaryNote: {
    fontSize: 11,
    color: "#A0AEC0",
    marginTop: 8,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00BFFF",
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
    marginTop: 8,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: "#38A169",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  backButtonModal: {
    alignItems: "center",
    paddingVertical: 12,
  },
  backButtonModalText: {
    color: "#718096",
    fontSize: 14,
    fontWeight: "500",
  },

  //ask manager css
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  dismissArea: {
    flex: 1,
  },
  inquirySheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 15,
  },
  imageCountBadge: {
    position: "absolute",
    bottom: 45, // Adjust based on your price overlay
    left: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  imageCountText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "700",
  },

  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1A365D",
  },
  sheetSubtitle: {
    fontSize: 14,
    color: "#718096",
  },
  closeCircle: {
    backgroundColor: "#F7FAFC",
    padding: 8,
    borderRadius: 20,
  },
  warningBox: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
    gap: 10,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: "#4A5568",
    lineHeight: 18,
  },
  inquiryInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 15,
    height: 120,
    textAlignVertical: "top",
    fontSize: 16,
    color: "#2D3748",
    marginBottom: 20,
  },
  submitInquiryBtn: {
    backgroundColor: "#1A365D",
    flexDirection: "row",
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  submitInquiryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  cardActionsMinimal: {
    marginTop: 12,
    width: "100%",
    
  },
  minimalAskButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00BFFF", // Solid corporate navy blue for trust
    borderRadius: 12,
    height: 48,
    gap: 8,
    elevation: 2,
    shadowColor: "#1A365D",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  // minimalAskButtonText: {
  //   color: "#FFFFFF",
  //   fontWeight: "700",
  //   fontSize: 15,
  // },
});
