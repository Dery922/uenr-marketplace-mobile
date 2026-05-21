import { SocketProvider } from "@/context/SocketContext";

import { restoreUser } from "@/store/slices/authSlice";
import { store } from "@/store/store";
import { setNavigationRef } from "@/utils/navigationRef";
import { Stack, useNavigationContainerRef } from "expo-router";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { Provider, useDispatch, useSelector } from "react-redux";

import { loadUserTheme, resetThemeState } from "@/redux/themeSlice";

// Create a separate component that uses Redux hooks
function AppContent() {
  const { user, isLoading } = useSelector((state: any) => state.auth);
  const userId = user?._id || user?.userId || null; 

  const dispatch = useDispatch();
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    setNavigationRef(navigationRef);
  }, [navigationRef]);


useEffect(() => {
  if (userId) {
    dispatch(loadUserTheme(userId));
  } else {
    dispatch(resetThemeState()); // Reset to light mode if logged out
  }
}, [userId]);


  useEffect(() => {
    dispatch(restoreUser());
  }, [dispatch]);

  if (isLoading) {
    return null; // Or your loading component
  }

  return (
    <SocketProvider>
      {user ? (
        <Stack screenOptions={{ headerShown: false }} />
      ) : (
        <Stack screenOptions={{ headerShown: false }} />
      )}
    </SocketProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppContent />
      <Toast />
    </Provider>
  );
}