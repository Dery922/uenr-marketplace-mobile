// components/ProductCard.js
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImageViewer from './ImageViewer';

const ProductCard = ({ product, onPress }) => {
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const productImages = product.images || [];

  const handleImagePress = (index) => {
    setSelectedImageIndex(index);
    setImageViewerVisible(true);
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.95}
    >
      {/* Image */}
      <TouchableOpacity 
        style={styles.imageContainer}
        onPress={() => handleImagePress(0)}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: productImages[0] }}
          style={styles.productImage}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
          placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        />

        {/* Image Counter */}
        {productImages.length > 1 && (
          <View style={styles.imageCounter}>
            <Ionicons name="images" size={12} color="#FFF" />
            <Text style={styles.counterText}>{productImages.length}</Text>
          </View>
        )}

        {/* Verified Badge */}
        {product.isVerified && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#FFF" />
          </View>
        )}
      </TouchableOpacity>

      {/* Product Details */}
      <View style={styles.details}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {product.title || "No product name"}
        </Text>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {product.description || "No description"}
        </Text>

        {/* Price Row */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>₵ {product.price}</Text>
          {product.discountPrice && (
            <Text style={styles.originalPrice}>₵ {product.discountPrice}</Text>
          )}
        </View>

        {/* Condition Badge */}
        {product.condition && (
          <View style={styles.conditionBadge}>
            <Text style={styles.conditionText}>
              {product.condition.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        )}

        {/* Footer: Seller + Rating */}
        <View style={styles.footer}>
          <View style={styles.sellerInfo}>
            <Ionicons name="person" size={12} color="#718096" />
            <Text style={styles.seller} numberOfLines={1}>
              {product.seller?.name || "Unknown"}
            </Text>
          </View>
          <View style={styles.rating}>
            <Ionicons name="star" size={12} color="#F6AD55" />
            <Text style={styles.ratingText}>{product.rating || 0}</Text>
          </View>
        </View>
      </View>

      {/* Image Viewer Modal */}
      <ImageViewer
        images={productImages}
        visible={imageViewerVisible}
        onClose={() => setImageViewerVisible(false)}
        initialIndex={selectedImageIndex}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  imageContainer: {
    height: 140,
    backgroundColor: '#F7FAFC',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imageCounter: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  counterText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#38A169',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  details: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    lineHeight: 18,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#4A5568',
    lineHeight: 16,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00BFFF',
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 12,
    color: '#A0AEC0',
    textDecorationLine: 'line-through',
  },
  conditionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  conditionText: {
    fontSize: 10,
    color: '#2D3748',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  seller: {
    fontSize: 11,
    color: '#718096',
    marginLeft: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#4A5568',
    marginLeft: 4,
    fontWeight: '600',
  },
});

export default ProductCard;