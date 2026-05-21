import * as SecureStore from "expo-secure-store";
import API from "./axios";

export const loginUser = (data) => async (dispatch) => {
  try {
    dispatch({ type: "LOGIN_REQUEST" });

    const loginResponse = await signinUser(data);
    const token = loginResponse.data.token;

    await SecureStore.setItemAsync("token", token);

    const userResponse = await API.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch({
      type: "LOGIN_SUCCESS",
      payload: {
        user: userResponse.data,
        token,
      },
    });

  } catch (error) {
    dispatch({
      type: "LOGIN_FAIL",
      payload: error.response?.data?.message || "Login failed",
    });
  }
};

export const signinUser = (data) => {
  return API.post("/auth/login", data);
};

export const getCurrentUser = () => API.get("/auth/me");
export const updateCurrentUser = () => API.put("/update-user");

export const signupUser = (data) => API.post("/auth/register", data, {
     headers: {
      "Content-Type": "multipart/form-data",
    },
});

/**
 * Password reset (OTP flow). Mount these on your Express router under `/api/auth`:
 * - POST `/auth/forgot-password`  → `generateOtpCode`   body: `{ email }`
 * - POST `/auth/verify-otp`        → `verifyOtpEnd`      body: `{ email, otp }`
 * - POST `/auth/reset-password`    → handler that checks `otpStore` has `verified: true`,
 *   updates the user password, then deletes the OTP record.
 */
export const requestPasswordResetOtp = (email: string) =>
  API.post("/auth/forgot-password", { email });

export const verifyPasswordResetOtp = (email: string, otp: string) =>
  API.post("/auth/verify-otp", { email, otp });

export const resetPasswordAfterOtp = (email: string, password: string) =>
  API.post("/auth/reset-password", { email, password });


