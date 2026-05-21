import { useSocket } from "@/context/SocketContext";
import { setUserOffline, setUserOnline } from "@/store/slices/chatSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const useSocketEvents = () => {
  const dispatch = useDispatch();
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket) return; // wait until socket exists
    socket.on("userOnline", (userId) => {
      dispatch(setUserOnline(userId));
    });

    socket.on("userOffline", (userId) => {
      dispatch(setUserOffline(userId));
    });

    return () => {
      socket.off("userOnline");
      socket.off("userOffline");
    };
  }, []);
};
