import React from "react";
import { StyleSheet, View } from "react-native";

export default function ProductSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.image} />
      <View style={styles.lineLarge} />
      <View style={styles.lineSmall} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
      width: 160,
    
  },
  image: {
    height: 160,
    backgroundColor: "#E2E8F0",
    borderRadius: 8,
  },
  lineLarge: {
    height: 18,
    backgroundColor: "#E2E8F0",
    marginTop: 12,
    width: "70%",
    borderRadius: 4,
  },
  lineSmall: {
    height: 18,
    backgroundColor: "#E2E8F0",
    marginTop: 6,
    width: "40%",
    borderRadius: 4,
  },
});
