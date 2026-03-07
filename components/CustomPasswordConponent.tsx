import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
// Using MaterialCommunityIcons as an example
import Icon from "react-native-vector-icons";

const PasswordInput = (props) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [rightIcon, setRightIcon] = useState("eye-off"); // Initial icon

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
    // Change icon name based on visibility state
    setRightIcon(hidePassword ? "eye" : "eye-off");
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        {...props} // Pass through other props like placeholder, value, onChangeText, etc.
        secureTextEntry={hidePassword} // Toggle secureTextEntry prop
        style={styles.input}
      />
      <TouchableOpacity
        onPress={togglePasswordVisibility}
        style={styles.visibilityBtn}
      >
        <Icon name={rightIcon} size={25} color="#888" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    paddingRight: 10,
    height: 50,
  },

  input: {
    flex: 1, // Takes up remaining space
    height: "100%",
    paddingLeft: 10,
  },
  visibilityBtn: {
    padding: 5, // Makes the icon easier to press
  },
});

export default PasswordInput;
