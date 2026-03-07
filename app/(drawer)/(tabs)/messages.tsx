// app/(tabs)/messages.js
import { fetchConversations } from "@/store/slices/chatSlice";
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

export default function MessagesInboxScreen() {
  const dispatch = useDispatch();
  // Mock conversation data
  const { conversations } = useSelector((state: RootState) => state.chat);
  // const conversations = [
  //   {
  //     id: '1',
  //     sellerName: 'Kwame (Final Year)',
  //     lastMessage: 'Yes, it\'s still available!',
  //     productTitle: 'Calculus 101 Textbook',
  //     productImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
  //     time: '10:31 AM',
  //     unreadCount: 2,
  //   },
  //   {
  //     id: '2',
  //     sellerName: 'Nana (Engineering)',
  //     lastMessage: 'The calculator is like new.',
  //     productTitle: 'Casio Scientific Calculator',
  //     productImage: 'https://images.unsplash.com/photo-1587145742593-21c33361c4e0?w=400&q=80',
  //     time: 'Yesterday',
  //     unreadCount: 0,
  //   },
  //   // Add more conversations...
  // ];
  const { user } = useSelector((state) => state.auth);


  useEffect(() => {
  console.log("Conversations:", JSON.stringify(conversations, null, 2));
}, [conversations]);


useFocusEffect(
  useCallback(() => {
    dispatch(fetchConversations());
  }, [])
);
 
  const navigateToChat = (conversation) => {
    router.push({
      pathname: `/chat/${conversation._id}`,
      params: {
        sellerName: conversation.sellerName,
        productTitle: conversation.productTitle,
        productImage: conversation.productImage,
        productPrice: '₵120', // You would fetch this from your data
      },
    });
  };

const renderConversation = ({ item }) => {

  const seller = item.participants?.find(
  (p) => p._id !== user._id
);
  return (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => navigateToChat(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.product?.images?.[0] }}
        style={styles.productImage}
      />

      <View style={styles.conversationInfo}>
        <View style={styles.conversationHeader}>
          <Text style={styles.sellerName}>
            {seller?.name || "User"}
          </Text>

          <Text style={styles.messageTime}>
            {new Date(item.updatedAt).toLocaleTimeString()}
          </Text>
        </View>

        <Text style={styles.productTitle} numberOfLines={1}>
          {item.product?.title}
        </Text>

        <Text style={styles.lastMessage} numberOfLines={1}>
          Start chatting
        </Text>
      </View>
    </TouchableOpacity>
  );
};

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1A365D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.newChatButton}>
          <Ionicons name="add" size={24} color="#00BFFF" />
        </TouchableOpacity>
      </View>

      {/* Conversations List */}
      <FlatList
        
        data={conversations || []}
        renderItem={renderConversation}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A365D',
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
    fontWeight: '600',
    color: '#1A365D',
  },
  messageTime: {
    fontSize: 12,
    color: '#718096',
  },
  productTitle: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 2,
  },
  lastMessage: {
    fontSize: 14,
    color: '#718096',
  },
  unreadBadge: {
    backgroundColor: '#00BFFF',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});