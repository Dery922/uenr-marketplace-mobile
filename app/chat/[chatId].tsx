import API from "@/api/axios";
import { useSocket } from "@/context/SocketContext";
import {
  addRealtimeMessage,
  fetchMessages,
  removeTempMessage,
} from "@/store/slices/chatSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Ionicons } from "@expo/vector-icons";

import { setUserOffline, setUserOnline } from "@/store/slices/chatSlice";
import { Image as ExpoImage } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
const { width, height } = Dimensions.get("window");

export default function ChatScreen() {
  // const { chatId, product } = useLocalSearchParams();
  // Add this with your other useSelector calls

  const { user } = useSelector((state: RootState) => state.auth);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { setActiveChatId, socket, isConnected } = useSocket();
  const [text, setText] = useState("");
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const params = useLocalSearchParams();
  const {
    chatId,
    sellerName = "Seller",
    productTitle = "Product",
    productPrice = "₵0",
    productImage = "",
    productId,
    isNewChat,
  } = params;

  // const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const { messages, loading } = useSelector((state: RootState) => state.chat);
  // const { chatId, product } = useLocalSearchParams();
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { sendRealtimeMessage } = useSocket();
  const onlineUsers = useSelector((state) => state.chat.onlineUsers);
  const insets = useSafeAreaInsets();

  // State to track loading status
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const uniqueMessages = Array.from(
    new Map(messages?.map((msg: any) => [msg._id, msg])).values(),
  );

  useEffect(() => {
    if (!chatId) return;

    // 1. Tell Context this is the active chat for unread logic
    setActiveChatId(chatId);

    // 2. Join the room - now triggers on ID change OR when connection stabilizes
    if (isConnected) {
      socket.emit("joinConversation", chatId);
      console.log("Joined conversation room:", chatId);
    }

    const loadMessages = async () => {
      setIsLoadingMessages(true);
      // Fetch via API
      await dispatch(fetchMessages(chatId as string));
      setIsLoadingMessages(false);
      setHasLoadedOnce(true);
      scrollToBottom();
      dispatch({ type: "chat/clearMessages" });
      setIsLoadingMessages(true);
      await dispatch(fetchMessages(chatId as string));

      setIsLoadingMessages(false);
      setHasLoadedOnce(true);
    };

    loadMessages();

    // 3. Cleanup: Reset active chat when leaving screen
    return () => {
      setActiveChatId(null);
    };
  }, [chatId, isConnected]); // Added isConnected as a dependency

  const currentUserId = user._id;
  const conversations = useSelector(
    (state: RootState) => state.chat.conversations,
  );

  const conversation = conversations.find((c) => c._id === chatId);

  const otherUser = conversation?.participants.find(
    (p: any) => p._id !== currentUserId,
  );

  const otherUserId = otherUser?._id;
  const isOnline = onlineUsers[otherUserId];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleTyping = () => setIsTyping(true);
    const handleStopTyping = () => setIsTyping(false);

    socket.on("userTyping", handleTyping);
    socket.on("userStoppedTyping", handleStopTyping);

    return () => {
      socket.off("userTyping", handleTyping);
      socket.off("userStoppedTyping", handleStopTyping);
    };
  }, []);

  // 2. Join conversation when chatId changes

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Add this function inside your ChatScreen component
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please grant permission to access your photos",
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled && result.assets[0]) {
      await sendImageMessage(result.assets[0]);
    }
  };

  const sendImageMessage = async (asset) => {
    if (!chatId || !user?._id) return;

    setUploadingImage(true);
    const tempId = `temp-img-${Date.now()}`;

    try {
      const tempMessage = {
        _id: tempId,
        text: "📷 Image",
        images: [asset.uri], // Use images array
        sender: user._id,
        createdAt: new Date().toISOString(),
        isMe: true,
        messageType: "image",
        isUploading: true,
      };

      dispatch(addRealtimeMessage(tempMessage));

      const formData = new FormData();
      const filename = asset.uri.split("/").pop() || "image.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const fileType = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("image", {
        uri: asset.uri,
        name: filename,
        type: fileType,
      } as any);
      formData.append("conversationId", chatId);

      const response = await API.post("/chat/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload success:", response.data);

      // Remove temp message
      dispatch(removeTempMessage(tempId));

      // Add real message from server
      dispatch(
        addRealtimeMessage({
          ...response.data,
          isMe: true,
        }),
      );
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to send image",
      );
      dispatch(removeTempMessage(tempId));
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    if (!user?._id || !chatId) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join", user._id);
    socket.emit("joinConversation", chatId);

    const handleReceiveMessage = (message) => {
      dispatch(addRealtimeMessage(message));
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [user?._id, chatId]);

  useEffect(() => {
    const handleMessage = (newMsg) => {
      dispatch(addRealtimeMessage(newMsg));
    };

    socket.on("receive_message", handleMessage);

    // THIS IS CRITICAL: Remove the listener when the component unmounts
    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, [socket, dispatch]);

  // Take photo with camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant camera permission");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await sendImageMessage(result.assets[0]);
    }
  };

  const handleSend = () => {
    if (!newMessage.trim() || !chatId || !user?._id) return;

    const tempMessage = {
      _id: Date.now().toString(),
      conversationId: chatId,
      text: newMessage,
      sender: user._id,
      createdAt: new Date().toISOString(),
    };

    dispatch(addRealtimeMessage(tempMessage));

    socket.emit("sendMessage", {
      conversationId: chatId,
      text: newMessage,
      sender: user._id,
      receiverId: otherUserId,
    });

    setNewMessage("");
  };
  useEffect(() => {
    const handleOnline = (userId) => {
      dispatch(setUserOnline(userId));
    };

    const handleOffline = (userId) => {
      dispatch(setUserOffline(userId));
    };

    socket.on("userOnline", handleOnline);
    socket.on("userOffline", handleOffline);

    return () => {
      socket.off("userOnline", handleOnline);
      socket.off("userOffline", handleOffline);
    };
  }, []);

  const saveImageToGallery = async (imageUrl: string) => {
    try {
      // You'll need to implement this based on your needs
      // For now, just show a message
      Alert.alert("Save Image", "Save functionality coming soon");
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  const makeOffer = (amount: string) => {
    const offerMessage = {
      id: Date.now().toString(),
      text: `I'd like to offer ${amount} for the ${productTitle}`,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
    };
    //setMessages(prev => [...prev, offerMessage]);
    setNewMessage("");
  };

  const renderMessage = ({ item }: any) => {
    const senderId =
      typeof item.sender === "object" ? item.sender?._id : item.sender;
    const isMe = senderId === currentUserId;
    const isImage =
      item.messageType === "image" || (item.images && item.images.length > 0);
    const isUploading = item.isUploading;
    const imageUrl = item.images?.[0] || item.imageUrl; // Support both formats

    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.messageContainerMe : styles.messageContainerOther,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isMe ? styles.messageBubbleMe : styles.messageBubbleOther,
          ]}
        >
          {isImage ? (
            <View>
              {isUploading ? (
                <View style={styles.imageUploadingContainer}>
                  <ActivityIndicator
                    size="large"
                    color={isMe ? "#FFFFFF" : "#00BFFF"}
                  />
                  <Text
                    style={[
                      styles.uploadingText,
                      isMe && styles.uploadingTextMe,
                    ]}
                  >
                    Uploading image...
                  </Text>
                </View>
              ) : (
                <TouchableOpacity onPress={() => viewFullImage(imageUrl)}>
                  <ExpoImage
                    source={{ uri: imageUrl }}
                    style={styles.messageImage}
                    contentFit="cover"
                    transition={200}
                  />
                </TouchableOpacity>
              )}
              {item.text && item.text !== "📷 Image" && (
                <Text
                  style={[
                    styles.messageText,
                    isMe ? styles.messageTextMe : styles.messageTextOther,
                    styles.imageCaption,
                  ]}
                >
                  {item.text}
                </Text>
              )}
            </View>
          ) : (
            <Text
              style={[
                styles.messageText,
                isMe ? styles.messageTextMe : styles.messageTextOther,
              ]}
            >
              {item.text}
            </Text>
          )}

          <Text
            style={[
              styles.messageTime,
              isMe ? styles.messageTimeMe : styles.messageTimeOther,
            ]}
          >
            {formatMessageTime(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  // View full image modal
  const viewFullImage = (imageUrl: string) => {
    Alert.alert("View Image", "", [
      { text: "Cancel", style: "cancel" },
      {
        text: "View Full Size",
        onPress: () => {
          // Navigate to full image screen or open modal
          router.push({
            pathname: "/image-viewer",
            params: { imageUrl },
          });
        },
      },
      { text: "Save to Gallery", onPress: () => saveImageToGallery(imageUrl) },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      key={chatId as string}
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
              source={{
                uri:
                  (productImage as string) ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80",
              }}
              style={styles.productImage}
              contentFit="cover"
            />
            <View style={styles.productDetails}>
              <View style={styles.nameContainer}>
                <Text style={styles.sellerName}>{sellerName as string}</Text>
                <View
                  style={[
                    styles.onlineDot,
                    { backgroundColor: isOnline ? "#4CAF50" : "#A0AEC0" },
                  ]}
                />
              </View>
              <Text style={{ color: "#fff", fontSize: 12 }}>
                {isOnline ? "Online" : "Offline"}
              </Text>
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
              <Ionicons
                name="information-circle-outline"
                size={22}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Offer Buttons */}
        <View style={styles.offerButtons}>
          <Text style={styles.offerLabel}>Quick Offer:</Text>
          <TouchableOpacity
            style={styles.offerButton}
            onPress={() => makeOffer("₵45")}
          >
            <Text style={styles.offerText}>₵45</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.offerButton}
            onPress={() => makeOffer("₵40")}
          >
            <Text style={styles.offerText}>₵40</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.offerButton}
            onPress={() => makeOffer("₵35")}
          >
            <Text style={styles.offerText}>₵35</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom White Section (80%) with curved top - Messages Area */}
      {/* Bottom White Section (80%) */}
      {/* <View style={styles.bottomSection}>
  {isLoadingMessages ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#00BFFF" />
      <Text style={{ marginTop: 10, color: '#A0AEC0' }}>Loading chat...</Text>
    </View>
  ) : (
    <FlatList
      data={messages} // Removed .reverse() - ensure Redux has newest at index 0
      inverted
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => renderMessage({ item })}
      ListFooterComponent={() => (
        <View style={styles.contextBanner}>
           <Text>Chatting about {productTitle}</Text>
        </View>
      )}
      style={styles.messagesContainer}
      contentContainerStyle={{ paddingBottom: 10 }}
      keyboardShouldPersistTaps="handled"
    />
  )}
</View> */}

      {/* Bottom White Section with curved top - Messages Area */}
      {/* Bottom White Section with curved top - Messages Area */}
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
              You're chatting about:{" "}
              <Text style={styles.contextBold}>{productTitle}</Text> (
              {productPrice})
            </Text>
          </View>

          {isLoadingMessages ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00BFFF" />
              <Text style={styles.loadingText}>Loading messages...</Text>
            </View>
          ) : (
            uniqueMessages.map((item: any) => (
              <View key={item._id}>{renderMessage({ item })}</View>
            ))
          )}
          {/* Typing Indicator */}
          {isTyping && (
            <View
              style={[styles.messageContainer, styles.messageContainerOther]}
            >
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
        {/* Message Input */}
        <View style={[styles.inputContainer, { paddingBottom: insets.bottom }]}>
          {/* Attachment Button with Options */}
          <TouchableOpacity
            style={styles.attachmentButton}
            onPress={() => {
              Alert.alert("Add Attachment", "Choose an option", [
                { text: "Cancel", style: "cancel" },
                { text: "Choose from Gallery", onPress: pickImage },
                { text: "Take Photo", onPress: takePhoto },
              ]);
            }}
          >
            <Ionicons name="attach-outline" size={24} color="#00BFFF" />
          </TouchableOpacity>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder={uploadingImage ? "Uploading image..." : "Message"}
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              maxLength={500}
              editable={!uploadingImage}
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity
              style={styles.quickOfferButton}
              onPress={() => Alert.alert("Make Offer", "Enter offer amount:")}
            >
              <Ionicons name="pricetag-outline" size={20} color="#718096" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.sendButton,
              !newMessage.trim() &&
                !uploadingImage &&
                styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!newMessage.trim() && !uploadingImage}
          >
            <Ionicons
              name="send"
              size={24}
              color={
                newMessage.trim() || uploadingImage ? "#FFFFFF" : "#A0AEC0"
              }
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
    backgroundColor: "#00BFFF",
  },
  // These layout styles are already written inside your code:
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF", // Keeps the input bar opaque over messages
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB", // Clear separator line under the list

    // High-performance elevation wrappers for platform shadowing
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  inputWrapper: {
    flex: 1, // Forces the pill box to fill all remaining horizontal room
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#F1F5F9", // Soft modern background fill
    borderRadius: 26, // Rounded design alignment
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 46,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    maxHeight: 120, // Prevents a long message from eating up the entire screen
    paddingTop: 4,
    paddingBottom: 4,
  },

  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    padding: 3,
    backgroundColor: "#00BFFF", // Matches your primary campus-blue branding color
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    elevation: 4,
  },

  sendButtonDisabled: {
    backgroundColor: "#F1F5F9", // Turns grey when no text is written
  },

  topSection: {
    height: "25%",
    backgroundColor: "#00BFFF",
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  topContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  chatInfo: {
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  offerButtons: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  offerLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  offerButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  offerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  bottomSection: {
    flex: 1,
    backgroundColor: "#FFFFFF",

    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    marginTop: -20,
  },

  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  messagesContainer: {
    flex: 1,
    padding: 12,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    padding: 12,
    paddingBottom: 100,
  },
  contextBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 191, 255, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 191, 255, 0.2)",
  },
  contextText: {
    fontSize: 14,
    color: "#4A5568",
    marginLeft: 8,
    flex: 1,
  },
  contextBold: {
    fontWeight: "600",
    color: "#00BFFF",
  },
  messageContainer: {
    marginBottom: 16,
    flexDirection: "row",
  },
  messageContainerMe: {
    justifyContent: "flex-end",
  },
  messageContainerOther: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  messageBubbleMe: {
    backgroundColor: "#00BFFF",
    borderBottomRightRadius: 4,
  },
  messageBubbleOther: {
    backgroundColor: "#F1F5F9",
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
    color: "#FFFFFF",
  },
  messageTextOther: {
    color: "#2D3748",
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  messageTimeMe: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  messageTimeOther: {
    color: "#718096",
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
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
    backgroundColor: "#A0AEC0",
    marginHorizontal: 2,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "flex-end",
    paddingHorizontal: 12,

    paddingBottom: 10,
    backgroundColor: "#FFFFFF",

    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",

    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",

    backgroundColor: "#F1F5F9",
    borderRadius: 26,

    borderWidth: 1,
    borderColor: "#E2E8F0",

    paddingHorizontal: 14,
    paddingVertical: 10,

    minHeight: 46,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",

    maxHeight: 120,
    paddingTop: 4,
    paddingBottom: 4,
  },

  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 8,
  },
  imageUploadingContainer: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadingText: {
    marginTop: 8,
    fontSize: 12,
    color: "#718096",
  },
  uploadingTextMe: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  imageCaption: {
    marginTop: 8,
  },

  quickOfferButton: {
    padding: 4,
  },
  attachmentButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    padding: 3,
    backgroundColor: "#00BFFF",

    justifyContent: "center",
    alignItems: "center",

    marginLeft: 8,

    elevation: 4,
  },

  sendButtonDisabled: {
    backgroundColor: "#F1F5F9",
  },

  // Replace these styles in your StyleSheet
  sellerName: {
    fontSize: 18, // Increased from 12
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  productTitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
    opacity: 0.9,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },

  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#718096",
  },
  imageUploadingContainer: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadingText: {
    marginTop: 8,
    fontSize: 12,
    color: "#718096",
  },
});
