import { socket } from "@/api/socket";
import {
  addRealtimeMessage,
  incrementUnreadCount,
  updateConversationLastMessage,
} from "@/store/slices/chatSlice";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext); // Fixed: assign to variable first
  if (!context) throw new Error("useSocket must be used within SocketProvider");
  return context;
};

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const activeChatRef = useRef(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Keep the ref in sync with the state
  useEffect(() => {
    activeChatRef.current = activeChatId;
  }, [activeChatId]);

  useEffect(() => {
    if (!user?._id) return;

    socket.connect();

    const onConnect = () => {
      setIsConnected(true);
      socket.emit("join", user._id);
      console.log("Socket connected and joined:", user._id);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    // Define the handler properly
    const onReceiveMessage = (message) => {
      console.log("New message received via socket:", message);

      const isFromMe = message.sender?._id === user._id;
      // ALWAYS use the Ref here to avoid stale state bugs
      const isInCurrentConversation =
        activeChatRef.current === message.conversation;

      const messageWithFlag = {
        ...message,
        isMe: isFromMe,
        images: message.images || (message.imageUrl ? [message.imageUrl] : []),
        messageType:
          message.messageType || (message.imageUrl ? "image" : "text"),
      };
      // 1. Add message to state
      dispatch(
        addRealtimeMessage({
          ...message,
          isMe: isFromMe,
        }),
      );

      // 2. Increment unread if it's someone else AND I'm not looking at that chat
      if (!isFromMe && !isInCurrentConversation) {
        dispatch(incrementUnreadCount());
      }

      // 3. Update the sidebar/list preview
      dispatch(
        updateConversationLastMessage({
          conversationId: message.conversation,
          message: message,
        }),
      );
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receiveMessage", onReceiveMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receiveMessage", onReceiveMessage);
      socket.disconnect();
    };
  }, [user?._id]); // Only restart if the user changes

  const sendRealtimeMessage = (messageData) => {
    if (!socket.connected) return false;
    socket.emit("sendMessage", messageData);
    return true;
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        sendRealtimeMessage,
        activeChatId,
        setActiveChatId,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
