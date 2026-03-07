// app/(tabs)/index.js
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import TopBar from "@/components/TopBar";
import { theme } from "@/constants/theme"; // Create this file
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { getAllProducts } from "@/api/productApi";
import { useCallback, useState } from "react";
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  //Loading states start here
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  // const [products, setProducts] = useState([]);

  const navigation = useNavigation();
  const [notificationCount, setNotificationCount] = useState(3);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);

  // Data states
  // const [products, setProducts] = useState([]);
  // const [filteredProducts, setFilteredProducts] = useState([]);
  // const [categories, setCategories] = useState([]);

  // Product data

  // Categories with icons
  const categories = [
    { id: "all", label: "All", icon: "grid", color: "#1E3A8A" },
    { id: "books", label: "Books", icon: "book", color: "#1E3A8A" },
    {
      id: "electronics",
      label: "Electronics",
      icon: "phone-portrait",
      color: "#38B2AC",
    },
    { id: "clothing", label: "Clothing", icon: "shirt", color: "#ED64A6" },
    { id: "accessories", label: "Accessories", icon: "bag", color: "#9F7AEA" },
    { id: "software", label: "Software", icon: "desktop", color: "#4299E1" },
    { id: "supplies", label: "Supplies", icon: "briefcase", color: "#ED8936" },
    { id: "appliances", label: "Appliances", icon: "tv", color: "#48BB78" },
  ];
  // Filter products
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  // const skeletonLayout = [
  //   { key: "image", width: "100%", height: 160, marginBottom: 10 },
  //   { key: "title", width: "70%", height: 20, marginBottom: 6 },
  //   { key: "price", width: "40%", height: 20, marginBottom: 20 },
  // ];

  useEffect(() => {
    const load = async () => {
      await new Promise((r) => setTimeout(r, 2000)); // simulate API
      const response = await getAllProducts();
      console.log(response.data.allProducts);

      setProducts(response.data.allProducts);

      setLoading(false);
    };

    load();
  }, []);

  const handleNotificationPress = () => {
    Alert.alert("Notifications", "Opening notification center...");
    setNotificationCount(0);
  };

  const handleLocationPress = () => {
    Alert.alert("Change Campus", "Select your campus location...");
  };

  const handleSearch = (searchTerm) => {
    Alert.alert("Search", `Searching for: ${searchTerm}`);
  };

  const handleProductPress = useCallback((product) => {
    router.push({
      pathname: `/product/${product.id}`,
      params: { product: JSON.stringify(product) },
    });
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  return (
    <>
      <StatusBar style="light" backgroundColor="#00BFFF" translucent={false} />
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        {/* Top Bar */}
        <TopBar
          userName="Kwame Ansah"
          userStatus="Verified Student"
          campusLocation="Main Campus"
          notificationCount={notificationCount}
          onNotificationPress={handleNotificationPress}
          onLocationPress={handleLocationPress}
          onSearch={handleSearch}
          placeholder="Search textbooks, food, services..."
        />

        {/* Main Content */}
        <View style={styles.contentWrapper}>
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={["#00BFFF"]}
                tintColor="#00BFFF"
              />
            }
          >
            {/* White background with curved corners */}
            <View style={styles.whiteBackground}>
              {/* Welcome Section */}
              <View style={styles.welcomeSection}>
                <View style={styles.welcomeText}>
                  <Text style={styles.welcomeTitle} numberOfLines={1}>
                    UENR Marketplace 🎓
                  </Text>
                  <Text style={styles.welcomeSubtitle} numberOfLines={1}>
                    Buy & sell with verified campus members
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.sellButton}
                  onPress={() => router.push("/sell")}
                >
                  <Ionicons name="add-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.sellButtonText}>Sell</Text>
                </TouchableOpacity>
              </View>

              {/* Category Filters - Horizontal Scroll */}
              <View style={styles.categorySection}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryContent}
                >
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryButton,
                        selectedCategory === category.id &&
                          styles.categoryButtonActive,
                        { borderColor: category.color },
                      ]}
                      onPress={() => setSelectedCategory(category.id)}
                    >
                      <Ionicons
                        name={category.icon}
                        size={20}
                        color={
                          selectedCategory === category.id
                            ? "#FFFFFF"
                            : category.color
                        }
                      />
                      <Text
                        style={[
                          styles.categoryButtonText,
                          selectedCategory === category.id &&
                            styles.categoryButtonTextActive,
                        ]}
                      >
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Products Header */}
              <View style={styles.productsHeader}>
                <View>
                  <Text style={styles.productsTitle}>
                    {selectedCategory === "all"
                      ? "All Listings"
                      : categories.find((c) => c.id === selectedCategory)
                          ?.label}
                  </Text>
                  <Text style={styles.productCount}>
                    {filteredProducts.length}{" "}
                    {filteredProducts.length === 1 ? "item" : "items"}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleProductPress(product)}
                  style={styles.sortButton}
                  onPress={() => Alert.alert("Sort", "Sort options")}
                >
                  <Ionicons name="funnel" size={18} color="#1E3A8A" />
                  <Text style={styles.sortText}>Filter</Text>
                </TouchableOpacity>
              </View>

              {/* Products Grid */}
              <View style={styles.productsGrid}>
                {loading ? (
                  <>
                    <ProductSkeleton />
                    <ProductSkeleton />
                    <ProductSkeleton />
                    <ProductSkeleton />
                  </>
                ) : (
                  products.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onPress={() => handleProductPress(p)}
                    />
                  ))
                )}
              </View>

              {/* Campus Safety Tip */}
              <View style={styles.safetyTip}>
                <Ionicons name="shield-checkmark" size={24} color="#38A169" />
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Safety First</Text>
                  <Text style={styles.tipText}>
                    Always meet in public campus spots like the library or
                    cafeteria.
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  whiteBackground: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
    minHeight: "100%",
  },
  welcomeSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A365D",
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#718096",
  },
  sellButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E3A8A",

    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    flexShrink: 0, // ✅ VERY IMPORTANT
  },

  sellButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryContent: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#F1F5F9",
    borderRadius: 200,
    marginRight: 10,
    borderWidth: 0,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryButtonActive: {
    backgroundColor: "#00BFFF",
    borderColor: "#00BFFF",
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A5568",
  },
  categoryButtonTextActive: {
    color: "#FFFFFF",
  },
  productsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  productsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A365D",
  },
  productCount: {
    fontSize: 14,
    color: "#718096",
    marginTop: 2,
  },
  welcomeText: {
    flex: 1,
    paddingRight: 12,
  },

  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  sortText: {
    fontSize: 14,
    color: "#1E3A8A",
    fontWeight: "600",
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  safetyTip: {
    flexDirection: "row",
    backgroundColor: "rgba(56, 161, 105, 0.1)",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginBottom: 30,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(56, 161, 105, 0.2)",
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2F855A",
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: "#38A169",
    lineHeight: 20,
  },
});
