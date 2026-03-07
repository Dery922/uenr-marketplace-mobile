// app/chat/[chatId].tsx
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';

import { fetchMessages, sendChatMessage } from '@/store/slices/chatSlice';
import { AppDispatch, RootState } from "@/store/store";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
const { width, height } = Dimensions.get('window');

// Mock messages - will be replaced with real data
const INITIAL_MESSAGES = [
  { id: '1', text: 'Hi! Is the textbook still available?', time: '10:30 AM', isMe: true },
  { id: '2', text: 'Yes, it\'s still available!', time: '10:31 AM', isMe: false },
];

export default function ChatScreen() {
  // const { chatId, product } = useLocalSearchParams();
  const params = useLocalSearchParams();
  const {
    chatId,
    sellerName = 'Seller',
    productTitle = 'Product',
    productPrice = '₵0',
    productImage = '',
    productId,
    isNewChat,
  } = params;

  // const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const {messages} = useSelector((state : RootState) => state.chat);
  // const { chatId, product } = useLocalSearchParams();
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const dispatch = useDispatch<AppDispatch>();
  

  const insets = useSafeAreaInsets();





  useEffect(() => {
  if (!chatId) return;

  dispatch(fetchMessages(chatId as string));
}, [chatId]);





  // Initialize with product context message if it's a new chat
  // useEffect(() => {
  //   if (isNewChat === 'true') {
  //     const contextMessage = {
  //       id: 'context',
  //       text: `Hi! I'm interested in your "${productTitle}" listed for ${productPrice}`,
  //       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  //       isMe: true,
  //     };
  //     setMessages([contextMessage]);
  //   }
  // }, [isNewChat, productTitle, productPrice]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

// Add this function inside your ChatScreen component
const formatMessageTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};


