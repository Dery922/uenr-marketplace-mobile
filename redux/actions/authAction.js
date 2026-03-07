import * as SecureStore from "expo-secure-store";

export const restoreUser = () => async (dispatch) => {
  const token = await SecureStore.getItemAsync("token");

  if (token) {
    dispatch({
      type: "RESTORE_USER",
      payload: token,
    });
  }
};
