// screens/ProductDetailScreen.js
import { startConversation } from '@/api/chatApi';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  FlatList,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

const ProductDetailScreen = () => {
  let { product } = useLocalSearchParams();
  product = product ? JSON.parse(product as string) : null;
  const user = useSelector((state : any) => state.auth.user);
  const params = useLocalSearchParams();


  if (!user) return null;
 
  const isOwner = user?._id === product?.seller?._id;;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const insets = useSafeAreaInsets();

  const [hasPurchasedFromSeller, setHasPurchasedFromSeller] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const lastTap = useRef(null);



  const handleImageTap = () => {
  const now = Date.now();

  if (lastTap.current && (now - lastTap.current) < 300) {
    // DOUBLE TAP DETECTED
    setViewerVisible(true);
  }

  lastTap.current = now;
};



  // Simulate checking purchase history
useEffect(() => {
  // In real app, check your backend/database
  // For now, simulate random
  setHasPurchasedFromSeller(Math.random() > 0.5);
}, [product.sellerId]);

  
  // Animation refs
  const slideAnim = useRef(new Animated.Value(1000)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const imageScaleAnim = useRef(new Animated.Value(0.95)).current;

  const images = product?.images || [];

  // Start animations on mount
  useEffect(() => {
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Main image scale animation
    Animated.timing(imageScaleAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    // Bottom section slide up
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      easing: Easing.out(Easing.back(1)),
      useNativeDriver: true,
    }).start();

    // Content fade in with delay
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay: 300,
      useNativeDriver: true,
    }).start();
  };

  const shareProduct = async () => {
    try {
      await Share.share({
        message: `Check out this ${product.title} for ${product.price} on CampusMarket: ${product.description}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share product.');
    }
  };

  // In ProductDetailScreen.js - Update the chat button handler


const handleChatPress = async () => {
  try {
    

    const response = await startConversation({
      productId: product._id,
      receiverId: product.seller._id,
    });

    const conversation = response.data.conversation;

   console.log(params.product.title)

   router.push({
      pathname: `/chat/${conversation._id}`,
      params: {
        sellerName: product.seller.name,
        productTitle: product.title,
        productPrice: product.price,
        productImage: product.images?.[0] || '',
        productId: product._id,
      }
    
    });

  } catch (error) {
    console.error(error);
  }
};
  const callSeller = () => {
    Linking.openURL(`tel:${product.sellerPhone}`);
  };

  const reportItem = () => {
    Alert.alert(
      'Report Item',
      'Why are you reporting this item?',
      [
        { text: 'Spam', onPress: () => console.log('Reported as spam') },
        { text: 'Inappropriate', onPress: () => console.log('Reported as inappropriate') },
        { text: 'Wrong Category', onPress: () => console.log('Reported wrong category') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Handle gallery item press
  const handleGalleryItemPress = (index) => {
    setCurrentImageIndex(index);
    
    // Animate main image change
    imageScaleAnim.setValue(0.95);
    Animated.spring(imageScaleAnim, {
      toValue: 1,
      tension: 150,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  // Render gallery item
  const renderGalleryItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.galleryItem,
        index === currentImageIndex && styles.galleryItemActive,
      ]}
      onPress={() => handleGalleryItemPress(index)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item }}
        style={styles.galleryImage}
        contentFit="cover"
      />
      {index === currentImageIndex && (
        <View style={styles.selectedOverlay}>
          <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
        </View>
      )}
    </TouchableOpacity>
  );

  // Navigate back with animation
  const handleBackPress = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1000,
        duration: 400,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.back();
    });
  };

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Blue Section (20%) */}
      <View style={styles.topSection}>
        {/* Main Image Container with blue background */}
        <Animated.View 
          style={[
            styles.imageContainer,
            {
              transform: [{ scale: imageScaleAnim }]
            }
          ]}
        >
          
    

          {/* Navigation Buttons */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Image Indicators */}
          {images.length > 1 && (
            <View style={styles.imageIndicators}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.imageIndicator,
                    index === currentImageIndex && styles.imageIndicatorActive,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.imageActions}>
            <TouchableOpacity 
              style={styles.imageActionButton}
              onPress={() => {
                setIsSaved(!isSaved);
                // Add animation for save button
                Animated.sequence([
                  Animated.timing(imageScaleAnim, {
                    toValue: 1.02,
                    duration: 100,
                    useNativeDriver: true,
                  }),
                  Animated.spring(imageScaleAnim, {
                    toValue: 1,
                    tension: 150,
                    friction: 3,
                    useNativeDriver: true,
                  }),
                ]).start();
              }}
            >
              <Ionicons 
                name={isSaved ? "heart" : "heart-outline"} 
                size={24} 
                color={isSaved ? "#FF4444" : "#FFFFFF"} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.imageActionButton}
              onPress={shareProduct}
            >
              <Ionicons name="share-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Price Badge */}
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>{product.price}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPriceBadge}>{product.originalPrice}</Text>
            )}
          </View>
        </Animated.View>
      </View>

      {/* Bottom White Section (80%) with curved top */}
      <Animated.View 
        style={[
          styles.bottomSection,
          {
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Product Title and Info */}
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <Text style={styles.productTitle}>{product.title}</Text>
                {product.isVerified && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
                  </View>
                )}
              </View>
              
              <View style={styles.metaInfo}>
                <View style={styles.metaItem}>
                  <Ionicons name="eye-outline" size={14} color="#718096" />
                  <Text style={styles.metaText}>{product.views || 0} views</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="heart-outline" size={14} color="#718096" />
                  <Text style={styles.metaText}>{product.saves || 0} saves</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color="#718096" />
                  <Text style={styles.metaText}>{product.time || 'Recently'}</Text>
                </View>
              </View>
            </View>

            {/* Product Details */}
            <View style={styles.detailsSection}>
              <View style={styles.detailRow}>
                <Ionicons name="pricetag-outline" size={20} color="#4A5568" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Price</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.currentPrice}>{product.price}</Text>
                    {product.originalPrice && (
                      <Text style={styles.originalPrice}>{product.originalPrice}</Text>
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="cube-outline" size={20} color="#4A5568" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Condition</Text>
                  <Text style={styles.detailValue}>{product.condition || 'Good'}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={20} color="#4A5568" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Location</Text>
                  <Text style={styles.detailValue}>{product.location}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="business-outline" size={20} color="#4A5568" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Category</Text>
                  <View style={styles.categoryBadge}>
                    <Ionicons 
                      name={product.category === 'electronics' ? 'laptop-outline' : 
                            product.category === 'books' ? 'book-outline' :
                            product.category === 'clothing' ? 'shirt-outline' :
                            'cube-outline'} 
                      size={14} 
                      color="#00BFFF" 
                    />
                    <Text style={styles.categoryText}>
                      {product.category?.charAt(0).toUpperCase() + product.category?.slice(1) || 'Other'}
                    </Text>
                  </View>
                </View>
              </View>

              {product.isNegotiable && (
                <View style={styles.negotiableBadge}>
                  <Ionicons name="hand-left-outline" size={16} color="#38A169" />
                  <Text style={styles.negotiableText}>Price is negotiable</Text>
                </View>
              )}
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>

            {/* Image Gallery Section - INSIDE THE WHITE CARD */}
            {images.length > 1 && (
              <View style={styles.gallerySection}>
                <Text style={styles.sectionTitle}>All Photos</Text>
                <FlatList
                  data={images}
                  renderItem={renderGalleryItem}
                  keyExtractor={(item, index) => `gallery-${index}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.galleryList}
                  snapToAlignment="start"
                  decelerationRate="fast"
                  snapToInterval={76} // width + margin
                />
                <Text style={styles.galleryHint}>
                  Tap any photo to view it larger
                </Text>
              </View>
            )}

            {/* Seller Info */}
            <View style={styles.sellerSection}>
              <Text style={styles.sectionTitle}>Seller Information</Text>
              <Text style={styles.sellerCard}>
                <View style={styles.sellerHeader}>
                  <View style={styles.sellerAvatar}>
                    <Ionicons name="person" size={24} color="#FFFFFF" />
                  </View>
                  <View style={styles.sellerInfo}>
                    <Text style={styles.sellerName}>{product.seller?.name}</Text>
                    <View style={styles.sellerRating}>
                      <Ionicons name="star" size={14} color="#F6AD55" />
                      <Text style={styles.ratingText}>{product.sellerRating || 4.5}</Text>
                      <Text style={styles.ratingCount}>(24 reviews)</Text>
                    </View>
                  </View>
                  {product.isVerified && (
                    <View style={styles.sellerVerified}>
                      <Ionicons name="checkmark-circle" size={16} color="#38A169" />
                      <Text style={styles.verifiedText}>Verified Seller</Text>
                    </View>
                  )}
                </View>

                <View style={styles.sellerContact}>
                  <TouchableOpacity style={styles.contactButton} onPress={callSeller}>
                    <Ionicons name="call-outline" size={18} color="#00BFFF" />
                    <Text style={styles.contactButtonText}>Call</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.contactButton}>
                    <Ionicons name="mail-outline" size={18} color="#00BFFF" />
                    <Text style={styles.contactButtonText}>Email</Text>
                  </TouchableOpacity>
                </View>


