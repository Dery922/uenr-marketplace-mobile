// components/SkeletonLoader.js
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

const SkeletonLoader = ({ type, style }) => {
  const getSkeletonStyle = () => {
    switch (type) {
      case 'top-bar':
        return styles.topBarSkeleton;
      case 'welcome-section':
        return styles.welcomeSkeleton;
      case 'section-title':
        return styles.sectionTitleSkeleton;
      case 'category-chip':
        return styles.categoryChipSkeleton;
      case 'product-card':
        return styles.productCardSkeleton;
      case 'image':
        return styles.imageSkeleton;
      case 'text-line':
        return styles.textLineSkeleton;
      default:
        return styles.defaultSkeleton;
    }
  };

  return (
    <View style={[getSkeletonStyle(), style, styles.skeletonBase]}>
      <View style={styles.shimmer} />
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonBase: {
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: -100,
    width: 100,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: [{ skewX: '-20deg' }],
    animation: 'shimmer 1.5s infinite', // This will need animation library or custom
  },
  topBarSkeleton: {
    height: 60,
    width: '100%',
    marginBottom: 16,
  },
  welcomeSkeleton: {
    height: 80,
    width: '100%',
    marginBottom: 24,
  },
  sectionTitleSkeleton: {
    height: 24,
    width: 120,
    marginBottom: 16,
  },
  categoryChipSkeleton: {
    height: 40,
    width: 100,
    marginRight: 10,
    borderRadius: 20,
  },
  productCardSkeleton: {
    width: (width - 60) / 2,
    height: 220,
    borderRadius: 16,
    marginBottom: 16,
  },
  imageSkeleton: {
    height: 140,
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  textLineSkeleton: {
    height: 12,
    width: '100%',
    marginBottom: 8,
  },
  defaultSkeleton: {
    height: 20,
    width: '100%',
  },
});

export { SkeletonLoader };
