// screens/SellScreen.js
import { addProduct } from '@/api/productApi';
import SelectableChips from '@/components/SelectableChips';
import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as ImagePicker from 'expo-image-picker';
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const SellScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [condition, setCondition] = useState('new');

  
  // Animation refs
  const slideAnim = useRef(new Animated.Value(1000)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const imageScaleAnims = useRef(Array(4).fill().map(() => new Animated.Value(0))).current;
  const hasAnimated = useRef(false);


    const conditionOptions = [
    { label: 'Brand New', value: 'brand_new' },
    { label: 'Like New', value: 'like_new' },
    { label: 'Used', value: 'used' },
    { label: 'Refurbished', value: 'refurbished' },
  ];

  const categories = [
    { id: 'books', name: 'Books', icon: 'book' },
    { id: 'electronics', name: 'Electronics', icon: 'laptop' },
    { id: 'clothing', name: 'Clothing', icon: 'shirt' },
    { id: 'accessories', name: 'Accessories', icon: 'bag' },
    { id: 'other', name: 'Other', icon: 'apps' },
  ];

  // Reset animations when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Reset animation states
      slideAnim.setValue(1000);
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
      imageScaleAnims.forEach(anim => anim.setValue(0));
      
      setIsVisible(true);
      startAnimations();
      
      return () => {
        setIsVisible(false);
        // Reset animation ref
        hasAnimated.current = false;
        // Stop any ongoing animations
        slideAnim.stopAnimation();
        fadeAnim.stopAnimation();
        scaleAnim.stopAnimation();
      };
    }, [])
  );

    const insets = useSafeAreaInsets();
    const tabBarHeight = useBottomTabBarHeight();

  const startAnimations = () => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    
    // Slide up animation for bottom section
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      
      // Fade in animation for content
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
      
      // Scale animation for main content
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
        delay: 150,
      }),
    ]).start();

    // Staggered animation for category buttons with delay
    setTimeout(() => {
      Animated.stagger(80, categories.map((_, index) => 
        Animated.spring(imageScaleAnims[index] || new Animated.Value(0), {
          toValue: 1,
          tension: 150,
          friction: 10,
          useNativeDriver: true,
          delay: index * 40,
        })
      )).start();
    }, 300);
  };

  // Animation for adding image
  const animateImageAdd = (index) => {
    const anim = imageScaleAnims[index] || new Animated.Value(0);
    anim.setValue(0);
    Animated.spring(anim, {
      toValue: 1,
      tension: 150,
      friction: 12,
      useNativeDriver: true,
    }).start();
  };

  // Animation for removing image
  const animateImageRemove = (index, callback) => {
    const anim = imageScaleAnims[index] || new Animated.Value(1);
    Animated.timing(anim, {
      toValue: 0,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      if (callback) callback();
    });
  };

  // Animation for category selection
  const animateCategorySelect = (catId) => {
    setCategory(catId);
    // Add a small bounce animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.02,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 150,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Animation for submit button
  const animateSubmitPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 150,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Animate back button press
  const animateBackPress = () => {
    // Stop current animations
    slideAnim.stopAnimation();
    fadeAnim.stopAnimation();
    
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1000,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.back();
    });
  };

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please enable camera roll permissions to upload photos.');
      }
    })();
  }, []);

  const pickImage = async () => {
    if (images.length >= 4) {
      Alert.alert('Limit reached', 'You can upload up to 4 images.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const newImages = [...images, result.assets[0].uri];
        setImages(newImages);
        // Animate the new image
        animateImageAdd(newImages.length - 1);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  const removeImage = (index) => {
    animateImageRemove(index, () => {
      const newImages = [...images];
      newImages.splice(index, 1);
      setImages(newImages);
    });
  };

  const handleSubmit = async () => {
      console.log("Submitting product...");
    if (!title.trim()) {
      // Shake animation for empty title
      const shake = new Animated.Value(0);
      Animated.sequence([
        Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
      
      Alert.alert('Required', 'Please enter a title.');
      return;
    }
    if (!price.trim()) {
      Alert.alert('Required', 'Please enter a price.');
      return;
    }
    // if (images.length === 0) {
    //   Alert.alert('Required', 'Please add at least one photo.');
    //   return;
    // }

    animateSubmitPress();
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("discountPrice",discountPrice);
    formData.append("condition",condition);
    formData.append("category", category);

images.forEach((uri, index) => {
  const filename = uri.split("/").pop() || `photo_${index}.jpg`;

  const fileUri = uri.startsWith("file://") ? uri : `file://${uri}`;

  formData.append("images", {
    uri: fileUri,
    name: filename,
    type: "image/jpeg",
  });
});

console.log("Images:", images);
console.log("FormData created");

await addProduct(formData);

      
      Alert.alert(
        'Success!',
        'Your item has been listed.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form with animation
              Animated.parallel([
                Animated.timing(fadeAnim, {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                  toValue: 1000,
                  duration: 300,
                  easing: Easing.in(Easing.ease),
                  useNativeDriver: true,
                }),
              ]).start(() => {
                // Reset form data
                setTitle('');
                setDescription('');
                setPrice('');
                setDiscountPrice('');
                setCondition('');
                setCategory('');
                setImages([]);
                setLoading(false);
                hasAnimated.current = false;
                
                // Navigate back
                router.back();
              });
            },
          },
        ]
      );
    } catch (error) {
  console.log("ADD PRODUCT ERROR:", error.response?.data || error.message);
  Alert.alert('Error', 'Failed to list item.');
  setLoading(false);
}
  };

  // If not visible yet, show empty container
  if (!isVisible) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topSection}>
          <View style={styles.topContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.titleContainer}>
              <Text style={styles.screenTitle}>Sell Item</Text>
              <Text style={styles.screenSubtitle}>List your item for sale</Text>
            </View>
            
            <View style={styles.placeholder} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Blue Section (20%) */}
      <View style={styles.topSection}>
        <View style={styles.topContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={animateBackPress}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Text style={styles.screenTitle}>Sell Item</Text>
            <Text style={styles.screenSubtitle}>List your item for sale</Text>
          </View>
          
          <View style={styles.placeholder} />
        </View>
      </View>

      {/* Bottom White Section (80%) with curved top - Animated */}
      <Animated.View 
        style={[
          styles.bottomSection,
          {
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <Animated.ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
         
               contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: tabBarHeight + insets.bottom + 24,
            },
            ]}
          scrollEventThrottle={16}
        >
          <Animated.View 
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }}
          >
            {/* Image Upload Section */}
          <View style={styles.imageSection}>
              <Text style={styles.sectionLabel}>Add Photos *</Text>
              <Text style={styles.sectionHint}>Add up to 4 clear photos</Text>
              
              <View style={styles.imageGrid}>
       
                {images.map((uri, index) => (
                  <Animated.View 
                    key={`${uri}-${index}`} 
                    style={[
                      styles.imageCell,
                      {
                        transform: [{ 
                          scale: imageScaleAnims[index] || new Animated.Value(1) 
                        }]
                      }
                    ]}
                  >
                    <Image source={{ uri }} style={styles.previewImage} />
                    <TouchableOpacity 
                      style={styles.removeBtn}
                      onPress={() => removeImage(index)}
                    >
                      <Ionicons name="close-circle" size={22} color="#FF4444" />
                    </TouchableOpacity>
                  </Animated.View>
                ))}
                
            
                {images.length < 4 && (
                  <Animated.View
                    style={{
                      opacity: fadeAnim,
                      transform: [{ scale: scaleAnim }],
                    }}
                  >
                    <TouchableOpacity 
                      style={styles.addImageCell}
                      onPress={pickImage}
                      activeOpacity={0.7}
                    >
                      <View style={styles.addImageContent}>
                        <Ionicons name="camera" size={32} color="#00BFFF" />
                        <Text style={styles.addImageText}>Add Photo</Text>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                )}
              </View>
            </View>

            {/* Title Input */}
            <View style={styles.inputSection}>
              <Text style={styles.sectionLabel}>Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="What are you selling?"
                value={title}
                onChangeText={setTitle}
                maxLength={60}
                placeholderTextColor="#A0AEC0"
              />
              <Text style={styles.charCount}>{title.length}/60</Text>
            </View>

            {/* Description Input */}
            <View style={styles.inputSection}>
              <Text style={styles.sectionLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your item..."
                value={description}
                onChangeText={setDescription}
                maxLength={200}
                multiline
                numberOfLines={3}
                placeholderTextColor="#A0AEC0"
              />
              <Text style={styles.charCount}>{description.length}/200</Text>
            </View>

            {/* Price Input */}
            <View style={styles.inputSection}>
              <Text style={styles.sectionLabel}>Price *</Text>
              <View style={styles.priceContainer}>
                <View style={styles.pricePrefix}>
                  <Text style={styles.currencySymbol}>₵</Text>
                </View>
                <TextInput
                  style={styles.priceInput}
                  placeholder="0.00"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                  placeholderTextColor="#A0AEC0"
                />
              </View>
            </View>

            {/* Condition */}
            <View style={styles.inputSection}>


       
            <SelectableChips
            label="Condition"
            options={conditionOptions}
            selectedValue={condition}
            onSelect={setCondition}
            type="radio"
            layout="horizontal"
            size="sm"
            chipStyle="pill"
            required
      />

  
     

            </View>

                {/* discountPrice */}
             <View style={styles.inputSection}>
              <Text style={styles.sectionLabel}>Discount Price *</Text>
              <View style={styles.priceContainer}>
                <View style={styles.pricePrefix}>
                  <Text style={styles.currencySymbol}>₵</Text>
                </View>
                <TextInput
                  style={styles.priceInput}
                  placeholder="0.00"
                  value={discountPrice}
                  onChangeText={setDiscountPrice}
                  keyboardType="decimal-pad"
                  placeholderTextColor="#A0AEC0"
                />
              </View>
            </View>

            {/* Category Selection */}
            <View style={styles.inputSection}>
              <Text style={styles.sectionLabel}>Category *</Text>
              <View style={styles.categoryContainer}>
                {categories.map((cat, index) => (
                  <Animated.View
                    key={cat.id}
                    style={{
                      transform: [{ 
                        scale: imageScaleAnims[index] || new Animated.Value(1) 
                      }]
                    }}
                  >
                    <TouchableOpacity
                      style={[
                        styles.categoryButton,
                        category === cat.id && styles.categoryButtonActive
                      ]}
                      onPress={() => animateCategorySelect(cat.id)}
                    >
                      <Ionicons 
                        name={cat.icon} 
                        size={20} 
                        color={category === cat.id ? '#FFFFFF' : '#00BFFF'} 
                      />
                      <Text style={[
                        styles.categoryText,
                        category === cat.id && styles.categoryTextActive
                      ]}>
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!title || !price || !category) && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={loading || !title || !price  || !category}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>List Item for Sale</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Info Text */}
            <Text style={styles.infoText}>
              Your listing will be visible to other students on campus. 
              Make sure to provide accurate information.
            </Text>
          </Animated.View>
        </Animated.ScrollView>
      </Animated.View>
    </View>
  );
};

