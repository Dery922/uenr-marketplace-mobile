import {
  getMessages,
  getUserConversations,
  sendMessage
} from "@/api/chatApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async () => {
    const response = await getUserConversations();
    return response.data;
  }
);

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (conversationId: string, { getState }) => {
    const response = await getMessages(conversationId);
    const { auth } = getState() as { auth: { user: { _id: string } } };
    const currentUserId = auth.user._id;


        console.log("Current User ID:", currentUserId);
        console.log("Messages from API:", response.data);
    
    // Add isMe property based on sender._id comparison
    const messagesWithIsMe = response.data.map((message: any) => ({
      ...message,
      isMe: message.sender?._id === currentUserId
    }));
    
    return messagesWithIsMe;
  }
);

export const sendChatMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ conversationId, text }: { conversationId: string; text: string }, { getState }) => {
    const response = await sendMessage({
      conversationId,
      text
    });
    
    const { auth } = getState() as { auth: { user: { _id: string } } };
    const currentUserId = auth.user._id;
    
    // Add isMe property to the new message
    return {
      ...response.data,
      isMe: response.data.sender?._id === currentUserId
    };
  }
);
const chatSlice = createSlice({
  name: "chat",
  initialState: {
    conversations: [],
    messages: [],
    loading: false,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
      })

      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      })

      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});

export default chatSlice.reducer;