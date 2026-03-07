// components/EnhancedSearchBox.js
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

const EnhancedSearchBox = ({
  onSearch,
  onCategorySelect,
}) => {
  const [searchText, setSearchText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchBarWidth = useRef(new Animated.Value(width - 40)).current;

  const categories = [
    { id: 1, icon: 'book-outline', label: 'Books', color: '#4299E1' },
    { id: 2, icon: 'fast-food-outline', label: 'Food', color: '#ED8936' },
    { id: 3, icon: "phone-portrait-outline", label: 'Electronics', color: '#38B2AC' },
    { id: 4, icon: 'home-outline', label: 'Dorm', color: '#9F7AEA' },
    { id: 5, icon: 'print-outline', label: 'Services', color: '#F56565' },
    { id: 6, icon: 'car-outline', label: 'Transport', color: '#48BB78' },
    { id: 7, icon: 'shirt-outline', label: 'Clothing', color: '#ED64A6' },
    { id: 8, icon: 'game-controller-outline', label: 'Entertainment', color: '#ECC94B' },
  ];

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(searchBarWidth, {
      toValue: width - 40,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleSearch = () => {
    if (searchText.trim()) {
      Keyboard.dismiss();
      onSearch?.(searchText);
    }
  };

  const handleCategoryPress = (category) => {
    setSearchText(category.label);
    onCategorySelect?.(category);
  };

  const clearSearch = () => {
    setSearchText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <Animated.View style={[styles.searchContainer, { width: searchBarWidth }]}>
          <Ionicons 
            name="search" 
            size={22} 
            color={isFocused ? "#4299E1" : "#718096"} 
            style={styles.searchIcon}
          />
          
          <TextInput
            style={styles.input}
            placeholder="What are you looking for?"
            placeholderTextColor="#A0AEC0"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            onFocus={handleFocus}
            onBlur={handleBlur}
            returnKeyType="search"
            autoCorrect={false}
          />
          
          {searchText.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#CBD5E0" />
            </TouchableOpacity>
          )}
        </Animated.View>

        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => console.log('Open filters')}
        >
          <MaterialIcons name="tune" size={24} color="#4A5568" />
        </TouchableOpacity>
      </View>

      {/* Categories Scroll */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryItem}
            onPress={() => handleCategoryPress(category)}
            activeOpacity={0.7}
          >
            <View style={[styles.categoryIcon, { backgroundColor: `${category.color}15` }]}>
              <Ionicons 
                name={category.icon} 
                size={20} 
                color={category.color} 
              />
            </View>
            <Text style={styles.categoryLabel}>{category.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2D3748',
    padding: 0,
    fontWeight: '500',
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EDF2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesScroll: {
    paddingLeft: 20,
  },
  categoriesContent: {
    paddingRight: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#4A5568',
    fontWeight: '600',
  },
});

export default EnhancedSearchBox;