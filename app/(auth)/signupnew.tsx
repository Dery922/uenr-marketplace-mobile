import CustomButton from "@/components/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert, Dimensions, Image, KeyboardAvoidingView, Platform,
    ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
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
  const [terms, setTerms] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [passwordVisible, setPasswordVisible] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "We need access to photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true, aspect: [1, 1], quality: 0.7,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      {/* 🔷 DUAL BACKGROUND (Matches Login) */}
      <View style={[styles.topSection, { height: height * 0.45 }]} />
      <View style={[styles.box, { height: height * 0.55 }]} />

      {/* 🔷 SVG CURVE (Matches Login) */}
      <View style={[styles.svgProtector, { top: height * 0.45 - 75 }]}>
        <Svg height={150} width={width} viewBox={`0 0 ${width} 370`} preserveAspectRatio="none">
          <Path d={`M0 190 Q${width / 2} 370 ${width} 332 L${width} 0 L0 0 Z`} fill="#00BFFF" />
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

            {/* Avatar Picker (Over the Blue) */}
            <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
              <View style={styles.avatarCircle}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.avatarImage} />
                ) : (
                  <Ionicons name="person" size={40} color="#00BFFF" />
                )}
              </View>
              <View style={styles.cameraBadge}><Ionicons name="camera" size={14} color="#FFF" /></View>
            </TouchableOpacity>

            {/* Inputs (Matching Login White Input Style) */}
            <LabelText>Full Name</LabelText>
            <TextInput style={styles.input} placeholder="Kofi Mensah" value={fullName} onChangeText={setFullName} placeholderTextColor="#94A3B8" />

            <LabelText>Campus Email</LabelText>
            <TextInput style={styles.input} placeholder="student@uenr.edu.gh" value={email} onChangeText={setEmail} keyboardType="email-address" placeholderTextColor="#94A3B8" />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <LabelText>Student ID</LabelText>
                <TextInput style={styles.input} placeholder="204..." value={studentID} onChangeText={setStudentID} placeholderTextColor="#94A3B8" />
              </View>
              <View style={{ flex: 1 }}>
                <LabelText>Phone</LabelText>
                <TextInput style={styles.input} placeholder="054..." value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" placeholderTextColor="#94A3B8" />
              </View>
            </View>

            <LabelText>Password</LabelText>
            <View style={styles.passwordWrapper}>
              <TextInput 
                style={styles.passwordInput} 
                placeholder="••••••••" 
                secureTextEntry={!passwordVisible} 
                value={password} 
                onChangeText={setPassword}
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                <Ionicons name={passwordVisible ? "eye" : "eye-off"} size={22} color="#1E3A8A" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.checkedRow} onPress={() => setTerms(!terms)}>
              <Checkbox value={terms} onValueChange={setTerms} color={terms ? "#1E3A8A" : undefined} />
              <Text style={{ color: "#fff", fontSize: 13 }}>I agree to the Terms & Conditions</Text>
            </TouchableOpacity>

            <CustomButton
              title={loading ? "Registering..." : "Sign Up"}
              style={styles.signupButtons}
              textStyle={styles.signupButtonText}
            />
          </View>

          <View style={styles.bottomContent}>
            <Text style={styles.bottomText}>Already have an account?</Text>
            <CustomButton
              title="Sign in instead"
              onPress={() => router.push("/(auth)/SigninScreen")}
              style={styles.loginButton}
              textStyle={styles.loginButtonText}
            />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const LabelText = ({ children }: any) => <Text style={styles.label}>{children}</Text>;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E2E8F0" },
  topSection: { backgroundColor: "#00BFFF" },
  box: { backgroundColor: "#E2E8F0", position: "absolute", bottom: 0, left: 0, right: 0 },
  svgProtector: { position: "absolute", left: 0, right: 0, height: 150, zIndex: 10 },
  contentArea: { ...StyleSheet.absoluteFillObject, zIndex: 20 },
  scrollContentContainer: { flexGrow: 1 },
  topContent: { paddingHorizontal: 25 },
  mainTitle: { color: '#FFF', fontSize: 24, fontWeight: '800', textAlign: 'center', marginBottom: 15 },
  avatarContainer: { alignSelf: "center", marginBottom: 20 },
  avatarCircle: { width: 85, height: 85, borderRadius: 45, backgroundColor: "#FFF", justifyContent: "center", alignItems: "center", overflow: "hidden" },
  avatarImage: { width: "100%", height: "100%" },
  cameraBadge: { position: "absolute", bottom: 0, right: 0, backgroundColor: "#1E3A8A", width: 28, height: 28, borderRadius: 14, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#FFF" },
  label: { fontSize: 13, fontWeight: "600", color: "#fff", marginBottom: 6, marginTop: 10 },
  input: { backgroundColor: "rgba(255, 255, 255, 0.95)", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: "#1E293B" },
  passwordWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.95)", borderRadius: 8, paddingHorizontal: 12 },
  passwordInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: "#1E293B" },
  checkedRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 15 },
  signupButtons: { backgroundColor: "#fff", borderRadius: 8, paddingVertical: 16, marginTop: 25 },
  signupButtonText: { color: "#000", fontSize: 16, fontWeight: "700", textAlign: "center" },
  bottomContent: { paddingHorizontal: 25, paddingVertical: 30, alignItems: 'center' },
  bottomText: { color: "#1E293B", marginBottom: 10 },
  loginButton: { backgroundColor: "#00004d", borderRadius: 8, paddingVertical: 16, width: "100%" },
  loginButtonText: { color: "#fff", fontSize: 16, fontWeight: "600", textAlign: "center" },
});
