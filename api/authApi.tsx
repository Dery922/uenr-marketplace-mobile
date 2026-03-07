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

export const signupUser = (data) => API.post("/auth/register", data);