// components/CampusEvents.js
import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

// Mock data - replace with your API data
const MOCK_EVENTS = [
  {
    id: '1',
    title: 'Tech Innovation Summit',
    description: 'Annual tech showcase featuring student innovations and keynote speakers from leading tech companies.',
    location: 'Main Auditorium',
    date: new Date(),
    startTime: '14:00',
    endTime: '18:00',
    category: 'Academic',
    attendees: 124,
    maxAttendees: 200,
    image: null,
    isToday: true,
    isFree: true,
    organizer: 'Engineering Faculty',
  },
  {
    id: '2',
    title: 'Inter-Faculty Football Match',
    description: 'Engineering vs Business School - Annual rivalry match.',
    location: 'Sports Complex',
    date: new Date(Date.now() + 86400000), // tomorrow
    startTime: '16:00',
    endTime: '18:30',
    category: 'Sports',
    attendees: 87,
    maxAttendees: 500,
    image: null,
    isToday: false,
    isFree: true,
    organizer: 'Sports Directorate',
  },
  {
    id: '3',
    title: 'Hackathon 2024',
    description: '48-hour coding competition with prizes for top 3 teams.',
    location: 'Engineering Lab',
    date: new Date(Date.now() + 3 * 86400000),
    startTime: '09:00',
    endTime: '17:00',
    category: 'Tech',
    attendees: 56,
    maxAttendees: 100,
    image: null,
    isFree: true,
    organizer: 'Tech Hub',
  },
  {
    id: '4',
    title: 'Career Fair 2024',
    description: 'Meet recruiters from top companies. Bring your CV!',
    location: 'University Conference Hall',
    date: new Date(Date.now() + 5 * 86400000),
    startTime: '10:00',
    endTime: '16:00',
    category: 'Career',
    attendees: 203,
    maxAttendees: 300,
    image: null,
    isFree: true,
    organizer: 'Career Services',
  },
];

const CampusEvents = ({ events = MOCK_EVENTS, onViewAll, onEventPress }) => {
  const [joinedEvents, setJoinedEvents] = useState({});
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Filter upcoming events (today and future)
  const upcomingEvents = events
    .filter(event => event.date >= new Date())
    .sort((a, b) => a.date - b.date)
    .slice(0, 3);

  const handleJoinEvent = (eventId) => {
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
    ]).start(() => {
      setJoinedEvents(prev => ({
        ...prev,
        [eventId]: !prev[eventId],
      }));
    });
  };

  const formatEventDate = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Academic: '#00BFFF',
      Sports: '#38A169',
      Tech: '#D53F8C',
      Career: '#ED8936',
      Social: '#9F7AEA',
      Workshop: '#F6AD55',
    };
    return colors[category] || '#00BFFF';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Academic: 'school-outline',
      Sports: 'football-outline',
      Tech: 'code-outline',
      Career: 'briefcase-outline',
      Social: 'people-outline',
      Workshop: 'construct-outline',
    };
    return icons[category] || 'calendar-outline';
  };

  const renderEventCard = ({ item, index }) => {
    const isJoined = joinedEvents[item.id];
    const categoryColor = getCategoryColor(item.category);
    const progress = (item.attendees / item.maxAttendees) * 100;
    
    return (
      <Animated.View
        style={[
          styles.eventCard,
          {
            transform: [{ scale: scaleAnim }],
            opacity: scaleAnim.interpolate({
              inputRange: [0.95, 1],
              outputRange: [0.7, 1],
            }),
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onEventPress?.(item)}
          style={styles.eventCardInner}
        >
          {/* Category Badge */}
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '15' }]}>
            <Ionicons name={getCategoryIcon(item.category)} size={14} color={categoryColor} />
            <Text style={[styles.categoryText, { color: categoryColor }]}>
              {item.category}
            </Text>
          </View>

          {/* Event Title */}
          <Text style={styles.eventTitle} numberOfLines={1}>
            {item.title}
          </Text>

          {/* Location */}
          <View style={styles.eventDetailRow}>
            <Ionicons name="location-outline" size={16} color="#718096" />
            <Text style={styles.eventDetailText} numberOfLines={1}>
              {item.location}
            </Text>
          </View>

          {/* Date & Time */}
          <View style={styles.eventRow}>
            <View style={styles.eventDetailRow}>
              <Ionicons name="calendar-outline" size={16} color="#718096" />
              <Text style={styles.eventDetailText}>
                {formatEventDate(item.date)} • {item.startTime}
              </Text>
            </View>
          </View>

          {/* Attendees with Progress Bar */}
          <View style={styles.attendeesContainer}>
            <View style={styles.attendeesRow}>
              <View style={styles.attendeesIconContainer}>
                <Ionicons name="people-outline" size={14} color="#00BFFF" />
                <Text style={styles.attendeesText}>
                  {item.attendees} attending
                </Text>
              </View>
              <Text style={styles.spotsLeftText}>
                {item.maxAttendees - item.attendees} spots left
              </Text>
            </View>
            
            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${progress}%`, backgroundColor: categoryColor }
                ]} 
              />
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[
              styles.joinButton,
              isJoined && styles.joinedButton,
              { borderColor: categoryColor }
            ]}
            onPress={() => handleJoinEvent(item.id)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isJoined ? 'checkmark-circle' : 'add-circle-outline'}
              size={18}
              color={isJoined ? '#38A169' : categoryColor}
            />
            <Text
              style={[
                styles.joinButtonText,
                isJoined && styles.joinedButtonText,
                { color: isJoined ? '#38A169' : categoryColor }
              ]}
            >
              {isJoined ? 'Joined' : 'Join Event'}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (upcomingEvents.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="calendar-outline" size={48} color="#CBD5E0" />
        <Text style={styles.emptyTitle}>No Upcoming Events</Text>
        <Text style={styles.emptyText}>Check back later for campus events</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIconContainer}>
            <Ionicons name="calendar" size={20} color="#00BFFF" />
          </View>
          <Text style={styles.headerTitle}>Upcoming Events</Text>
        </View>
        <TouchableOpacity onPress={onViewAll} style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="arrow-forward" size={14} color="#00BFFF" />
        </TouchableOpacity>
      </View>

      {/* Events List */}
      <FlatList
        data={upcomingEvents}
        renderItem={renderEventCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={styles.eventsList}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#00BFFF15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 13,
    color: '#00BFFF',
    fontWeight: '500',
  },
  eventsList: {
    gap: 12,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  eventCardInner: {
    padding: 16,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
    gap: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  eventTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 12,
    lineHeight: 22,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  eventDetailText: {
    fontSize: 13,
    color: '#4A5568',
    flex: 1,
  },
  attendeesContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  attendeesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  attendeesIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  attendeesText: {
    fontSize: 12,
    color: '#00BFFF',
    fontWeight: '500',
  },
  spotsLeftText: {
    fontSize: 11,
    color: '#A0AEC0',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#EDF2F7',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
  },
  joinedButton: {
    backgroundColor: '#38A16910',
    borderColor: '#38A169',
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  joinedButtonText: {
    color: '#38A169',
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#F7FAFC',
    borderRadius: 20,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 13,
    color: '#A0AEC0',
  },
});

export default CampusEvents;