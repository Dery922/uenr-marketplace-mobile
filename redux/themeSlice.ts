// redux/themeSlice.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: { darkMode: false },
  reducers: {
    setTheme: (state, action) => {
      state.darkMode = action.payload;
    },
    // Reset state to default (light mode)
    resetThemeState: (state) => {
      state.darkMode = false;
    }
  },
});

export const { setTheme, resetThemeState } = themeSlice.actions;

// THUNK: Toggle and save for a SPECIFIC user
export const toggleUserTheme = (userId) => async (dispatch, getState) => {
  const currentMode = getState().theme.darkMode;
  const newMode = !currentMode;
  
  dispatch(setTheme(newMode)); // Update UI immediately

  if (userId) {
    // Save with a user-specific key
    await AsyncStorage.setItem(`theme_${userId}`, newMode ? "dark" : "light");
  }
};

// THUNK: Load for a SPECIFIC user
export const loadUserTheme = (userId) => async (dispatch) => {
  if (!userId) return;
  const saved = await AsyncStorage.getItem(`theme_${userId}`);
  dispatch(setTheme(saved === "dark"));
};

export default themeSlice.reducer;
