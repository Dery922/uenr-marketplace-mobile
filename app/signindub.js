import CustomButton from "@/components/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

const { width, height } = Dimensions.get("window");

export default function SigninScreen() {
  const router = useRouter();
  const [username, setUsername] = useState < string > "";
  const [password, setPassword] = useState < string > "";
  const [checked, setChecked] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = () => {
    if (!username || !password) {
      alert("Please fill all fields");
      return;
    }
    console.log("Username:", username);
    console.log("Password:", password);
    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Background */}
      <View style={styles.topSection} />
      <View style={styles.box} />

      {/* SVG Curve */}
      <View style={styles.svgProtector}>
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

      {/* Content - NO nested KeyboardAvoidingView */}
      <View style={styles.contentArea}>
        {/* ScrollView to handle keyboard properly */}
        <View style={styles.scrollContent}>
          <View style={styles.topContent}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              placeholder="Enter your username"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                placeholder="Enter your Password"
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
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
                  color="#1E3A8A"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.checkedRow}>
              <View style={styles.checkedStyle}>
                <Checkbox
                  value={checked}
                  onValueChange={setChecked}
                  color={checked ? "#1E3A8A" : undefined}
                />
                <Text style={{ color: "#fff" }}>Remember me</Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/ForgotPassword")}
              >
                <Text style={{ color: "#fff" }}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <CustomButton
              title="Sign in"
              onPress={handleLogin}
              disabled={!username || !password}
              style={styles.signupButtons}
              textStyle={styles.signupButtonText}
            />
          </View>

          {/* Bottom content - Now part of the scrollable area */}
          <View style={styles.bottomContent}>
            <View style={styles.bottomContainer}>
              <Text style={styles.bottomText}>Don't have an account?</Text>
            </View>
            <CustomButton
              title="Sign up with email"
              onPress={() => router.push("/(auth)/SignupScreen")}
              style={styles.signupButton}
              textStyle={styles.signupButtonTexts}
            />
          </View>
        </View>
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
    height: height * 0.7,
    backgroundColor: "#00BFFF",
  },
  box: {
    height: height * 0.3,
    backgroundColor: "#E2E8F0",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  svgProtector: {
    position: "absolute",
    top: height * 0.7 - 75,
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
    justifyContent: "space-between",
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
  },
  topContent: {
    paddingHorizontal: 20,
    paddingTop: height * 0.25, // Adjusted from top:170 to paddingTop
    paddingBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1E293B",
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 6,
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
    justifyContent: "center",
    alignItems: "center",
  },
  checkedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    paddingHorizontal: 4,
  },
  checkedStyle: {
    flexDirection: "row",
    gap: 4,
    color: "#fff",
  },
  signupButtons: {
    backgroundColor: "#fff",
    color: "#000",
    borderRadius: 6,
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
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  bottomText: {
    color: "#1E293B",
  },
  signupButton: {
    backgroundColor: "#00004d",
    borderRadius: 6,
    paddingVertical: 16,
    width: "100%",
    marginTop: 18,
  },
  signupButtonTexts: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
