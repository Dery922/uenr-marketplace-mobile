import CustomButton from "@/components/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import { useState } from "react";

import { loginUser } from "@/store/slices/authSlice";
import { AppDispatch, RootState } from "@/store/store";

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";

export default function SigninScreen() {
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();
  const { width, height } = useWindowDimensions();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [localError, setLocalError] = useState("");


  const handleLogin = async () => {
    setLocalError("");

    if (!email || !password) {
      setLocalError("Please enter both email and password");
      return;
    }

    const resultAction = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(resultAction)) {
        router.replace("/(drawer)/(tabs)/home");
    } else {
      const message =
        resultAction.payload || "Invalid email or password";
      setLocalError(message);
    }
  };

  const isDisabled = !email || !password || loading;
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={[styles.container, {paddingTop:insets.top}]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Background */}
      <View style={[styles.topSection, { height: height * 0.7 }]} />
      <View style={[styles.box, { height: height * 0.3 }]} />

      {/* SVG Curve */}
      <View style={[styles.svgProtector, { top: height * 0.7 - 75 }]}>
        <Svg
          height={150}
          width={width}
          viewBox={`0 0 ${width} 370`}
          preserveAspectRatio="none"
        >
          <Path
            d={`M0 190 Q${width / 2} 370 ${width} 332 L${width} 0 L0 0 Z`}
            fill="#00BFFF"
          />
        </Svg>
      </View>

      {/* Content */}
      <View style={styles.contentArea}>
        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.topContent, { paddingTop: height * 0.25 }]}>
            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Enter your email"
              style={styles.input}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setLocalError("");
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#94A3B8"
            />

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                placeholder="Enter your Password"
                style={styles.passwordInput}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setLocalError("");
                }}
                secureTextEntry={!passwordVisible}
                autoCapitalize="none"
                placeholderTextColor="#94A3B8"
              />

              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={passwordVisible ? "eye" : "eye-off"}
                  size={22}
                  color="#3B82F6"
                />
              </TouchableOpacity>
            </View>

            {/* Error Message */}
            {(localError || error) && (
              <Text style={styles.errorText}>
                {localError || error}
              </Text>
            )}

            {/* Options */}
            <View style={styles.checkedRow}>
              <View style={styles.checkedStyle}>
                <Checkbox
                  value={checked}
                  onValueChange={setChecked}
                  color={checked ? "#1E3A8A" : undefined}
                />
                <Text style={{ color: "#000" }}>Remember me</Text>
              </View>

              <TouchableOpacity
                onPress={() => router.push("/(auth)/ForgotPassword")}
              >
                <Text style={{ color: "#000" }}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Button */}
            <CustomButton
              title={loading ? "Signing in..." : "Sign in"}
              onPress={handleLogin}
              loading={loading}
              disabled={isDisabled}
              style={[
                styles.signupButtons,
                isDisabled && { opacity: 0.5 }
              ]}
              textStyle={styles.signupButtonText}
            />
          </View>

          {/* Bottom */}
          <View style={styles.bottomContent}>
            <View style={styles.bottomContainer}>
              <Text style={styles.bottomText}>
                Don't have an account?
              </Text>
            </View>

            <CustomButton
              title="Sign up with email"
              onPress={() => router.push("/(auth)/SignupScreen")}
              style={styles.signupButton}
              textStyle={styles.signupButtonTexts}
            />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E2E8F0",
  },
  topSection: {
    backgroundColor: "#00BFFF",
  },
  box: {
    backgroundColor: "#E2E8F0",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  svgProtector: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 150,
    zIndex: 10,
  },
  contentArea: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  topContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#E2E8F0",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1E293B",
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1E293B",
  },
  eyeButton: {
    paddingHorizontal: 10,
  },
  errorText: {
    color: "#EF4444",
    marginTop: 10,
    fontSize: 14,
    fontWeight: "500",
  },
  checkedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },
  checkedStyle: {
    flexDirection: "row",
    gap: 6,
  },
  signupButtons: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 16,
    width: "100%",
    marginTop: 18,
  },
  signupButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  bottomContent: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 50 : 30,
    marginTop: 20,
  },
  bottomContainer: {
    alignItems: "center",
    marginTop: 15,
  },
  bottomText: {
    color: "#1E293B",
  },
  signupButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 24,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  signupButtonTexts: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});