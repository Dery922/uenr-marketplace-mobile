import API from "./axios"; // your configured axios instance

export const startConversation = (data) => {
  // data = { productId, receiverId }
  return API.post("/messages/conversations/start", data);
};

export const getUserConversations = () => {
  return API.get("/messages/conversations");
};

export const getMessages = (conversationId: string) =>
  API.get(`/messages/${conversationId}`);

export const getConversationMessages = (conversationId) => {
  return API.get(`/messages/${conversationId}`);
};

export const sendMessage = (data) => {
  // data = { conversationId, text }
  return API.post("/messages/send", data);
};
