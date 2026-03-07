import CustomButton from "@/components/CustomButton";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

export default function LandingScreen() {
  const campusLogoSource = require("../../assets/images/campusLogo.png");

  //create animated values for each word
  const tabAnim = useRef(new Animated.Value(0)).current;
  const tradeAnim = useRef(new Animated.Value(0)).current;
  const goAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimationLoop = () => {
      // Reset all animations to start
      tabAnim.setValue(0);
      tradeAnim.setValue(0);
      goAnim.setValue(0);

      Animated.sequence([
        // Animate "Tab"
        Animated.timing(tabAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        // Wait a bit, then animate "Trade"
        Animated.delay(200),
        Animated.timing(tradeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        // Wait a bit, then animate "Go"
        Animated.delay(200),
        Animated.timing(goAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        // Hold all words visible for a moment
        Animated.delay(1500),
        // Fade out all words together
        Animated.parallel([
          Animated.timing(tabAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(tradeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(goAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        // Pause before restarting
        Animated.delay(500),
      ]).start(() => {
        // Loop the animation
        startAnimationLoop();
      });
    };

    startAnimationLoop();

    // Cleanup animation on unmount
    return () => {
      tabAnim.stopAnimation();
      tradeAnim.stopAnimation();
      goAnim.stopAnimation();
    };
  }, []);

  // Interpolate animations for scale and opacity
  const tabStyle = {
    opacity: tabAnim,
    transform: [
      {
        scale: tabAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.7, 1],
        }),
      },
      {
        translateY: tabAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0], // Moves from bottom to original position
        }),
      },
    ],
  };

  const tradeStyle = {
    opacity: tradeAnim,
    transform: [
      {
        scale: tradeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.7, 1],
        }),
      },
      {
        translateY: tradeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
    ],
  };

  const goStyle = {
    opacity: goAnim,
    transform: [
      {
        scale: goAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.7, 1],
        }),
      },
      {
        translateY: goAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.topSection}>
          <View style={styles.logoContainer}>
            <Image style={styles.logo} source={campusLogoSource} />
            <View style={styles.textContainer}>
              <Animated.Text style={styles.appName}>UENR</Animated.Text>
              <Animated.Text style={styles.appName}>MARKETPLACE</Animated.Text>
              <View>
                <Animated.Text style={[styles.sloganWord, tabStyle]}>
                  Tab •
                </Animated.Text>
                {/* <Text style={styles.sloganDot}> • </Text> */}
                <Animated.Text style={[styles.sloganWord, tradeStyle]}>
                  Trade •
                </Animated.Text>
                {/* <Text style={styles.sloganDot}> • </Text> */}
                <Animated.Text style={[styles.sloganWord, goStyle]}>
                  Go •
                </Animated.Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.middle}></View>

        <View style={styles.bottomContainer}>
          <View style={styles.bottom2}>
            <Text>Don't have an account yet?</Text>
          </View>

          <View>
            <CustomButton
              title="Sign in with email"
              onPress={() => router.push("/(auth)/SignupScreen")}
              style={{ backgroundColor: "#0A192F" }}
            />
          </View>
          <View style={styles.bottom2}>
            <Text>Already a member? </Text>
            <Text>Login</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5feff",
  },
  innerContainer: {
    flex: 1,
    margin: 14,
  },
  topSection: {
    flex: 20,
    margin: 25,
  },
  topSection2: {
    margin: 8,
  },
  appName: {
    fontSize: 28,
    fontWeight: "800", // "900" might be too heavy on some devices
    color: "#666",
    letterSpacing: 0.5,
  },
  bottom1: {},

  sloganWord: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A90E2", // Blue color, change as needed
  },

  sloganDot: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginHorizontal: 4,
  },
  logo: {
    width: 48,
    height: 48,
    resizeMode: "contain", // Ensures logo scales properly
  },
  logoContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 3,
    paddingVertical: 20,
  },

  tagLine: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    marginTop: 4,
    letterSpacing: 1,
  },
  textContainer: {
    flexDirection: "column",
  },
  middle: {
    flex: 60,
  },
  bottomContainer: {
    flex: 20,
    flexDirection: "column",
    marginBottom: 19,
  },
  bottom2: {
    flexDirection:  "row",
    justifyContent: "center",
    alignItems: "center",
  },

  // Animation styles part
});
