// app/(screens)/edit-profile.js
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ProfileEditScreen = () => {
  // Get user data passed from Profile Screen (with defaults)
  const params = useLocalSearchParams();
  const currentUser = {
    name: params.name || 'Kwame Asare',
    email: params.email || 'kwame@student.edu.gh',
    phone: params.phone || '+233 24 123 4567',
    university: params.university || 'University of Ghana',
    campus: params.campus || 'Legon Campus',
    studentId: params.studentId || 'STU2023001',
  };

  // State for editable fields
  const [formData, setFormData] = useState(currentUser);
  const [profileImage, setProfileImage] = useState(
    params.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80'
  );
  const [isSaving, setIsSaving] = useState(false);
  const insets = useSafeAreaInsets();

  // Handle text input changes
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Profile Image Picker
  const pickProfileImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photos to change profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  // Take Photo with Camera
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow camera access to take a photo.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo.');
    }
  };

  // Handle Save
  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In real app: await api.updateProfile(formData, profileImage);
    
    setIsSaving(false);
    Alert.alert(
      'Success',
      'Your profile has been updated successfully!',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        }
      ]
    );
  };

  // Handle Cancel
  const handleCancel = () => {
    // Check if any changes were made
    const hasChanges = 
      JSON.stringify(formData) !== JSON.stringify(currentUser) ||
      profileImage !== (params.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80');
    
    if (hasChanges) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to cancel?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { 
            text: 'Discard', 
            style: 'destructive',
            onPress: () => router.back()
          }
        ]
      );
    } else {
      router.back();
    }
  };

  // Input Fields Configuration
  const inputFields = [
    { label: 'Full Name', field: 'name', placeholder: 'Enter your full name', icon: 'person' },
    { label: 'Email Address', field: 'email', placeholder: 'Enter your email', icon: 'mail', keyboardType: 'email-address' },
    { label: 'Phone Number', field: 'phone', placeholder: 'Enter your phone number', icon: 'call', keyboardType: 'phone-pad' },
    { label: 'University', field: 'university', placeholder: 'Enter your university', icon: 'school' },
    { label: 'Campus', field: 'campus', placeholder: 'Enter your campus', icon: 'location' },
    { label: 'Student ID', field: 'studentId', placeholder: 'Enter your student ID', icon: 'card' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A365D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity 
          onPress={handleSave} 
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Image Section */}
          <View style={styles.imageSection}>
            <View style={styles.imageWrapper}>
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
              <TouchableOpacity 
                style={styles.imageEditButton}
                onPress={() => {
                  Alert.alert(
                    'Change Profile Picture',
                    'Choose an option',
                    [
                      { text: 'Take Photo', onPress: takePhoto },
                      { text: 'Choose from Gallery', onPress: pickProfileImage },
                      { text: 'Cancel', style: 'cancel' }
                    ]
                  );
                }}
              >
                <Ionicons name="camera" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.imageHint}>Tap to change photo</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            {inputFields.map((item, index) => (
              <View key={item.field} style={styles.inputContainer}>
                <View style={styles.labelRow}>
                  <Ionicons name={item.icon} size={18} color="#4A5568" style={styles.fieldIcon} />
                  <Text style={styles.label}>{item.label}</Text>
                </View>
                <TextInput
                  style={styles.input}
                  value={formData[item.field]}
                  onChangeText={(text) => handleInputChange(item.field, text)}
                  placeholder={item.placeholder}
                  placeholderTextColor="#A0AEC0"
                  keyboardType={item.keyboardType || 'default'}
                  autoCapitalize={item.field === 'email' ? 'none' : 'words'}
                />
              </View>
            ))}

            {/* Additional Info Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Information</Text>
              <View style={styles.infoBox}>
                <View style={styles.infoRow}>
                  <Ionicons name="time-outline" size={18} color="#718096" />
                  <Text style={styles.infoText}>Member since 2023</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="shield-checkmark-outline" size={18} color="#718096" />
                  <Text style={styles.infoText}>Verified Student Account</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="star-outline" size={18} color="#718096" />
                  <Text style={styles.infoText}>4.8 Seller Rating</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonSection}>
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={() => setFormData(currentUser)}
              >
                <Ionicons name="refresh" size={20} color="#00BFFF" />
                <Text style={styles.resetButtonText}>Reset Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A365D',
  },
  saveButton: {
    backgroundColor: '#00BFFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imageEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00BFFF',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  imageHint: {
    fontSize: 14,
    color: '#718096',
  },
  formSection: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldIcon: {
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1A365D',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A365D',
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#4A5568',
    marginLeft: 12,
  },
  buttonSection: {
    marginTop: 32,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#00BFFF',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  resetButtonText: {
    color: '#00BFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileEditScreen;