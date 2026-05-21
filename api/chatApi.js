import API from "./axios"; // your configured axios instance

export const startConversation = (data) => {
  // data = { productId, receiverId }
  return API.post("/messages/conversations/start", data);
};

export const getUserConversations = () => {
  return API.get("/messages/conversations");
};

export const getChatMessagesRead = () => {
  return API.post(`/messages/read/${conversationId}`)
}

export const getMessages = (conversationId: string) =>
  API.get(`/messages/${conversationId}`);

export const getConversationMessages = (conversationId) => {
  return API.get(`/messages/${conversationId}`);
};

export const getUnreadCount = () => {
  return API.get("/messages/unread-count");
};

export const markConversationAsRead = (conversationId) => {
  return API.put(`/messages/${conversationId}/read`);
};

export const sendMessage = (data) => {
  // data = { conversationId, text }
  return API.post("/messages/send", data);
};


export const deleteConversationAPI = (conversationId) => {
  return API.delete(`/messages/chat/conversations/${conversationId}`);
};


// api/chatApi.js
export const markMessagesAsRead = (conversationId) => {
  return API.post(`/chat/messages/read/${conversationId}`);
};

export const getUnreadCounts = () => {
  return API.get('/chat/unread-counts');
};