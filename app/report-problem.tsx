import { createReport } from "@/api/generalApi";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const ReportProblem = () => {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("bug");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const { targetId, targetType, targetTitle, targetImage } =
    useLocalSearchParams();
  const normalizedTargetId = Array.isArray(targetId) ? targetId[0] : targetId;
  const normalizedTargetType = Array.isArray(targetType)
    ? targetType[0]
    : targetType;
  const normalizedTargetTitle = Array.isArray(targetTitle)
    ? targetTitle[0]
    : targetTitle;
  const normalizedTargetImage = Array.isArray(targetImage)
    ? targetImage[0]
    : targetImage;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };


    const handleSubmit = async () => {
    // 1. Check description input field validation
    if (!description.trim()) {
      return Toast.show({
        type: "error",
        text1: "Description required",
        text2: "Please explain the issue",
      });
    }

    // 2. Comprehensive structural parameter fallback verification
    if (!normalizedTargetId || !normalizedTargetType) {
      return Toast.show({
        type: "error",
        text1: "Invalid report target",
        text2: "Missing target identification reference metadata.",
      });
    }

    try {
      setLoading(true);

      // Create a native Form Data instance required by your backend upload array middleware
      const formData = new FormData();

      // 1. Append your text and enum fields
      formData.append("description", description.trim());
      formData.append("category", category);
      formData.append("targetId", normalizedTargetId);
      
      // Ensure targetType matches what your backend database expects ('product' or 'user')
      const safeTargetType = normalizedTargetType.toLowerCase() === "hostel" || 
                             normalizedTargetType.toLowerCase() === "apartment" || 
                             normalizedTargetType.toLowerCase() === "product"
                             ? "product" 
                             : "user";
      formData.append("targetType", safeTargetType);

      // 2. Append the screenshot files into the "images" array expected by upload.array("images", 4)
      images.forEach((imageUri, index) => {
        // Extract the filename from the local device path string
        const filename = imageUri.split("/").pop();
        
        // Infer the file extension type dynamically
        const match = /\.(\w+)$/.exec(filename || "");
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        // Append to the same 'images' key name expected by multer
        formData.append("images", {
          uri: Platform.OS === "ios" ? imageUri.replace("file://", "") : imageUri,
          name: filename || `screenshot_${index}.jpg`,
          type,
        } as any); // Use 'as any' if inside a TypeScript environment to bypass structural checks
      });

      // 3. Fire the network request passing the formData bundle instead of plain JSON
      await createReport(formData);

      Toast.show({
        type: "success",
        text1: "Report submitted",
        text2: "We will review it shortly",
      });

      // Clear input fields on successful response mutation
      setDescription("");
      setImages([]);

      router.back();
    } catch (err) {
      console.error("CRITICAL REPORT SUBMIT ERR:", err);
      
      Toast.show({
        type: "error",
        text1: "Failed to submit report",
        // Safely parse nested Axios server responses if available
        text2: err.response?.data?.message || err.message || "Server connection timeout",
      });
    } finally {
      setLoading(false);
    }

  };


  // const handleSubmit = async () => {
  //   if (!description.trim()) {
  //     return Toast.show({
  //       type: "error",
  //       text1: "Description required",
  //       text2: "Please explain the issue",
  //     });
  //   }

  //   if (!normalizedTargetId || !normalizedTargetType) {
  //     return Toast.show({
  //       type: "error",
  //       text1: "Invalid report target",
  //     });
  //   }

  //   try {
  //     setLoading(true);

  //     const payload = {
  //       description,
  //       category,
  //       images,
  //       targetId: normalizedTargetId,
  //       targetType: normalizedTargetType,
  //     };

  //     await createReport(payload);

  //     Toast.show({
  //       type: "success",
  //       text1: "Report submitted",
  //       text2: "We will review it shortly",
  //     });

  //     setDescription("");
  //     setImages([]);

  //     router.back();
  //   } catch (err) {
  //     Toast.show({
  //       type: "error",
  //       text1: "Failed to submit report",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const categories = [
    {
      id: "bug",
      label: "Bug",
      icon: "bug-outline",
      color: "#3B82F6",
    },
    {
      id: "spam",
      label: "Spam",
      icon: "ban-outline",
      color: "#EF4444",
    },
    {
      id: "scam",
      label: "Scam",
      icon: "warning-outline",
      color: "#F59E0B",
    },
    {
      id: "abuse",
      label: "Abuse",
      icon: "hand-left-outline",
      color: "#EF4444",
    },
    {
      id: "other",
      label: "Other",
      icon: "ellipsis-horizontal-circle-outline",
      color: "#64748B",
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { flex: 1 }]}>
      <StatusBar barStyle="dark-content" />

      {/* 🔵 HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Report a Problem</Text>

        {/* Spacer to balance layout */}
        <View style={{ width: 40 }} />
      </View>

      {/* FIXED: Swapped targetImage with your safe normalized version to prevent crash */}
      {normalizedTargetImage && (
        <View style={styles.targetCard}>
          <Image source={{ uri: normalizedTargetImage }} style={styles.targetImage} />

          <View style={{ flex: 1 }}>
            <Text style={styles.targetLabel}>Reporting</Text>
            <Text style={styles.targetTitle} numberOfLines={1}>
              {normalizedTargetTitle}
            </Text>

            <Text style={styles.targetType}>
              {normalizedTargetType === "product"
                ? "Product Listing"
                : "User Account"}
            </Text>
          </View>
        </View>
      )}

      {/* 🟢 CONTENT CONTAINER WITH STABLE FLEX RENDERING */}
      <ScrollView
        style={[styles.content, { flex: 1 }]}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>Kindly describe your issue in detail</Text>

        <TextInput
          style={styles.input}
          placeholder="Tell us what went wrong..."
          multiline
          value={description}
          onChangeText={setDescription}
        />
        <Text style={styles.label}>Issue Type</Text>

        <View style={styles.categoryGrid}>
          {/* Ensure 'categories' variable is initialized correctly in Part 1 */}
          {categories && categories.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.categoryCard,
                category === item.id && {
                  backgroundColor: item.color,
                },
              ]}
              onPress={() => setCategory(item.id)}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={category === item.id ? "#fff" : item.color}
              />

              <Text
                style={[
                  styles.categoryText,
                  category === item.id && { color: "#fff" },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
          <Ionicons name="image-outline" size={18} color="#333" />
          <Text style={styles.imageText}> Attach Screenshot</Text>
        </TouchableOpacity>

        {/* Rendered Uploaded Attachments Grid cleanly */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 }}>
          {images.map((img, index) => (
            <View key={index} style={{ marginRight: 12, marginBottom: 12, alignItems: 'center' }}>
              <Image source={{ uri: img }} style={{ width: 100, height: 100, borderRadius: 8 }} />
              <TouchableOpacity 
                style={{ marginTop: 4, backgroundColor: '#EF4444', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }} 
                onPress={() => removeImage(index)}
              >
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: '700' }}>
            {loading ? "Submitting..." : "Submit Report"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );

};

export default ReportProblem;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  /* 🔵 HEADER */
  header: {
    height: 65,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#0EA5E9",
  },

  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },

  /* 🟢 CONTENT */
  content: {
    padding: 20,
  },

  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#475569",
    fontWeight: "600",
  },

  input: {
    height: 130,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 14,
    textAlignVertical: "top",
    backgroundColor: "#fff",
    marginBottom: 18,
    fontSize: 14,
  },

  /* 🟣 CATEGORY */
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },

  categoryBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#CBD5F5",
    backgroundColor: "#EEF2FF",
  },

  categorySelected: {
    backgroundColor: "#0EA5E9",
    borderColor: "#0EA5E9",
  },

  /* 🟡 IMAGE BUTTON */
  imageBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E2E8F0",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },

  imageText: {
    marginLeft: 6,
    color: "#334155",
    fontWeight: "500",
  },

  /* 🖼 IMAGE PREVIEW */
  preview: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    marginBottom: 10,
  },

  removeBtn: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },

  removeText: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "600",
  },

  /* 🔴 SUBMIT */
  submitBtn: {
    backgroundColor: "#0EA5E9",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    color: "#fff",
  },

  submitText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  targetCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
    elevation: 2,
  },

  targetImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#eee",
  },

  targetLabel: {
    fontSize: 12,
    color: "#64748B",
  },

  targetTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },

  targetType: {
    fontSize: 12,
    color: "#94A3B8",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 18,
  },

  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
});
