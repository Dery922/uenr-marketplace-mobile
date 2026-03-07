import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

const CustomButton = ({
  onPress,
  title,
  style,
  textStyle,
  loading,
  disabled = false,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.buttonContainer,
        style,
        pressed && !disabled && styles.buttonPressed,
        disabled && styles.buttonDisabled,
      ]}
      android_ripple={disabled ? null : { color: "#ddd" }}
    >

      {loading ? (
        <ActivityIndicator color="#000" />
      ) : (
        <Text style={[styles.buttonText, textStyle, disabled && styles.textDisabled]}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    elevation: 8,
    backgroundColor: "#007bff",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 10,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    backgroundColor: "#fff", // gray
    elevation: 0,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
  },
  textDisabled: {
    color: "#E5E7EB",
  },
});

export default CustomButton;
