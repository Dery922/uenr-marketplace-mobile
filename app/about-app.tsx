import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AboutApp = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>About App</Text>

        <View style={{ width: 40 }} />
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        
        {/* App Logo */}
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.logo}
        />

        {/* App Name */}
        <Text style={styles.appName}>UENR Marketplace</Text>

        {/* Version */}
        <Text style={styles.version}>Version 1.0.0</Text>

        {/* Description */}
        <Text style={styles.description}>
          UENR Marketplace is a campus-based platform that allows students to
          buy and sell products easily within the university community.
          Connect, trade, and discover items safely with verified users.
        </Text>

        {/* Developer Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Developer</Text>
          <Text style={styles.cardText}>Built by: Dery Franklin : Engineer - SureLink</Text>
        </View>

        {/* Contact */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Support</Text>

          <TouchableOpacity onPress={() => Linking.openURL('mailto:support@uenrmarketplace.com')}>
            <Text style={styles.link}>📧 support@uenrmarketplace.com</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL('https://yourwebsite.com')}>
            <Text style={styles.link}>🌐 Visit Website</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          © 2026 UENR Marketplace. All rights reserved.
        </Text>

      </View>
    </SafeAreaView>
  );
};

export default AboutApp;

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
    alignItems: 'center',
    padding: 20,
  },

  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 12,
  },

  appName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A365D',
  },

  version: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 16,
  },

  description: {
    fontSize: 14,
    color: '#4A5568',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },

  card: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    color: '#1A365D',
  },

  cardText: {
    fontSize: 14,
    color: '#4A5568',
  },

  link: {
    fontSize: 14,
    color: '#00BFFF',
    marginTop: 6,
  },

  footer: {
    marginTop: 20,
    fontSize: 12,
    color: '#A0AEC0',
    textAlign: 'center',
  },
});