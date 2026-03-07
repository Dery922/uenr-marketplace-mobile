// app/chat/index.tsx
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Mock chat data
const MOCK_CHATS = [
  {
    id: '1',
    name: 'Kwame Asare',
    lastMessage: 'Is the textbook still available?',
    time: '10:30 AM',
    unread: 2,
    isVerified: true,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80',
    product: 'Calculus 101 Textbook'
  },
  {
    id: '2',
    name: 'Nana Ama',
    lastMessage: 'I can meet at the library at 4 PM',
    time: 'Yesterday',
    unread: 0,
    isVerified: true,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80',
    product: 'Casio Calculator'
  },
  {
    id: '3',
    name: 'Kofi Mensah',
    lastMessage: 'Price is negotiable, let me know your offer',
    time: '2 days ago',
    unread: 0,
    isVerified: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    product: 'HP Laptop'
  },
  {
    id: '4',
    name: 'Esi Boateng',
    lastMessage: 'Thank you for the quick response!',
    time: '3 days ago',
    unread: 0,
    isVerified: true,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    product: 'Chemistry Lab Coat'
  },
  {
    id: '5',
    name: 'David Osei',
    lastMessage: 'Can you send more pictures?',
    time: '1 week ago',
    unread: 0,
    isVerified: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    product: 'JBL Speaker'
  },
  {
    id: '6',
    name: 'Akosua Agyemang',
    lastMessage: 'I\'m interested in the bag, is it genuine leather?',
    time: '1 week ago',
    unread: 1,
    isVerified: false,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
    product: 'Leather Satchel'
  },
];

export default function ChatListScreen() {
  const [chats, setChats] = useState(MOCK_CHATS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'unread', 'sellers'

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chat.product.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'unread') return matchesSearch && chat.unread > 0;
    if (activeTab === 'sellers') return matchesSearch && chat.isVerified;
    
    return matchesSearch;
  });

  const handleChatPress = (chat) => {
    router.push({
      pathname: '/chat/[id]',
      params: { 
        id: chat.id,
        name: chat.name,
        avatar: chat.avatar,
        isVerified: chat.isVerified,
        product: chat.product
      }
    });
  };

  const handleNewChat = () => {
    Alert.alert(
      'New Chat',
      'Start a new conversation with a seller',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => router.push('/chat/new') }
      ]
    );
  };

  const deleteChat = (chatId) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.chatItem}
      onPress={() => handleChatPress(item)}
      onLongPress={() => Alert.alert(
        'Options',
        'What would you like to do?',
        [
          { text: 'Delete Chat', style: 'destructive', onPress: () => deleteChat(item.id) },
          { text: 'Cancel', style: 'cancel' }
        ]
      )}
    >
      <View style={styles.chatAvatarContainer}>
        <ExpoImage 
          source={{ uri: item.avatar }} 
          style={styles.chatAvatar}
          contentFit="cover"
        />
        {item.isVerified && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" />
          </View>
        )}
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        
        <Text style={styles.chatProduct} numberOfLines={1}>
          <Ionicons name="pricetag" size={12} color="#718096" /> {item.product}
        </Text>
        
        <View style={styles.chatFooter}>
          <Text style={styles.chatMessage} numberOfLines={1}>{item.lastMessage}</Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Top Blue Section (20%) */}
      <View style={styles.topSection}>
        <View style={styles.topContent}>
          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.screenTitle}>Messages</Text>
            <Text style={styles.screenSubtitle}>Your conversations</Text>
          </View>
          
          {/* New Chat Button */}
          <TouchableOpacity 
            style={styles.newChatButton}
            onPress={handleNewChat}
          >
            <Ionicons name="create-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="rgba(255, 255, 255, 0.7)" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="rgba(255, 255, 255, 0.7)" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Bottom White Section (80%) with curved top */}
      <View style={styles.bottomSection}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'all' && styles.tabButtonActive]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
              All Chats
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'unread' && styles.tabButtonActive]}
            onPress={() => setActiveTab('unread')}
          >
            <View style={styles.tabWithBadge}>
              <Text style={[styles.tabText, activeTab === 'unread' && styles.tabTextActive]}>
                Unread
              </Text>
              {chats.filter(c => c.unread > 0).length > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>
                    {chats.filter(c => c.unread > 0).length}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'sellers' && styles.tabButtonActive]}
            onPress={() => setActiveTab('sellers')}
          >
            <Text style={[styles.tabText, activeTab === 'sellers' && styles.tabTextActive]}>
              Verified Sellers
            </Text>
          </TouchableOpacity>
        </View>

        {/* Chat List */}
        <FlatList
          data={filteredChats}
          renderItem={renderChatItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubble-ellipses-outline" size={80} color="#E2E8F0" />
              <Text style={styles.emptyTitle}>No conversations yet</Text>
              <Text style={styles.emptyText}>
                {activeTab === 'unread' 
                  ? 'No unread messages'
                  : 'Start a chat with a seller to discuss items'}
              </Text>
              <TouchableOpacity 
                style={styles.emptyButton}
                onPress={handleNewChat}
              >
                <Ionicons name="add-circle" size={20} color="#FFFFFF" />
                <Text style={styles.emptyButtonText}>Start New Chat</Text>
              </TouchableOpacity>
            </View>
          }
          ListHeaderComponent={
            filteredChats.length > 0 ? (
              <View style={styles.listHeader}>
                <Text style={styles.listHeaderText}>
                  {filteredChats.length} conversation{filteredChats.length !== 1 ? 's' : ''}
                </Text>
              </View>
            ) : null
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00BFFF',
  },
  topSection: {
    height: '25%',
    backgroundColor: '#00BFFF',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  topContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  newChatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
    marginRight: 10,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    marginTop: -20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#00BFFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
  },
  tabTextActive: {
    color: '#00BFFF',
  },
  tabWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tabBadge: {
    backgroundColor: '#FF4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  chatList: {
    paddingBottom: 20,
  },
  listHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  listHeaderText: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  chatAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  chatAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#38A169',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    flex: 1,
  },
  chatTime: {
    fontSize: 12,
    color: '#718096',
  },
  chatProduct: {
    fontSize: 13,
    color: '#718096',
    marginBottom: 6,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatMessage: {
    fontSize: 14,
    color: '#4A5568',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#00BFFF',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00BFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});