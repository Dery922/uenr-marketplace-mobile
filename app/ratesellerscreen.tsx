// screens/RateSellerScreen.js
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const RateSellerScreen = () => {
  const params = useLocalSearchParams();
  const { sellerName, productTitle } = params;
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [aspects, setAspects] = useState({
    communication: 0,
    itemCondition: 0,
    meetingPunctuality: 0,
    priceFairness: 0,
  });

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Please Rate', 'Please select a star rating before submitting.');
      return;
    }
    
    // In a real app, this would save to your backend
    console.log('Rating submitted:', { rating, comment, aspects });
    
    Alert.alert(
      'Thank You!',
      'Your review has been submitted.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const renderAspectRating = (title, aspectKey) => (
    <View style={styles.aspectRow}>
      <Text style={styles.aspectTitle}>{title}</Text>
      <View style={styles.aspectStars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setAspects({...aspects, [aspectKey]: star})}
          >
            <Ionicons
              name={star <= aspects[aspectKey] ? "star" : "star-outline"}
              size={20}
              color={star <= aspects[aspectKey] ? "#FFD700" : "#CBD5E0"}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} color="#2D3748" onPress={() => router.back()} />
          <Text style={styles.headerTitle}>Rate Seller</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.content}>
          {/* Seller Info */}
          <View style={styles.sellerInfo}>
            <View style={styles.sellerAvatar}>
              <Ionicons name="person" size={32} color="#FFFFFF" />
            </View>
            <View style={styles.sellerDetails}>
              <Text style={styles.sellerName}>{sellerName || 'Seller'}</Text>
              <Text style={styles.productTitle}>
                Product: {productTitle || 'Your Purchase'}
              </Text>
            </View>
          </View>

          {/* Main Rating */}
          <View style={styles.mainRating}>
            <Text style={styles.ratingQuestion}>
              How would you rate your experience with {sellerName || 'this seller'}?
            </Text>
            
            {/* Star Rating */}
            <View style={styles.starContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={styles.starButton}
                >
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={48}
                    color={star <= rating ? "#FFD700" : "#CBD5E0"}
                  />
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={styles.ratingLabel}>
              {rating === 0 ? 'Tap to rate' : 
               rating === 1 ? 'Poor' :
               rating === 2 ? 'Fair' :
               rating === 3 ? 'Good' :
               rating === 4 ? 'Very Good' : 'Excellent'}
            </Text>
          </View>

          {/* Detailed Aspects */}
          <View style={styles.aspectsSection}>
            <Text style={styles.aspectsTitle}>Rate specific aspects (optional)</Text>
            
            {renderAspectRating('Communication', 'communication')}
            {renderAspectRating('Item Condition', 'itemCondition')}
            {renderAspectRating('Meeting Punctuality', 'meetingPunctuality')}
            {renderAspectRating('Price Fairness', 'priceFairness')}
          </View>

          {/* Comment Section */}
          <View style={styles.commentSection}>
            <Text style={styles.commentTitle}>Add a comment (optional)</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Share details of your experience..."
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <Text style={styles.commentHint}>
              Your review will help other buyers make better decisions.
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitButton, rating === 0 && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={rating === 0}
          >
            <Text style={styles.submitButtonText}>
              {rating === 0 ? 'Select a rating to submit' : 'Submit Review'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
  },
  content: {
    padding: 20,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  sellerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#00BFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sellerDetails: {
    flex: 1,
  },
  sellerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  productTitle: {
    fontSize: 14,
    color: '#718096',
  },
  mainRating: {
    alignItems: 'center',
    marginBottom: 32,
  },
  ratingQuestion: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  starButton: {
    padding: 4,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00BFFF',
  },
  aspectsSection: {
    backgroundColor: '#F7FAFC',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  aspectsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 16,
  },
  aspectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  aspectTitle: {
    fontSize: 14,
    color: '#4A5568',
    flex: 1,
  },
  aspectStars: {
    flexDirection: 'row',
    gap: 4,
  },
  commentSection: {
    marginBottom: 32,
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  commentInput: {
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2D3748',
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  commentHint: {
    fontSize: 12,
    color: '#718096',
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: '#00BFFF',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#CBD5E0',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RateSellerScreen;