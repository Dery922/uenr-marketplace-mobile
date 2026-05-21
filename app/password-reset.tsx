import { requestPasswordResetOtp } from '@/api/authApi';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      Toast.show({
        type: 'error',
        text1: 'Email required',
        text2: 'Enter the email you registered with.',
      });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid email',
        text2: 'Enter a valid email address.',
      });
      return;
    }

    setLoading(true); 
    try {
      await requestPasswordResetOtp(normalizedEmail);
      Toast.show({
        type: 'success',
        text1: 'Check your email',
        text2: 'We sent a verification code.',
      });
      router.push({
        pathname: '/verify-reset',
        params: { email: normalizedEmail },
      });
    } catch (err: unknown) {
      let message = 'Could not send code. Try again.';
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        if (typeof data === 'string') {
          message = data;
        } else if (data && typeof data === 'object') {
          const maybeData = data as { message?: string; error?: string };
          message = maybeData.message || maybeData.error || message;
        } else if (err.message) {
          message = err.message;
        }
      } else if (err instanceof Error && err.message) {
        message = err.message;
      }
      Toast.show({ type: 'error', text1: 'Request failed', text2: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Reset Password</Text>

        <View style={{ width: 40 }} />
      </View>

      {/* CONTENT */}
      <View style={styles.content}>

        <Text style={styles.title}>Forgot your password?</Text>
        <Text style={styles.subtitle}>
          Enter your email and we’ll send you a verification code.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleReset}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send verification code</Text>
          )}
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },

  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#00BFFF',
  },

  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems:'center',
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },

  content: {
    padding: 20,
    alignItems: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A365D',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 14,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 20,
  },

  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 20,
  },

  button: {
    width: '100%',
    backgroundColor: '#00BFFF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});