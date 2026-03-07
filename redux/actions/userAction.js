import * as SecureStore from "expo-secure-store";
import { getCurrentUser, signinUser } from "../../api/authApi";

export const loginUser = (data) => async (dispatch) => {
  try {
    dispatch({ type: "LOGIN_REQUEST" });

    // 1️⃣ login
    const loginRes = await signinUser(data);

    const token = loginRes.data.token;

    // 2️⃣ save token
    await SecureStore.setItemAsync("token", token);

    // 3️⃣ get logged user
    const userRes = await getCurrentUser();

    // 4️⃣ store in redux
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: {
        user: userRes.data,
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
