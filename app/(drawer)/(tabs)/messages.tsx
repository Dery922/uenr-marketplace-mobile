// app/(tabs)/messages.js
import { deleteConversation, fetchConversations } from "@/store/slices/chatSlice";
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Swipeable } from "react-native-gesture-handler";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

export default function MessagesInboxScreen() {
  const dispatch = useDispatch();
  const { conversations, loading, unreadCount } = useSelector((state: RootState) => state.chat);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { user } = useSelector((state) => state.auth);

  // Debug: Log unread counts
  useEffect(() => {
    console.log("Conversations with unread counts:", 
      conversations.map(c => ({ 
        id: c._id, 
        unreadCount: c.unreadCount,
        lastMessage: c.lastMessageText 
      }))
    );
  }, [conversations]);

  useFocusEffect(
    useCallback(() => {
      //dispatch(fetchConversations());
      // Also fetch unread counts separately if needed
      dispatch(fetchConversations());
    //dispatch(fetchUnreadCounts());
    }, [dispatch])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchConversations());
    setRefreshing(false);
  }, [dispatch]);

  const renderRightActions = (conversationId) => {
    const isDeleting = deletingId === conversationId;
    
    return (
      <TouchableOpacity
        style={[styles.deleteButton, isDeleting && styles.deleteButtonDisabled]}
        onPress={() => handleDelete(conversationId)}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Ionicons name="trash" size={24} color="#fff" />
            <Text style={styles.deleteText}>Delete</Text>
          </>
        )}
      </TouchableOpacity>
    );
  };

const handleDelete = async (conversationId) => {
  setDeletingId(conversationId);

  try {
    await dispatch(deleteConversation(conversationId)).unwrap();
    dispatch(fetchConversations()); // refresh from backend
  } catch (error) {
    console.log("Delete failed:", error);
  } finally {
    setDeletingId(null);
  }
};

  const navigateToChat = (conversation) => {
    // Mark as read will happen when entering the chat
    router.push({
      pathname: `/chat/${conversation._id}`,
      params: {
        sellerName: conversation.sellerName,
        productTitle: conversation.productTitle,
        productImage: conversation.productImage,
        productPrice: conversation.productPrice || '₵0',
      },
    });
  };

  const renderConversation = ({ item }) => {
    const hasUnread = item.unreadCount > 0;
    
    return (
      <Swipeable renderRightActions={() => renderRightActions(item._id)}>
        <TouchableOpacity
          style={[
            styles.conversationItem,
            hasUnread && styles.conversationItemUnread // Blue background for unread
          ]}
          onPress={() => navigateToChat(item)}
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: item.productImage || "https://via.placeholder.com/60" }}
            style={styles.productImage}
          />

          <View style={styles.conversationInfo}>
            <View style={styles.conversationHeader}>
              <Text style={[
                styles.sellerName,
                hasUnread && styles.sellerNameUnread // Bold for unread
              ]}>
                {item.sellerName || "User"}
              </Text>

              <Text style={[
                styles.messageTime,
                hasUnread && styles.messageTimeUnread
              ]}>
                {new Date(item.lastMessageTime).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </View>

            <Text style={[
              styles.productTitle,
              hasUnread && styles.productTitleUnread
            ]} numberOfLines={1}>
              {item.productTitle || "Product"}
            </Text>

            <View style={styles.messageRow}>
              <Text style={[
                styles.lastMessage,
                hasUnread && styles.lastMessageUnread // Bold/different color for unread
              ]} numberOfLines={1}>
                {item.lastMessageText || "Start chatting"}
              </Text>
              
              {/* Unread Badge */}
              {hasUnread && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>
                    {item.unreadCount > 99 ? '99+' : item.unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  if (loading && conversations?.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Messages</Text>
          <TouchableOpacity style={styles.newChatButton}>
            <Ionicons name="add" size={24} color="#00BFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00BFFF" />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.newChatButton}>
          <Ionicons name="add" size={24} color="#00BFFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={conversations || []}
        renderItem={renderConversation}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#00BFFF']}
            tintColor="#00BFFF"
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#00BFFF',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 40,
    height: 40,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  newChatButton: {
    padding: 8,
  },
  listContent: {
    padding: 16,
  },
  conversationItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
  },
  // NEW: Unread conversation style (light blue background)
  conversationItemUnread: {
    backgroundColor: '#EBF8FF', // Light blue background like WhatsApp
    borderColor: '#00BFFF',
    borderWidth: 1,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#718096',
  },
  // NEW: Bold name for unread
  sellerNameUnread: {
    fontWeight: '700',
    color: '#1A365D',
  },
  messageTime: {
    fontSize: 12,
    color: '#718096',
  },
  // NEW: Darker time for unread
  messageTimeUnread: {
    color: '#2D3748',
    fontWeight: '500',
  },
  productTitle: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 2,
  },
  // NEW: Darker product title for unread
  productTitleUnread: {
    color: '#2D3748',
    fontWeight: '500',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#A0AEC0',
    flex: 1,
    marginRight: 8,
  },
  // NEW: Bold and darker for unread message
  lastMessageUnread: {
    color: '#2D3748',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    borderRadius: 16,
    marginBottom: 12,
  },
  deleteText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  deleteButtonDisabled: {
    backgroundColor: '#FCA5A5',
    opacity: 0.7,
  },
  unreadBadge: {
    backgroundColor: '#00BFFF',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#718096',
  },
});