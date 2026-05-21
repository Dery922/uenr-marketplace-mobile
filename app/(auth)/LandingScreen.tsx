import CustomButton from "@/components/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function LandingScreen() {
  const campusLogoSource = require("../../assets/images/logo.png");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const insets = useSafeAreaInsets();
  const dynamicGap = SCREEN_HEIGHT * 0.05;
  const texts = [
    "Skip the printing lines",
    "Turn your items into cash",
    "Negotiate in real-time",
    "Find your perfect hostel",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    animateText();
    const interval = setInterval(() => changeText(), 3000);
    return () => clearInterval(interval);
  }, []);

  const animateText = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const changeText = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
      translateY.setValue(20);
      animateText();
    });
  };

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom + 20, dynamicGap) },
      ]}
    >
      <View style={styles.innerContainer}>
        {/* 🔷 TOP SECTION */}
        <View style={styles.topSection}>
          <Image
            style={styles.logo}
            source={campusLogoSource}
            contentFit="contain"
          />
          <Text style={styles.heroTitle}>Marketplace</Text>
          <Text style={styles.heroSubtitle}>
            The all-in-one marketplace built specifically for your campus life.
          </Text>

          <View style={styles.animatedContainer}>
            <Ionicons name="sparkles" size={16} color="#00BFFF" />
            <Animated.Text
              style={[
                styles.animatedText,
                { opacity: fadeAnim, transform: [{ translateY }] },
              ]}
            >
              {texts[currentIndex]}
            </Animated.Text>
          </View>
        </View>

        {/* 🔷 MODERN FEATURES GRID */}
        <View style={styles.middleSection}>
          <View style={styles.featureGrid}>
            <FeatureItem
              icon="print"
              label="Printing"
              color="#E0F7FA"
              iconColor="#00BFFF"
            />
            <FeatureItem
              icon="cart"
              label="Shop"
              color="#F3E5F5"
              iconColor="#9C27B0"
            />
            <FeatureItem
              icon="chatbubbles"
              label="Chat"
              color="#E8F5E9"
              iconColor="#4CAF50"
            />
            <FeatureItem
              icon="business"
              label="Hostels"
              color="#FFF3E0"
              iconColor="#FF9800"
            />
          </View>
        </View>

        {/* 🔷 BOTTOM SECTION */}
        <View style={styles.bottomSection}>
          <CustomButton
            title="Create account"
            onPress={() => router.push("/(auth)/SignupScreen")}
            style={styles.ctaButton}
          />
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.push("/(auth)/SigninScreen")}
          >
            <Text style={styles.loginText}>
              Already a member? <Text style={styles.loginLink}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Helper Component for Features
const FeatureItem = ({ icon, label, color, iconColor }) => (
  <View style={styles.featureItem}>
    <View style={[styles.iconCircle, { backgroundColor: color }]}>
      <Ionicons name={icon} size={24} iconColor={iconColor} color={iconColor} />
    </View>
    <Text style={styles.featureLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "space-between",
  },
  topSection: { marginTop: 40, alignItems: "center" },
  logo: { width: 120, height: 120, marginBottom: 20 },
  heroTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1A1A1A",
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 24,
  },
  animatedContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
    gap: 8,
  },
  animatedText: { fontSize: 15, color: "#00BFFF", fontWeight: "700" },
  middleSection: { marginVertical: 30 },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },
  featureItem: {
    width: "47%",
    backgroundColor: "#F8FAFC",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureLabel: { fontSize: 14, fontWeight: "600", color: "#333" },
  bottomSection: { marginBottom: 40 },
  ctaButton: {
    backgroundColor: "#3B82F6",
    height: 58,
    borderRadius: 18,
    elevation: 0,
  },
  secondaryBtn: { marginTop: 20, alignItems: "center" },
  loginText: { color: "#666", fontSize: 15 },
  loginLink: { color: "#00BFFF", fontWeight: "700" },
});
