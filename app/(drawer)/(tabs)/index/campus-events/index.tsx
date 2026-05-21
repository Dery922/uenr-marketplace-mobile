import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; // ✅ Fixed missing layout import
import React, { useCallback, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Type definitions
type Category = {
  id: string;
  name: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

type PriorityEvent = {
  id: string;
  title: string;
  category: string;
  timeLeft: string;
  banner: string;
  ctaText: string;
  priority: 'high' | 'urgent' | 'normal';
};

type CampusEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  attendees?: number;
  isSaved?: boolean;
};

const CATEGORIES: Category[] = [
  { id: 'all', name: 'All', icon: 'view-dashboard' },
  { id: 'elections', name: 'Elections', icon: 'vote' },
  { id: 'clubs', name: 'Clubs', icon: 'account-group' },
  { id: 'sports', name: 'Sports', icon: 'soccer' },
  { id: 'academic', name: 'Academic', icon: 'school' },
];

const HIGH_PRIORITY_EVENTS: PriorityEvent[] = [
  {
    id: 'e1',
    title: 'Student Council Presidential Elections 2026',
    category: 'Elections',
    timeLeft: '4h 20m remaining',
    banner: 'https://unsplash.com', // ✅ Upgraded to direct crisp Unsplash file CDNs
    ctaText: 'Cast Your Ballot',
    priority: 'urgent',
  },
  {
    id: 'e2',
    title: 'Annual Cultural Fest 2026',
    category: 'Clubs',
    timeLeft: '2d 5h remaining',
    banner: 'https://unsplash.com',
    ctaText: 'Register Now',
    priority: 'high',
  },
];

const CAMPUS_EVENTS: CampusEvent[] = [
  {
    id: '1',
    title: 'Annual Tech & Engineering Career Fair',
    date: 'May 18',
    time: '10:00 AM',
    location: 'Central Engineering Block',
    category: 'Academic',
    icon: 'briefcase-outline',
    attendees: 234,
    isSaved: false,
  },
  {
    id: '2',
    title: 'Inter-Hostel Football Finals',
    date: 'May 22',
    time: '4:00 PM',
    location: 'Main Sports Stadium',
    category: 'Sports',
    icon: 'soccer',
    attendees: 567,
    isSaved: true,
  },
];

export default function CampusEventsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [savedEvents, setSavedEvents] = useState<Set<string>>(new Set(['2']));
  const insets = useSafeAreaInsets();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  }, []);

  const filteredEvents = CAMPUS_EVENTS.filter(event => 
    selectedCategory === 'all' || event.category.toLowerCase() === selectedCategory
  );

  const toggleSaveEvent = (eventId: string) => {
    setSavedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const renderCategoryPill = ({ item }: { item: Category }) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.pill, 
        selectedCategory === item.id ? styles.activePill : styles.inactivePill
      ]}
      onPress={() => setSelectedCategory(item.id)}
      activeOpacity={0.8}
    >
      <MaterialCommunityIcons
        name={item.icon}
        size={16}
        color={selectedCategory === item.id ? '#FFFFFF' : '#00BFFF'} // ✅ Uniform brand tint
        style={styles.pillIcon}
      />
      <Text style={[
        styles.pillText, 
        selectedCategory === item.id ? styles.activePillText : styles.inactivePillText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderPriorityEvent = ({ item }: { item: PriorityEvent }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => console.log('Priority event pressed:', item.id)}
      style={styles.featuredCardWrapper}
    >
      <ImageBackground
        source={{ uri: item.banner }}
        style={styles.featuredCard}
        imageStyle={styles.featuredCardImage}
      >
        <LinearGradient
          colors={['transparent', 'rgba(15, 23, 42, 0.95)']} // ✅ Premium deep overlay color contrast
          style={styles.gradientOverlay}
        >
          <View style={styles.featuredContent}>
            <View style={[
              styles.priorityBadge,
              item.priority === 'urgent' ? styles.urgentBadge : styles.highBadge
            ]}>
              <MaterialCommunityIcons 
                name={item.priority === 'urgent' ? 'flash' : 'calendar-clock'} 
                size={12} 
                color="#FFFFFF" 
              />
              <Text style={styles.badgeText}>
                {item.priority === 'urgent' ? 'URGENT' : 'LIVE'}
              </Text>
            </View>
            <Text style={styles.featuredTitle}>{item.title}</Text>
            
            <View style={styles.featuredFooter}>
              <View style={styles.timeContainer}>
                <MaterialCommunityIcons name="clock-outline" size={14} color="#CBD5E1" />
                <Text style={styles.timerText}> {item.timeLeft}</Text>
              </View>
              <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8}>
                <Text style={styles.ctaText}>{item.ctaText}</Text>
                <MaterialCommunityIcons name="arrow-right" size={14} color="#00BFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderEventItem = ({ item }: { item: CampusEvent }) => (
    <TouchableOpacity
      style={styles.eventCard}
      activeOpacity={0.7}
      onPress={() => console.log('Event pressed:', item.id)}
    >
      <View style={styles.eventIconContainer}>
        <MaterialCommunityIcons name={item.icon} size={24} color="#00BFFF" />
      </View>
      <View style={styles.eventDetails}>
        <Text style={styles.eventDate}>
          {item.date.toUpperCase()} • {item.time}
        </Text>
        <Text style={styles.eventTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.eventLocation}>
          <MaterialCommunityIcons name="map-marker-outline" size={12} color="#64748B" />
          <Text style={styles.eventLocationText} numberOfLines={1}>
            {item.location}
          </Text>
        </View>
        {item.attendees && (
          <View style={styles.attendeesContainer}>
            <MaterialCommunityIcons name="account-group" size={12} color="#94A3B8" />
            <Text style={styles.attendeesText}>{item.attendees} attending</Text>
          </View>
        )}
      </View>
      <View style={styles.eventActions}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => toggleSaveEvent(item.id)}
        >
          <MaterialCommunityIcons
            name={savedEvents.has(item.id) ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={savedEvents.has(item.id) ? '#00BFFF' : '#94A3B8'}
          />
        </TouchableOpacity>
        <MaterialCommunityIcons name="chevron-right" size={20} color="#CBD5E1" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* List Header Wrapper Layout */}
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderEventItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00BFFF" />
        }
        ListHeaderComponent={
          <>
            {/* Header Title Section */}
            <View style={styles.header}>
              <View>
                <Text style={styles.headerSubtitle}>Discover What's Next</Text>
                <Text style={styles.headerTitle}>Campus Hub</Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.iconButton}>
                  <MaterialCommunityIcons name="magnify" size={22} color="#1E293B" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <MaterialCommunityIcons name="bell-badge-outline" size={22} color="#1E293B" />
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>3</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Horizontal Priorities Grid */}
            <Text style={styles.sectionTitle}>Featured Announcements</Text>
            <FlatList
              data={HIGH_PRIORITY_EVENTS}
              keyExtractor={(item) => item.id}
              renderItem={renderPriorityEvent}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredListContent}
              snapToInterval={width * 0.85 + 16}
              decelerationRate="fast"
            />

            {/* Filter Pills Swiper Container */}
            <Text style={styles.sectionTitle}>Explore Categories</Text>
            <FlatList
              data={CATEGORIES}
              keyExtractor={(item) => item.id}
              renderItem={renderCategoryPill}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContent}
            />
            
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="calendar-blank" size={48} color="#94A3B8" />
            <Text style={styles.emptyText}>No events found in this category</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  listContainer: {
    paddingBottom: 110, // Gives clean space above your floating tab bar layer layout
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    marginBottom: 20,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1E293B",
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#F8FAFC",
  },
  notificationBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginHorizontal: 20,
    marginBottom: 12,
    marginTop: 8,
  },
  featuredListContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  featuredCardWrapper: {
    marginRight: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  featuredCard: {
    width: width * 0.85,
    height: 180,
    borderRadius: 24,
    overflow: "hidden",
  },
  featuredCardImage: {
    borderRadius: 24,
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 16,
  },
  featuredContent: {
    gap: 6,
  },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  urgentBadge: {
    backgroundColor: "#EF4444",
  },
  highBadge: {
    backgroundColor: "#00BFFF",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 24,
  },
  featuredFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timerText: {
    color: "#E2E8F0",
    fontSize: 12,
    fontWeight: "500",
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  ctaText: {
    color: "#1E293B",
    fontSize: 12,
    fontWeight: "700",
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    marginRight: 10,
    gap: 6,
  },
  inactivePill: {
    backgroundColor: "rgba(0, 191, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(0, 191, 255, 0.1)",
  },
  activePill: {
    backgroundColor: "#00BFFF",
    borderWidth: 1,
    borderColor: "#00BFFF",
  },
  pillIcon: {},
  pillText: {
    fontSize: 13,
    fontWeight: "600",
  },
  inactivePillText: {
    color: "#1E3A8A",
  },
  activePillText: {
    color: "#FFFFFF",
  },
  eventCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 14,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.08)",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  eventIconContainer: {
    backgroundColor: "rgba(0, 191, 255, 0.08)",
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  eventDetails: {
    flex: 1,
    marginLeft: 14,
    gap: 2,
  },
  eventDate: {
    fontSize: 10,
    fontWeight: "700",
    color: "#00BFFF",
    letterSpacing: 0.5,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  eventLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  eventLocationText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
    width: "90%",
  },
  attendeesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  attendeesText: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "600",
  },
  eventActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  saveButton: {
    padding: 6,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "500",
  },
});
