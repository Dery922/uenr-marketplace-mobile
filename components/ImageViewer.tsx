// components/ImageViewer.js
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    Modal,
    SafeAreaView,
    ScrollView, // Added ScrollView import
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const ImageViewer = ({ images, visible, onClose, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const isZoomed = useRef(false);

  const handleZoom = (newScale, focalX, focalY) => {
    setScale(newScale);
    if (newScale > 1) {
      isZoomed.current = true;
      // Adjust translation for focal point
      setTranslateX(-focalX + width / 2);
      setTranslateY(-focalY + height / 2);
    } else {
      isZoomed.current = false;
      setTranslateX(0);
      setTranslateY(0);
    }
  };

  const handleDoubleTap = (eventX, eventY) => {
    if (scale === 1) {
      handleZoom(2, eventX, eventY);
    } else {
      handleZoom(1, 0, 0);
    }
  };

  const handlePan = (dx, dy) => {
    if (isZoomed.current) {
      setTranslateX(prev => prev + dx);
      setTranslateY(prev => prev + dy);
    }
  };

  const handleSwipe = (direction) => {
    if (direction === 'left' && currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetZoom();
    } else if (direction === 'right' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetZoom();
    }
  };

  const resetZoom = () => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
    isZoomed.current = false;
  };

  const handleClose = () => {
    resetZoom();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.counter}>
            {currentIndex + 1} / {images.length}
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Image Area */}
        <View style={styles.imageContainer}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.imageWrapper}
            onPress={() => {
              if (!isZoomed.current) handleClose();
            }}
          >
            <View
              style={[
                styles.animatedImage,
                {
                  transform: [
                    { translateX },
                    { translateY },
                    { scale },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={(event) => {
                  const { locationX, locationY } = event.nativeEvent;
                  handleDoubleTap(locationX, locationY);
                }}
                delayLongPress={300}
                onLongPress={(event) => {
                  // Optional: Show save/share options
                }}
              >
                <Image
                  source={{ uri: images[currentIndex] }}
                  style={styles.image}
                  contentFit="contain"
                  transition={200}
                  cachePolicy="memory-disk"
                  placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          {/* Swipe Navigation */}
          {currentIndex > 0 && (
            <TouchableOpacity
              style={[styles.swipeButton, styles.leftButton]}
              onPress={() => handleSwipe('right')}
            >
              <Ionicons name="chevron-back" size={30} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          {currentIndex < images.length - 1 && (
            <TouchableOpacity
              style={[styles.swipeButton, styles.rightButton]}
              onPress={() => handleSwipe('left')}
            >
              <Ionicons name="chevron-forward" size={30} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <View style={styles.thumbnailContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {images.map((img, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.thumbnail,
                    currentIndex === index && styles.thumbnailActive,
                  ]}
                  onPress={() => {
                    setCurrentIndex(index);
                    resetZoom();
                  }}
                >
                  <Image
                    source={{ uri: img }}
                    style={styles.thumbnailImage}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counter: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    width: 44,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedImage: {
    width: width,
    height: height * 0.7,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  swipeButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -25,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftButton: {
    left: 20,
  },
  rightButton: {
    right: 20,
  },
  thumbnailContainer: {
    height: 80,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  thumbnailActive: {
    borderColor: '#00BFFF',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
});

export default ImageViewer;