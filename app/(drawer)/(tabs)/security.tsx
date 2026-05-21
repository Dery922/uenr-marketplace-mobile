import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Security = () => {

  const handleChangePassword = () => {
   router.push("/password-reset")
  };

  const handleLogoutAll = () => {
    Alert.alert(
      'Logout All Devices',
      'Are you sure you want to log out from all devices?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => console.log('Logged out all devices') }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Security</Text>

        <View style={{ width: 40 }} />
      </View>

      {/* CONTENT */}
      <View style={styles.content}>

        {/* Security Status Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Security</Text>

          <View style={styles.row}>
            <Ionicons name="checkmark-circle" size={20} color="#38A169" />
            <Text style={styles.cardText}>Your account is secure</Text>
          </View>
        </View>

        {/* Change Password */}
        <TouchableOpacity style={styles.option} onPress={handleChangePassword}>
          <View style={styles.optionLeft}>
            <Ionicons name="key-outline" size={22} color="#1E3A8A" />
            <Text  style={styles.optionText}>Change Password</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#A0AEC0" />
        </TouchableOpacity>

        {/* Active Sessions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Active Sessions</Text>

          <View style={styles.sessionItem}>
            <Text style={styles.sessionText}>📱 iPhone 13 - Accra</Text>
          </View>

          <View style={styles.sessionItem}>
            <Text style={styles.sessionText}>💻 Chrome - Windows</Text>
          </View>
        </View>

        {/* Logout All Devices */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogoutAll}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout from all devices</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

export default Security;

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
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    color: '#1A365D',
  },

  cardText: {
    fontSize: 14,
    color: '#4A5568',
    marginLeft: 8,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },

  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  optionText: {
    fontSize: 15,
    marginLeft: 10,
    color: '#1A365D',
    fontWeight: '600',
  },

  sessionItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },

  sessionText: {
    fontSize: 14,
    color: '#4A5568',
  },

  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: '#E53E3E',
    padding: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  logoutText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 8,
  },
});