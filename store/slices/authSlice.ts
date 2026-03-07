import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";

import API from "@/api/axios";

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/login", credentials);
      const { token, user } = response.data;
   

      // Save token to SecureStore
      await SecureStore.setItemAsync("token", token);

      return { token, user };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// Async thunk to restore user on app start
export const restoreUser = createAsyncThunk(
  "auth/restoreUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return rejectWithValue("No token found");

      // Fetch current user using token
      const response = await API.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { token, user: response.data };
    } catch (err: any) {
      return rejectWithValue("Failed to restore user");
    }
  }
);

interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      SecureStore.deleteItemAsync("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Restore
      .addCase(restoreUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(restoreUser.rejected, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;