import { signupUser } from "@/api/authApi";
import CustomButton from "@/components/CustomButton";
import { signupSchema } from "@/utils/validations/loginSchema";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

const { width, height } = Dimensions.get("window");

export default function SignUpScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [studentID, setStudentID] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [terms, setTerms] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [passwordVisible, setPasswordVisible] = useState(false);

  type RegisterErrors = {
    fullName?: string[];
    email?: string[];
    studentID?: string[];
    phoneNumber?: string[];
    password?: string[];
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "We need access to photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleRegister = async () => {
    const result = signupSchema.safeParse({
      fullName,
      email,
      studentID,
      phoneNumber,
      password,
      confirmPassword,
      terms,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("studentID", studentID);
      formData.append("phoneNumber", phoneNumber);
      formData.append("password", password);
      formData.append("role", "buyer");

      if (image) {
        formData.append("avatar", {
          uri: image,
          name: "profile.jpg",
          type: "image/jpeg",
        } as any);
      }

      const response = await signupUser(formData);
      const token = response.data.token;
      router.replace("/(drawer)/(tabs)/home");
    } catch (error: any) {
      console.log("AXIOS ERROR:", error);
      console.log("RESPONSE DATA:", error?.response?.data);
      console.log("STATUS:", error?.response?.status);

      Alert.alert(
        "Registration Failed",
        error?.response?.data?.message ||
          "An unexpected processing error occurred.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      {/* 🔷 DUAL BACKGROUND */}
      <View style={[styles.topSection, { height: height * 0.45 }]} />
      <View style={[styles.box, { height: height * 0.55 }]} />

      {/* 🔷 SVG CURVE */}
      <View style={[styles.svgProtector, { top: height * 0.45 - 75 }]}>
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

      {/* 🔷 SCROLLABLE CONTENT */}
      <View style={styles.contentArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.topContent, { paddingTop: height * 0.08 }]}>
            <Text style={styles.mainTitle}>Create Account</Text>

            {/* Avatar Picker */}
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={pickImage}
            >
              <View style={styles.avatarCircle}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.avatarImage} />
                ) : (
                  <Ionicons name="person" size={40} color="#00BFFF" />
                )}
              </View>
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={14} color="#FFF" />
              </View>
            </TouchableOpacity>

            {/* Form Fields */}
            <LabelText>Full Name</LabelText>
            <View>
              <TextInput
                style={[styles.input, errors.fullName && styles.inputError]}
                placeholder="Kofi Mensah"
                placeholderTextColor="#94A3B8"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  setErrors((prev) => ({ ...prev, fullName: undefined }));
                }}
                autoCapitalize="words"
              />
              {errors.fullName && (
                <Text style={styles.errorText}>
                  {Array.isArray(errors.fullName) ? errors.fullName[0] : errors.fullName}
                </Text>
              )}
            </View>

            <LabelText>Campus Email</LabelText>
            <View>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="student@uenr.edu.gh"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              {errors.email && (
                <Text style={styles.errorText}>
                  {Array.isArray(errors.email) ? errors.email[0] : errors.email}
                </Text>
              )}
            </View>

            <View style={styles.rowContainer}>
              <View style={styles.flexOne}>
                <LabelText>Student ID</LabelText>
                <TextInput
                  style={[styles.input, errors.studentID && styles.inputError]}
                  placeholder="UENR..."
                  placeholderTextColor="#94A3B8"
                  value={studentID}
                  onChangeText={(text) => {
                    setStudentID(text);
                    setErrors((prev) => ({ ...prev, studentID: undefined }));
                  }}
                  autoCapitalize="characters"
                />
                {errors.studentID && (
                  <Text style={styles.errorText}>
                    {Array.isArray(errors.studentID) ? errors.studentID[0] : errors.studentID}
                  </Text>
                )}
              </View>
              
              <View style={styles.flexOne}>
                <LabelText>Phone Number</LabelText>
                <TextInput
                  style={[styles.input, errors.phoneNumber && styles.inputError]}
                  placeholder="054 123 4567"
                  placeholderTextColor="#94A3B8"
                  value={phoneNumber}
                  onChangeText={(text) => {
                    setPhoneNumber(text);
                    setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
                  }}
                  keyboardType="phone-pad"
                />
                {errors.phoneNumber && (
                  <Text style={styles.errorText}>
                    {Array.isArray(errors.phoneNumber) ? errors.phoneNumber[0] : errors.phoneNumber}
                  </Text>
                )}
              </View>
            </View>

            <LabelText>Password</LabelText>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors((prev: any) => ({
                    ...prev,
                    password: undefined,
                    confirmPassword: undefined,
                  }));
                }}
              />
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                <Ionicons name={passwordVisible ? "eye" : "eye-off"} size={22} color="#3B82F6" />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>
                {Array.isArray(errors.password) ? errors.password[0] : errors.password}
              </Text>
            )}

            <LabelText>Confirm Password</LabelText>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm your password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!confirmPasswordVisible}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setErrors((prev: any) => ({ ...prev, confirmPassword: undefined }));
                }}
              />
              <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                <Ionicons name={confirmPasswordVisible ? "eye" : "eye-off"} size={22} color="#3B82F6" />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={styles.errorText}>
                {Array.isArray(errors.confirmPassword) ? errors.confirmPassword[0] : errors.confirmPassword}
              </Text>
            )}

            <TouchableOpacity 
              style={styles.checkedRow} 
              onPress={() => setTerms(!terms)}
              activeOpacity={0.7}
            >
              <Checkbox 
                value={terms} 
                onValueChange={setTerms} 
                color={terms ? "#3B82F6" : undefined}
              />
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text>
              </Text>
            </TouchableOpacity>
            {errors.terms && (
              <Text style={styles.errorText}>
                {Array.isArray(errors.terms) ? errors.terms[0] : errors.terms}
              </Text>
            )}

            <CustomButton
              title={loading ? "Creating Account..." : "Sign Up"}
              onPress={handleRegister}
              disabled={loading}
              style={styles.signupButton}
              textStyle={styles.signupButtonText}
            />
          </View>

          <View style={styles.bottomContent}>
            <Text style={styles.alreadyHaveAccountText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/SigninScreen")}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const LabelText = ({ children }: any) => (
  <Text style={styles.label}>{children}</Text>
);

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F8FAFC" 
  },
  topSection: { 
    backgroundColor: "#00BFFF" 
  },
  box: {
    backgroundColor: "#F8FAFC",
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
    zIndex: 20 
  },
  scrollContentContainer: { 
    flexGrow: 1,
    paddingBottom: 20,
  },
  topContent: { 
    paddingHorizontal: 24 
  },
  mainTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  avatarContainer: { 
    alignSelf: "center", 
    marginBottom: 24 
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarImage: { 
    width: "100%", 
    height: "100%" 
  },
  cameraBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "#3B82F6",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B", // Darker for better contrast
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0F172A",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputError: {
    borderColor: "#EF4444",
    borderWidth: 1.5,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0F172A",
  },
  rowContainer: {
    flexDirection: "row",
    gap: 12,
  },
  flexOne: {
    flex: 1,
  },
  checkedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
  },
  termsText: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "500",
  },
  termsLink: {
    color: "#3B82F6",
    fontWeight: "600",
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
  signupButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  bottomContent: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: "center",
    marginTop: 8,
  },
  alreadyHaveAccountText: { 
    color: "#64748B", 
    fontSize: 14,
    marginBottom: 8,
  },
  signInLink: {
    color: "#3B82F6",
    fontSize: 16,
    fontWeight: "700",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
});