const handleSend = () => {
 
  if (!newMessage.trim()) return;

  dispatch(
    sendChatMessage({
      conversationId: chatId as string,
      text: newMessage,
    })
  );

  setNewMessage('');
};
  // const handleSend = () => {
  //   if (!newMessage.trim()) return;

  //   const newMsg = {
  //     id: Date.now().toString(),
  //     text: newMessage,
  //     time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  //     isMe: true,
  //   };

  //   setMessages(prev => [...prev, newMsg]);
  //   setNewMessage('');

  //   // Simulate seller typing
  //   setIsTyping(true);
  //   setTimeout(() => {
  //     setIsTyping(false);
  //     const replyMsg = {
  //       id: (Date.now() + 1).toString(),
  //       text: 'Thanks for your message! I\'ll reply shortly.',
  //       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  //       isMe: false,
  //     };
  //     setMessages(prev => [...prev, replyMsg]);
  //   }, 1500);
  // };

  const makeOffer = (amount: string) => {
    const offerMessage = {
      id: Date.now().toString(),
      text: `I'd like to offer ${amount} for the ${productTitle}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };
    //setMessages(prev => [...prev, offerMessage]);
    setNewMessage('');
  };

const renderMessage = ({ item }: any) => (
  <View style={[
    styles.messageContainer,
    item.isMe ? styles.messageContainerMe : styles.messageContainerOther
  ]}>
    <View style={[
      styles.messageBubble,
      item.isMe ? styles.messageBubbleMe : styles.messageBubbleOther
    ]}>
      <Text style={[
        styles.messageText,
        item.isMe ? styles.messageTextMe : styles.messageTextOther
      ]}>
        {item.text}
      </Text>
      <Text style={[
        styles.messageTime,
        item.isMe ? styles.messageTimeMe : styles.messageTimeOther
      ]}>
        {formatMessageTime(item.createdAt)}
      </Text>
    </View>
  </View>
);

{messages?.map((item : any) => renderMessage({ item }))}
  return (
    <KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === "ios" ? "padding" : "height"}
  keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}

>
      {/* Top Blue Section (20%) - Chat Header with Product Info */}
      <View style={styles.topSection}>
        <View style={styles.topContent}>
          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          {/* Chat Info */}
         <View style={styles.chatInfo}>
  <ExpoImage 
    source={{ uri: productImage as string || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80' }} 
    style={styles.productImage}
    contentFit="cover"
  />
  <View style={styles.productDetails}>
    <View style={styles.nameContainer}>
      <Text style={styles.sellerName}>
        {sellerName as string}
      </Text>
      <View style={styles.onlineDot} />
    </View>
    <Text style={styles.productTitle} numberOfLines={1}>
      Re: {productTitle as string}
    </Text>
    <Text style={styles.productPrice}>{productPrice as string}</Text>
  </View>
</View>
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="call-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="information-circle-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Offer Buttons */}
        <View style={styles.offerButtons}>
          <Text style={styles.offerLabel}>Quick Offer:</Text>
          <TouchableOpacity 
            style={styles.offerButton}
            onPress={() => makeOffer('₵45')}
          >
            <Text style={styles.offerText}>₵45</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.offerButton}
            onPress={() => makeOffer('₵40')}
          >
            <Text style={styles.offerText}>₵40</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.offerButton}
            onPress={() => makeOffer('₵35')}
          >
            <Text style={styles.offerText}>₵35</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom White Section (80%) with curved top - Messages Area */}
      <View style={styles.bottomSection}>

         <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 10 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Product Context Banner */}
          <View style={styles.contextBanner}>
            <Ionicons name="information-circle" size={20} color="#00BFFF" />
            <Text style={styles.contextText}>
              You're chatting about: <Text style={styles.contextBold}>{productTitle}</Text> ({productPrice})
            </Text>
          </View>

          {/* Messages */}
          {messages?.map((item : any) => (
            <View key={item._id}>
              {renderMessage({ item })}
            </View>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <View style={[styles.messageContainer, styles.messageContainerOther]}>
              <View style={[styles.messageBubble, styles.messageBubbleOther]}>
                <View style={styles.typingIndicator}>
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Message Input */}
          <View
            style={[
              styles.inputContainer,
              { paddingBottom: insets.bottom }
            ]}
          >
          <TouchableOpacity style={styles.attachmentButton}>
            <Ionicons name="attach-outline" size={24} color="#00BFFF" />
          </TouchableOpacity>
          
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Message"
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              maxLength={500}
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity style={styles.quickOfferButton} onPress={() => Alert.alert('Make Offer', 'Enter offer amount:')}>
              <Ionicons name="pricetag-outline" size={20} color="#718096" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!newMessage.trim()}
          >
            <Ionicons 
              name="send" 
              size={24} 
              color={newMessage.trim() ? "#FFFFFF" : "#A0AEC0"} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  topContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
  },

  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  offerLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  offerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  offerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',

    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    marginTop: -20,
  },

onlineDot: {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: '#4CAF50',
  borderWidth: 1,
  borderColor: '#FFFFFF',
},
  messagesContainer: {
    flex: 1,
    padding:12,

  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    padding:12,
    paddingBottom: 100,
  },
  contextBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 191, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 191, 255, 0.2)',
  },
  contextText: {
    fontSize: 14,
    color: '#4A5568',
    marginLeft: 8,
    flex: 1,
  },
  contextBold: {
    fontWeight: '600',
    color: '#00BFFF',
  },
  messageContainer: {
    marginBottom: 16,
    flexDirection: 'row',
  },
  messageContainerMe: {
    justifyContent: 'flex-end',
  },
  messageContainerOther: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  messageBubbleMe: {
    backgroundColor: '#00BFFF',
    borderBottomRightRadius: 4,
  },
  messageBubbleOther: {
    backgroundColor: '#F1F5F9',
    borderBottomLeftRadius: 4,
  },
    scrollContent: {
  
    paddingBottom: 40,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageTextMe: {
    color: '#FFFFFF',
  },
  messageTextOther: {
    color: '#2D3748',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  messageTimeMe: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  messageTimeOther: {
    color: '#718096',
  },
  typingIndicator: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 8,
  marginBottom: 8, // new
},
  // typingIndicator: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   paddingVertical: 8,
  // },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#A0AEC0',
    marginHorizontal: 2,
  },
inputContainer: {
  flexDirection: 'row',
  padding:10,
  alignItems: 'flex-end',
  paddingHorizontal: 12,

  paddingBottom: 10,
  backgroundColor: '#FFFFFF',

  borderTopWidth: 1,
  borderTopColor: '#E5E7EB',

  elevation: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -3 },
  shadowOpacity: 0.08,
  shadowRadius: 6,
},

inputWrapper: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'flex-end',

  backgroundColor: '#F1F5F9',
  borderRadius: 26,

  borderWidth: 1,
  borderColor: '#E2E8F0',

  paddingHorizontal: 14,
  paddingVertical: 10,

  minHeight: 46,
},

input: {
  flex: 1,
  fontSize: 16,
  color: '#1F2937',

  maxHeight: 120,
  paddingTop: 4,
  paddingBottom: 4,
},
  quickOfferButton: {
    padding: 4,
  },
  attachmentButton: {
  width: 40,
  height: 40,
  borderRadius: 20,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 6,
},
sendButton: {
  width: 44,
  height: 44,
  borderRadius: 22,
  padding:3,
  backgroundColor: '#00BFFF',

  justifyContent: 'center',
  alignItems: 'center',

  marginLeft: 8,

  elevation: 4,
},

  sendButtonDisabled: {
    backgroundColor: '#F1F5F9',
  },



  // Replace these styles in your StyleSheet
sellerName: {
  fontSize: 18, // Increased from 12
  fontWeight: '700',
  color: '#FFFFFF',
  marginBottom: 2,
},
productTitle: {
  fontSize: 14,
  color: 'rgba(255, 255, 255, 0.9)',
  marginBottom: 2,
},
productPrice: {
  fontSize: 13,
  fontWeight: '600',
  color: '#FFFFFF',
  opacity: 0.9,
},
nameContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  marginBottom: 4,
},

});