{/* Rating Section */}
<View style={styles.ratingSection}>
  <Text style={styles.sectionTitle}>Seller Rating</Text>
  
  <View style={styles.ratingDisplay}>
    <View style={styles.ratingStars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons 
          key={star}
          name={star <= Math.floor(product.rating || 0) ? "star" : "star-outline"} 
          size={20} 
          color="#FFD700" 
        />
      ))}
    </View>
    
    <View style={styles.ratingNumbers}>
      <Text style={styles.ratingValue}>{product.rating || 4.5}</Text>
      <Text style={styles.ratingCount}>({product.reviewCount || 24} reviews)</Text>
    </View>
  </View>
  
  {/* View All Reviews Button */}
  <TouchableOpacity 
    style={styles.viewReviewsButton}
    onPress={() => {
      router.push({
        pathname: '/seller-reviews',
        params: { 
          sellerId: product.sellerId || 'default',
          sellerName: product.seller,
          sellerRating: product.rating
        }
      });
    }}
  >
    <Text style={styles.viewReviewsText}>View all reviews</Text>
    <Ionicons name="chevron-forward" size={16} color="#00BFFF" />
  </TouchableOpacity>
  
  {/* Add Review Button (Only show if user has purchased from this seller) */}
  {hasPurchasedFromSeller && (
    <TouchableOpacity 
      style={styles.addReviewButton}
      onPress={() => {
        router.push({
          pathname: '/ratesellerscreen',
          params: { 
            sellerId: product.sellerId || 'default',
            sellerName: product.seller,
            productId: product.id,
            productTitle: product.title
          }
        });
      }}
    >
      <Ionicons name="star-outline" size={18} color="#FFFFFF" />
      <Text style={styles.addReviewText}>Rate this Seller</Text>
    </TouchableOpacity>
  )}
   </View>
              </Text>
            </View>
            {/* Safety Tips */}
            <View style={styles.safetySection}>
              <Text style={styles.sectionTitle}>Safety Tips</Text>
              <View style={styles.tipsList}>
                <View style={styles.tipItem}>
                  <Ionicons name="shield-checkmark" size={16} color="#38A169" />
                  <Text style={styles.tipText}>Meet in public places on campus</Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons name="shield-checkmark" size={16} color="#38A169" />
                  <Text style={styles.tipText}>Inspect the item before paying</Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons name="shield-checkmark" size={16} color="#38A169" />
                  <Text style={styles.tipText}>Never pay in advance</Text>
                </View>
              </View>
            </View>

            {/* Report Button */}
            <TouchableOpacity style={styles.reportButton} onPress={reportItem}>
              <Ionicons name="flag-outline" size={16} color="#718096" />
              <Text style={styles.reportText}>Report this listing</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>

        {/* Fixed Action Bar */}
        <View
              style={[
                styles.actionBar,
                { paddingBottom: 16 + insets.bottom }
              ]}
            >
 
            {!isOwner && (
            <TouchableOpacity 
            style={styles.chatButton}
            onPress={handleChatPress}
          >
            <Ionicons name="chatbubble-outline" size={20} color="#00BFFF" />
            <Text style={styles.chatButtonText}>Chat</Text>
          </TouchableOpacity>
          )}
            
          
          <TouchableOpacity 
            style={styles.buyButton} 
            onPress={() => Alert.alert('Buy Now', 'Proceed to purchase?')}
          >
            <Text style={styles.buyButtonText}>Buy Now</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00BFFF',
  },
  topSection: {
    height: '20%',
    backgroundColor: '#00BFFF',
  },
  imageContainer: {
    flex: 1,
    backgroundColor: '#00BFFF',
    position: 'relative',
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 191, 255, 0.3)', // Blue overlay
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#00BFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 8,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  imageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  imageIndicatorActive: {
    backgroundColor: '#FFFFFF',
    width: 20,
  },
  imageActions: {
    position: 'absolute',
    top: 40,
    right: 20,
    flexDirection: 'row',
    gap: 10,
  },
  imageActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  priceBadge: {
    position: 'absolute',
    bottom: 10,
    right: 29,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  priceBadgeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00BFFF',
  },
  originalPriceBadge: {
    fontSize: 12,
    color: '#718096',
    textDecorationLine: 'line-through',
  },
  bottomSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D3748',
    flex: 1,
    lineHeight: 28,
  },
  verifiedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#38A169',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  metaInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#718096',
    marginLeft: 4,
  },
  detailsSection: {
    backgroundColor: '#F7FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailContent: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#2D3748',
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00BFFF',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#A0AEC0',
    textDecorationLine: 'line-through',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 191, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 14,
    color: '#00BFFF',
    fontWeight: '500',
    marginLeft: 6,
  },
  negotiableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 161, 105, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  negotiableText: {
    fontSize: 14,
    color: '#38A169',
    fontWeight: '500',
    marginLeft: 6,
  },
  section: {
    marginBottom: 24,
  },
  // Add these styles to your StyleSheet
