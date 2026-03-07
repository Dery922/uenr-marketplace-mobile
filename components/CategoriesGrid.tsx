// components/CategoriesGrid.js
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const CategoriesGrid = ({ onCategorySelect }) => {
  const categories = [
    { id: 1, icon: 'book-outline', label: 'Books', color: '#4299E1' },
    { id: 2, icon: 'fast-food-outline', label: 'Food', color: '#ED8936' },
    { id: 3, icon: 'phone-portrait-outline', label: 'Electronics', color: '#38B2AC' },
    { id: 4, icon: 'home-outline', label: 'Housing', color: '#9F7AEA' },
    { id: 5, icon: 'print-outline', label: 'Services', color: '#F56565' },
    { id: 6, icon: 'car-outline', label: 'Transport', color: '#48BB78' },
    { id: 7, icon: 'shirt-outline', label: 'Clothing', color: '#ED64A6' },
    { id: 8, icon: 'game-controller-outline', label: 'Entertainment', color: '#ECC94B' },
  ];

  const handleCategoryPress = (category) => {
    onCategorySelect?.(category);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Browse Categories</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
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
                size={24} 
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
    paddingTop: 8, // Reduced top padding since whiteBackground has padding
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A365D',
  },
  seeAll: {
    fontSize: 14,
    color: '#4299E1',
    fontWeight: '600',
  },
  categoriesContent: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#4A5568',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CategoriesGrid;