import {
  requestPasswordResetOtp,
  verifyPasswordResetOtp,
} from "@/api/authApi";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const OTP_LENGTH = 6;

export default function VerifyResetScreen() {
  const params = useLocalSearchParams<{ email?: string | string[] }>();
  const email =
    typeof params.email === "string"
      ? params.email
      : Array.isArray(params.email)
        ? params.email[0]
        : "";

  const [otp, setOtp] = useState<string[]>(() =>
    Array(OTP_LENGTH).fill(""),
  );
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputsRef = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Missing email",
        text2: "Go back and enter your email.",
      });
      router.back();
    }
  }, [email]);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setInterval(() => setTimer((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      Toast.show({
        type: "error",
        text1: "Invalid code",
        text2: `Enter the full ${OTP_LENGTH}-digit code.`,
      });
      return;
    }
    setLoading(true);
    try {
      await verifyPasswordResetOtp(email, code);
      Toast.show({
        type: "success",
        text1: "Verified",
        text2: "Set your new password.",
      });
      router.push({
        pathname: "/new-password",
        params: { email },
      });
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
          ? String((err.response.data as { message?: string }).message)
          : "Could not verify code.";
      Toast.show({ type: "error", text1: "Verification failed", text2: message });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || timer > 0) return;
    setResending(true);
    try {
      await requestPasswordResetOtp(email);
      setTimer(60);
      setOtp(Array(OTP_LENGTH).fill(""));
      Toast.show({
        type: "success",
        text1: "Code sent",
        text2: "Check your email for a new OTP.",
      });
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
          ? String((err.response.data as { message?: string }).message)
          : "Could not resend code.";
      Toast.show({ type: "error", text1: "Resend failed", text2: message });
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify code</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>
          We sent a {OTP_LENGTH}-digit code to{"\n"}
          <Text style={styles.emailText}>{email || "—"}</Text>
        </Text>

        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(r) => {
                inputsRef.current[index] = r;
              }}
              style={styles.otpCell}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(v) => handleChange(v, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Verify & continue</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendRow}>
          {timer > 0 ? (
            <Text style={styles.resendHint}>Resend code in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResend} disabled={resending}>
              {resending ? (
                <ActivityIndicator color="#00BFFF" />
              ) : (
                <Text style={styles.resendLink}>Resend OTP</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#00BFFF",
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A365D",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#4A5568",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  emailText: {
    fontWeight: "600",
    color: "#1A365D",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  otpCell: {
    width: 44,
    height: 52,
    borderWidth: 1,
    borderColor: "#CBD5E0",
    borderRadius: 12,
    backgroundColor: "#fff",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#1A365D",
  },
  button: {
    width: "100%",
    backgroundColor: "#00BFFF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  resendRow: {
    marginTop: 20,
    minHeight: 24,
    justifyContent: "center",
  },
  resendHint: {
    fontSize: 14,
    color: "#718096",
  },
  resendLink: {
    fontSize: 15,
    fontWeight: "600",
    color: "#00BFFF",
  },
});
