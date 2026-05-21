import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList, Image,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function HostelRedesign() {
  const [activeFilter, setActiveFilter] = useState('all');

  const hostelsData = [
  {
    id: '1',
    name: 'Pentagon (Ghana Hostels)',
    type: 'hostel',
    price: 6663, // Real price for 4-in-a-room (New Pent)
    priceUnit: 'per year',
    location: 'UG, North Legon',
    distance: '2 min walk',
    rating: 4.2,
    reviewCount: 450,
    amenities: ['WiFi', 'Kitchenette', 'Elevator', 'Basketball Court', 'Cafeteria'],
    images: ['https://unsplash.com'],
    available: true,
    availableRooms: 15,
    gender: 'mixed',
    description: 'Premier student residence on the Legon campus. Features high-level security and vibrant student life.',
    landlord: { name: 'Ghana Hostels Ltd', phone: '+233 30 251 2345', email: 'info@ghanahostels.com' },
  },
  {
    id: '2',
    name: 'Victory Towers',
    type: 'hostel',
    price: 9500, // Starting price for 4-in-a-room
    priceUnit: 'per year',
    location: 'KNUST, Ayeduase Gate',
    distance: '1 min walk',
    rating: 4.9,
    reviewCount: 310,
    amenities: ['Air Conditioning', 'Gym', 'WiFi', 'Laundry', 'Private Washrooms'],
    images: ['https://unsplash.com'],
    available: true,
    availableRooms: 4,
    gender: 'mixed',
    description: 'One of the most luxurious and modern hostels at KNUST. Located right at the Ayeduase gate.',
    landlord: { name: 'Victory Management', phone: '+233 54 169 5839', email: 'victorytowers@hostel.gh' },
  },
  {
    id: '3',
    name: 'GetFund Hostel (UENR)',
    type: 'hostel',
    price: 2300, 
    priceUnit: 'per year',
    location: 'UENR Main Campus, Sunyani',
    distance: '1 min walk',
    rating: 3.9,
    reviewCount: 287,
    amenities: ['24/7 Security', 'Study Room', 'Spacious Compound', 'Wardrobes'],
    images: ['https://unsplash.com'],
    available: true,
    availableRooms: 20,
    gender: 'mixed',
    description: 'The standard and most reliable accommodation on the UENR Sunyani campus.',
    landlord: { name: 'UENR Housing Office', phone: '+233 24 567 8901', email: 'housing@uenr.edu.gh' },
  },
  {
    id: '4',
    name: 'Georgia Hostel',
    type: 'hostel',
    price: 6500, 
    priceUnit: 'per year',
    location: 'KNUST, Kumasi',
    distance: '10 min walk',
    rating: 4.0,
    reviewCount: 156,
    amenities: ['WiFi', 'Kitchen', 'Security', 'Study Areas'],
    images: ['https://unsplash.com'],
    available: true,
    availableRooms: 39,
    gender: 'mixed',
    description: 'Popular choice for KNUST students looking for a balance between price and quality.',
    landlord: { name: 'Georgia Management', phone: '+233 50 123 4567', email: 'georgia@hostel.gh' },
  }
];


  const renderHostel = ({ item }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.95}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.images[0] }} style={styles.image} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.imageGradient}
        />
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>₵{item.price}</Text>
          <Text style={styles.priceSub}>/sem</Text>
        </View>
        <View style={[styles.genderTag, { backgroundColor: item.gender === 'female' ? '#FF69B4' : '#00BFFF' }]}>
          <Text style={styles.tagText}>{item.gender.toUpperCase()}</Text>
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.hostelName}>{item.name}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#FFB800" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>

        <Text style={styles.locationText}>
          <Ionicons name="location" size={14} color="#666" /> {item.location}
        </Text>

        <View style={styles.amenitiesRow}>
          {item.amenities.slice(0, 3).map((amenity, index) => (
            <View key={index} style={styles.amenityChip}>
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
          {item.amenities.length > 3 && (
            <Text style={styles.moreText}>+{item.amenities.length - 3} more</Text>
          )}
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.detailsBtn}>
            <Text style={styles.detailsBtnText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatBtn}>
            <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Modern Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Find your next</Text>
          <Text style={styles.titleText}>Campus Home</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput placeholder="Search hostels, areas..." style={styles.searchInput} />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Horizontal Filters */}
      <View style={{ height: 50 }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['All', 'Hostel', 'Apartment', 'Female Only', 'Mixed']}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => setActiveFilter(item.toLowerCase())}
              style={[styles.filterChip, activeFilter === item.toLowerCase() && styles.filterChipActive]}
            >
              <Text style={[styles.filterLabel, activeFilter === item.toLowerCase() && styles.filterLabelActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={hostelsData}
        renderItem={renderHostel}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  welcomeText: { fontSize: 16, color: '#666' },
  titleText: { fontSize: 28, fontWeight: '800', color: '#1A1A1A' },
  notifBtn: { backgroundColor: '#fff', padding: 10, borderRadius: 12, elevation: 2 },
  searchSection: { flexDirection: 'row', paddingHorizontal: 20, marginVertical: 15, gap: 10 },
  searchBar: { flex: 1, flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center', paddingHorizontal: 15, borderRadius: 15, elevation: 2 },
  searchInput: { flex: 1, paddingVertical: 12, marginLeft: 10, fontSize: 16 },
  filterBtn: { backgroundColor: '#00BFFF', padding: 12, borderRadius: 15, justifyContent: 'center' },
  filterChip: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', marginRight: 10, height: 35, justifyContent: 'center', borderWidth: 1, borderColor: '#EEE' },
  filterChipActive: { backgroundColor: '#00BFFF', borderColor: '#00BFFF' },
  filterLabel: { color: '#666', fontWeight: '600' },
  filterLabelActive: { color: '#fff' },
  card: { backgroundColor: '#fff', borderRadius: 20, marginBottom: 25, overflow: 'hidden', elevation: 4 },
  imageContainer: { height: 200, width: '100%' },
  image: { width: '100%', height: '100%' },
  imageGradient: { ...StyleSheet.absoluteFillObject },
  priceTag: { position: 'absolute', bottom: 15, left: 15, flexDirection: 'row', alignItems: 'baseline' },
  priceText: { color: '#fff', fontSize: 22, fontWeight: '800' },
  priceSub: { color: '#fff', fontSize: 14, opacity: 0.8 },
  genderTag: { position: 'absolute', top: 15, right: 15, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  tagText: { color: '#fff', fontWeight: '800', fontSize: 10 },
  infoContainer: { padding: 15 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hostelName: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontWeight: '600', color: '#1A1A1A' },
  locationText: { color: '#666', marginVertical: 8, fontSize: 13 },
  amenitiesRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 5 },
  amenityChip: { backgroundColor: '#F0F2F5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  amenityText: { fontSize: 11, color: '#555', fontWeight: '500' },
  moreText: { fontSize: 11, color: '#00BFFF', fontWeight: '600' },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 15 },
  detailsBtn: { flex: 1, backgroundColor: '#F0F9FF', paddingVertical: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#00BFFF' },
  detailsBtnText: { color: '#00BFFF', fontWeight: '700' },
  chatBtn: { backgroundColor: '#00BFFF', paddingHorizontal: 15, borderRadius: 12, justifyContent: 'center' }
});
