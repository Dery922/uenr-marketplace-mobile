// store/slices/chatSlice.js
import { BASE_URL } from "@/api/axios";
import {
  deleteConversationAPI,
  getMessages,
  getUnreadCount,
  getUserConversations,
  markConversationAsRead,
  sendMessage,
} from "@/api/chatApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async () => {
    const response = await getUserConversations();
    return response.data;
  },
);
export const sendChatImage = createAsyncThunk(
  "chat/sendImage",
  async (
    {
      conversationId,
      imageUri,
      mimeType,
    }: { conversationId: string; imageUri: string; mimeType: string },
    { getState, dispatch },
  ) => {
    // Create form data for file upload
    const formData = new FormData();

    // Get the file name and extension
    const filename = imageUri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : mimeType;

    // Append the image file
    formData.append("image", {
      uri: imageUri,
      name: filename,
      type,
    } as any);
    formData.append("conversationId", conversationId);

    // Send to your API endpoint
    const response = await fetch(`${BASE_URL}/chat/upload-image`, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const data = await response.json();

    const { auth } = getState() as { auth: { user: { _id: string } } };
    const currentUserId = auth.user._id;

    return {
      ...data,
      isMe: data.sender?._id?.toString() === currentUserId?.toString(),
      isImage: true,
      imageUrl: data.imageUrl,
    };
  },
);
export const deleteConversation = createAsyncThunk(
  "chat/deleteConversation",
  async (conversationId, thunkAPI) => {
    await deleteConversationAPI(conversationId);
    return conversationId;
  },
);
export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (conversationId: string, { getState }) => {
    const response = await getMessages(conversationId);
    const { auth } = getState() as { auth: { user: { _id: string } } };
    const currentUserId = auth.user._id;

    const messagesWithIsMe = response.data.map((message: any) => ({
      ...message,
      isMe: message.sender?._id?.toString() === currentUserId?.toString(),
      // Ensure images array exists
      images: message.images || (message.imageUrl ? [message.imageUrl] : []),
      messageType: message.messageType || (message.imageUrl ? "image" : "text"),
    }));

    return messagesWithIsMe;
  },
);

export const markConversationMessagesRead = createAsyncThunk(
  "chat/markMessagesRead",
  async (conversationId: string) => {
    // You'll need to create this API call
    const response = await API.post();
    return conversationId;
  },
);

// export const fetchConversations = createAsyncThunk(
//   "chat/fetchConversations",
//   async () => {
//     const response = await getUserConversations();
//     return response.data;
//   }
// );

// export const fetchMessages = createAsyncThunk(
//   "chat/fetchMessages",
//   async (conversationId: string, { getState }) => {
//     const response = await getMessages(conversationId);
//     const { auth } = getState() as { auth: { user: { _id: string } } };
//     const currentUserId = auth.user._id;

//     const messagesWithIsMe = response.data.map((message: any) => ({
//       ...message,
//       isMe: message.sender?._id?.toString() === currentUserId?.toString()
//     }));

//     return messagesWithIsMe;
//   }
// );
export const fetchUnreadCount = createAsyncThunk(
  "chat/fetchUnreadCount",
  async () => {
    const response = await getUnreadCount();
    return response.data.unreadCount;
  },
);
export const markConversationRead = createAsyncThunk(
  "chat/markConversationRead",
  async (conversationId: string) => {
    await markConversationAsRead(conversationId);
    return conversationId;
  },
);
export const sendChatMessage = createAsyncThunk(
  "chat/sendMessage",
  async (
    { conversationId, text }: { conversationId: string; text: string },
    { getState, dispatch },
  ) => {
    const response = await sendMessage({
      conversationId,
      text,
    });

    const { auth } = getState() as { auth: { user: { _id: string } } };
    const currentUserId = auth.user._id;

    return {
      ...response.data,
      isMe: response.data.sender?._id?.toString() === currentUserId?.toString(),
    };
  },
);
const chatSlice = createSlice({
  name: "chat",
  initialState: {
    conversations: [],
    messages: [],
    unreadCount: 0,
    loading: false,
    error: null,
    onlineUsers: {},
  },
  reducers: {
    setUserOnline: (state, action) => {
      state.onlineUsers[action.payload] = true;
    },

    addRealtimeMessage: (state, action) => {
      const exists = state.messages.find(
        (msg) => msg._id === action.payload._id,
      );
      // Only push if the message isn't already in the list (from the API call)
      if (!exists) {
        state.messages.push(action.payload);
      }
    },

    setUserOffline: (state, action) => {
      delete state.onlineUsers[action.payload];
    },

    removeTempMessage: (state, action) => {
      state.messages = state.messages.filter(
        (msg) => msg._id !== action.payload,
      );
    },

    clearMessages: (state) => {
      state.messages = [];
    },
    addRealtimeMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    resetUnreadCount: (state) => {
      state.unreadCount = 0;
    },
    updateConversationLastMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      const conversationIndex = state.conversations.findIndex(
        (c: any) => c._id === conversationId,
      );
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].lastMessage = message;
        state.conversations[conversationIndex].updatedAt =
          new Date().toISOString();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
        state.loading = false;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        const exists = state.messages.find(
          (msg) => msg._id === action.payload._id,
        );
        if (!exists) {
          state.messages.push(action.payload);
        }
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        // Remove deleted conversation from state
        state.conversations = state.conversations.filter(
          (conv) => conv._id !== action.payload,
        );
      })
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.loading = false;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(markConversationRead.fulfilled, (state, action) => {
        // Decrease unread count by the number of messages in that conversation
        // You might want to refetch unread count here
      })
 
  },
});
export const {
  clearMessages,
  addRealtimeMessage,
  removeTempMessage,
  incrementUnreadCount,
  resetUnreadCount,
  setUserOnline,
  setUserOffline,
  updateConversationLastMessage,
} = chatSlice.actions;
export default chatSlice.reducer;
