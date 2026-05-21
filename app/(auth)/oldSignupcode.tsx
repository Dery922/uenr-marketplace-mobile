// app/(auth)/signin.tsx
import { signupUser } from "@/api/authApi";
import CustomButton from "@/components/CustomButton";
import { signupSchema } from "@/utils/validations/loginSchema";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";

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
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function SignInScreen() {
  const router = useRouter();
  const [studentID, setStudentID] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [terms, setTerms] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<
    "Weak" | "Medium" | "Strong" | ""
  >("");
  const [hidePassword, setHidePassword] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmpasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const uploadProgress = useRef(0);

  type RegisterErrors = {
    fullName?: string[];
    email?: string[];
    studentID?: string[];
    phoneNumber?: string[];
    password?: string[];
  };

  //validation errors and loading states here
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const profileSource = require("../../assets/images/images.png");
  const campusLogoSource = require("../../assets/images/logo.png");

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

    // ✅ Valid — continue login
    setLoading(true);

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("studentID", studentID);
      formData.append("phoneNumber", phoneNumber);
      formData.append("password", password);

      // ✅ Add image
      if (image) {
        formData.append("avatar", {
          uri: image,
          name: "profile.jpg",
          type: "image/jpeg",
        } as any);
      }

      const response = await signupUser(formData);

      const token = response.data.token;

      router.replace("/(tabs)");
    } catch (error: any) {
      console.log("AXIOS ERROR:", error);
      console.log("RESPONSE DATA:", error?.response?.data);
      console.log("STATUS:", error?.response?.status);

      Alert.alert(
        "Register Error",
        error?.response?.data?.message || "Unknown error",
      );
    } finally {
      setLoading(false);
    }

    setLoading(false);
  };
  // Replace the pickImage function with this enhanced version
  const pickImage = async () => {
    try {
      // Request permission
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant permission to access your photos to upload a profile picture.",
          [{ text: "OK" }],
        );
        return;
      }

      setIsUploading(true);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        uploadProgress.current = Math.min(uploadProgress.current + 10, 90);
      }, 100);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8, // Slightly lower for better performance
        allowsMultipleSelection: false,
      });

      clearInterval(progressInterval);
      uploadProgress.current = 100;

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);

        // Simulate completion
        setTimeout(() => {
          setIsUploading(false);
          uploadProgress.current = 0;
        }, 300);
      } else {
        setIsUploading(false);
        uploadProgress.current = 0;
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
      setIsUploading(false);
      uploadProgress.current = 0;
    }
  };

  //getting password strength
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return "Weak";
    if (score === 3 || score === 4) return "Medium";
    return "Strong";
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <Image style={styles.logo} source={campusLogoSource} />
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={30} // adjust if needed
      >
        <ScrollView
          style={styles.middleSection}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 200,
            flexGrow: 1,
          }}
        >
          <View style={styles.info}>
            <Text style={styles.subtitle}>REGISTRATION</Text>
            <Text style={styles.infoText}>Create an account</Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.label}>Fullname</Text>
            <View>
              <TextInput
                placeholder="Enter your fullname"
                style={[styles.input, errors.email && styles.inputError]}
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  setErrors((prev) => ({ ...prev, fullName: undefined }));
                }}
                autoCapitalize="none"
                keyboardType="default"
              />
              {errors.fullName && (
                <Text style={styles.errorText}>{errors.fullName[0]}</Text>
              )}
            </View>

            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Enter your email"
              style={[styles.input, errors.email && styles.inputError]}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email[0]}</Text>
            )}

            <Text style={styles.label}>Student ID</Text>
            <TextInput
              placeholder="Enter your student id"
              style={[styles.input, errors.studentID && styles.inputError]}
              value={studentID}
              onChangeText={(text) => {
                setStudentID(text);
                setErrors((prev) => ({ ...prev, studentID: undefined }));
              }}
              autoCapitalize="none"
              keyboardType="default"
            />
            {errors.studentID && (
              <Text style={styles.errorText}>{errors.studentID[0]}</Text>
            )}

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              placeholder="Enter your phone number"
              style={styles.input}
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text);
                setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
              }}
              autoCapitalize="none"
              keyboardType="default"
            />
            {errors.phoneNumber && (
              <Text style={styles.errorText}>{errors.phoneNumber[0]}</Text>
            )}

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                placeholder="Enter your password"
                style={styles.passwordInput}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordStrength(getPasswordStrength(text));

                  // Optional: live clear errors
                  setErrors((prev: any) => ({
                    ...prev,
                    password: undefined,
                    confirmPassword: undefined,
                  }));
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
                  color="#1E3A8A"
                />
              </TouchableOpacity>
            </View>

            {/* Show password strength */}
            {password.length > 0 && (
              <Text
                style={[
                  styles.passwordStrength,
                  passwordStrength === "Weak"
                    ? { color: "red" }
                    : passwordStrength === "Medium"
                      ? { color: "orange" }
                      : { color: "green" },
                ]}
              >
                Password Strength: {passwordStrength}
              </Text>
            )}

            {/* Inline password error */}
            {errors.password && (
              <Text style={styles.errorText}>{errors.password[0]}</Text>
            )}

            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                placeholder="Confirm password"
                style={styles.passwordInput}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);

                  // Optional: live clear confirm password error
                  setErrors((prev: any) => ({
                    ...prev,
                    confirmPassword: undefined,
                  }));
                }}
                secureTextEntry={!confirmpasswordVisible}
                autoCapitalize="none"
                placeholderTextColor="#94A3B8"
              />

              <TouchableOpacity
                onPress={() =>
                  setConfirmPasswordVisible(!confirmpasswordVisible)
                }
                style={styles.eyeButton}
              >
                <Ionicons
                  name={confirmpasswordVisible ? "eye" : "eye-off"}
                  size={22}
                  color="#1E3A8A"
                />
              </TouchableOpacity>
              {/* Inline confirm password error */}
            </View>
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword[0]}</Text>
            )}

            <View style={styles.uploadSection}>
              <Text style={styles.uploadText}>Upload Profile Photo</Text>
              <Text style={styles.uploadSubtext}>
                Recommended: Square image, max 5MB
              </Text>

              <TouchableOpacity
                onPress={pickImage}
                disabled={isUploading}
                style={styles.avatarContainer}
                activeOpacity={0.7}
                accessibilityLabel="Upload profile picture"
                accessibilityHint="Tap to choose a photo from your gallery"
              >
                <View style={styles.avatarWrapper}>
                  <Image
                    source={
                      image
                        ? { uri: image }
                        : require("../../assets/images/images.png")
                    }
                    style={[
                      styles.avatar,
                      isUploading && styles.avatarUploading,
                    ]}
                    resizeMode="cover"
                  />

                  {/* Upload overlay icon */}
                  <View style={styles.editIcon}>
                    <Ionicons
                      name={isUploading ? "cloud-upload" : "camera"}
                      size={20}
                      color="#fff"
                    />
                  </View>

                  {/* Progress indicator */}
                  {isUploading && (
                    <View style={styles.progressOverlay}>
                      <View
                        style={[
                          styles.progressBar,
                          { width: `${uploadProgress.current}%` },
                        ]}
                      />
                      <Text style={styles.progressText}>
                        {uploadProgress.current < 100
                          ? "Uploading..."
                          : "Processing..."}
                      </Text>
                    </View>
                  )}

                  {/* Remove image button */}
                  {image && !isUploading && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => {
                        Alert.alert(
                          "Remove Photo",
                          "Are you sure you want to remove your profile picture?",
                          [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Remove",
                              style: "destructive",
                              onPress: () => setImage(null),
                            },
                          ],
                        );
                      }}
                    >
                      <Ionicons name="close" size={16} color="#fff" />
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>

              {!image && (
                <Text style={styles.helperText}>
                  Tap the camera icon to upload a photo
                </Text>
              )}
            </View>

            <View style={styles.termsContainer}>
              <View style={styles.termsRow}>
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    value={terms}
                    onValueChange={(value) => {
                      setTerms(value);
                      setErrors((prev) => ({ ...prev, terms: undefined }));
                    }}
                    color={terms ? "#1E3A5F" : undefined}
                  />

                  <Text style={styles.termsText}>I accept the</Text>
                </View>

                <TouchableOpacity onPress={() => console.log("Terms pressed")}>
                  <Text style={styles.termsLink}>terms and conditions</Text>
                </TouchableOpacity>

                <Text style={styles.termsText}>as well as the</Text>

                <TouchableOpacity
                  onPress={() => console.log("Privacy pressed")}
                >
                  <Text style={styles.termsLink}>privacy policy</Text>
                </TouchableOpacity>

                <Text style={styles.termsText}>of this application</Text>
              </View>

              {/* ✅ Error goes here */}
              {errors.terms && (
                <Text style={styles.errorText}>{errors.terms[0]}</Text>
              )}
            </View>

            <CustomButton
              title="Register"
              onPress={handleRegister}
              style={styles.loginButton}
              textStyle={styles.buttonText}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.buttonSection}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <CustomButton
          title="Login"
          onPress={() => router.push("/(auth)/SigninScreen")}
          style={styles.signupButton}
          textStyle={styles.signupButtonText}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  topSection: {
    height: height * 0.2,
    backgroundColor: "#00BFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  middleSection: {
    flex: 1,
    paddingTop: 20,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    zIndex: 9999,
  },
  buttonSection: {
    paddingHorizontal: 16,
    paddingBottom: 50,
    alignItems: "center",
  },
  box: {
    marginHorizontal: 16,
    marginTop: 0, // Reduced from 10 to 0
  },
  avatar: {
    width: 10,
    height: 10,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#18048b",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  info: {
    marginHorizontal: 16,
    marginBottom: 10, // Reduced from 20 to 10
    marginTop: 0, // Add this to ensure it starts at the top
  },
  uploadText: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  termsContainer: {
    marginTop: 20,
    marginBottom: 24,
  },

  termsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 6,
  },

  termsText: {
    color: "#374151",
    fontSize: 14,
    marginRight: 4,
  },

  termsLink: {
    color: "#18048b",
    fontWeight: "600",
    fontSize: 14,
    textDecorationLine: "underline",
    marginHorizontal: 4,
  },

  avatarContainer: {
    marginTop: 12,
    alignItems: "center",
  },

  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#18048b",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  uploadSection: {
    marginTop: 20,
    alignItems: "center",
  },

  uploadSubtext: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 16,
  },

  avatarWrapper: {
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },

  avatarUploading: {
    opacity: 0.7,
  },

  progressOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    height: 30,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },

  progressBar: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    backgroundColor: "#18048b",
    opacity: 0.5,
  },

  progressText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
    zIndex: 1,
  },

  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(239, 68, 68, 0.9)",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },

  helperText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 8,
    fontStyle: "italic",
  },

  infoText: {
    fontSize: 28, // Reduced from 32
    fontWeight: "900",
    color: "#1E293B",
    letterSpacing: 0.5,
    marginBottom: 4, // Reduced from 8
  },
  subtitle: {
    fontSize: 14, // Reduced from 16
    color: "#18048b",
    marginBottom: 8, // Add this to create some space below
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6, // Reduced from 8
    marginTop: 12, // Reduced from 16
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1E293B",
  },
  forgotPassword: {
    color: "#18048b",
    fontWeight: "600",
    fontSize: 14,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 6,
    paddingHorizontal: 12,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1E293B",
  },
  loginButton: {
    backgroundColor: "#18048b",
    borderRadius: 6,
    paddingVertical: 16,
  },
  eyeButton: {
    paddingLeft: 10,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 55,
    backgroundColor: "white",
  },
  errorText: {
    color: "#DC2626", // clean red (Tailwind-style red)
    fontSize: 12,
    marginTop: 4,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  footerText: {
    color: "#64748B",
    fontSize: 14,
    marginBottom: 12,
  },
  signupButton: {
    backgroundColor: "#00004d",
    borderColor: "#00004d",
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 16,
    width: "100%",
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  
});