ratingSection: {
  marginBottom: 24,
  backgroundColor: '#F7FAFC',
  borderRadius: 16,
  padding: 16,
},
ratingDisplay: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 12,
},
ratingStars: {
  flexDirection: 'row',
  gap: 2,
},
ratingNumbers: {
  flexDirection: 'row',
  alignItems: 'center',
},
ratingValue: {
  fontSize: 24,
  fontWeight: '700',
  color: '#2D3748',
  marginRight: 8,
},
ratingCount: {
  fontSize: 14,
  color: '#718096',
},
viewReviewsButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: '#E2E8F0',
  marginBottom: 12,
},
viewReviewsText: {
  fontSize: 14,
  color: '#4A5568',
  fontWeight: '500',
},
addReviewButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#00BFFF',
  paddingVertical: 12,
  borderRadius: 12,
  gap: 8,
},
addReviewText: {
  color: '#FFFFFF',
  fontSize: 14,
  fontWeight: '600',
},
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#4A5568',
    lineHeight: 24,
  },
  // Gallery Section Styles
  gallerySection: {
    marginBottom: 24,
    backgroundColor: '#F7FAFC',
    borderRadius: 16,
    padding: 16,
  },
  galleryList: {
    paddingRight: 8,
  },
  galleryItem: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  galleryItemActive: {
    borderColor: '#00BFFF',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 191, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryHint: {
    fontSize: 12,
    color: '#718096',
    marginTop: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  sellerSection: {
    marginBottom: 24,
  },
  sellerCard: {
    backgroundColor: '#F7FAFC',
    borderRadius: 16,
    padding: 16,
  },
  sellerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00BFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  sellerRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '600',
    marginLeft: 4,
    marginRight: 8,
  },
  ratingCount: {
    fontSize: 12,
    color: '#718096',
  },
  sellerVerified: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 161, 105, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: '#38A169',
    fontWeight: '500',
    marginLeft: 4,
  },
  sellerContact: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 12,
    borderRadius: 12,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  safetySection: {
    marginBottom: 24,
  },
  tipsList: {
    backgroundColor: '#F7FAFC',
    borderRadius: 16,
    padding: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#4A5568',
    marginLeft: 8,
    flex: 1,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  reportText: {
    fontSize: 14,
    color: '#718096',
    marginLeft: 8,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  chatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#00BFFF',
    paddingVertical: 16,
    borderRadius: 12,
  },
  chatButtonText: {
    color: '#00BFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  buyButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00BFFF',
    paddingVertical: 16,
    borderRadius: 12,
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default ProductDetailScreen;