// Styles remain the same...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00BFFF',
  },
  topSection: {
    height: '20%',
    backgroundColor: '#00BFFF',
    paddingTop: 40,
  },
  topContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: '100%',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  placeholder: {
    width: 40,
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
    paddingBottom: 40,
  },
  imageSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 6,
  },
  sectionHint: {
    fontSize: 13,
    color: '#718096',
    marginBottom: 16,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageCell: {
    width: (width - 72) / 3, // 3 per row with padding
    height: (width - 72) / 3,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F7FAFC',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removeBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  addImageCell: {
    width: (width - 72) / 3,
    height: (width - 72) / 3,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageContent: {
    alignItems: 'center',
  },
  addImageText: {
    fontSize: 12,
    color: '#00BFFF',
    marginTop: 8,
    fontWeight: '500',
  },
  inputSection: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2D3748',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#A0AEC0',
    textAlign: 'right',
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  pricePrefix: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#EDF2F7',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00BFFF',
  },
  priceInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2D3748',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#00BFFF',
    backgroundColor: 'transparent',
  },
  categoryButtonActive: {
    backgroundColor: '#00BFFF',
  },
  categoryText: {
    fontSize: 14,
    color: '#00BFFF',
    fontWeight: '500',
    marginLeft: 6,
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00BFFF',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#CBD5E0',
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default SellScreen;