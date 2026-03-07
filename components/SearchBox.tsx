// components/SearchBox.js
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import {
    Alert,
    Keyboard,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const SearchBox = ({
  placeholder = 'Search textbooks, food, services...',
  onSearch,
  onVoiceSearch,
  showVoiceButton = true,
  initialValue = '',
}) => {
  const [searchText, setSearchText] = useState(initialValue);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);

  const handleSearch = () => {
    if (searchText.trim()) {
      Keyboard.dismiss();
      onSearch?.(searchText);
    }
  };

  const startVoiceRecording = async () => {
    try {
      // Request permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Microphone permission is needed for voice search');
        return;
      }

      // Prepare audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
      
      // Haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    } catch (error) {
      console.error('Failed to start recording', error);
      Alert.alert('Error', 'Could not start voice recording');
    }
  };

  const stopVoiceRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      setIsRecording(false);
      setRecording(null);

      // Get the recording URI
      const uri = recording.getURI();
      
      // In a real app, you would send this to a speech-to-text API
      // For now, we'll simulate it
      simulateSpeechToText(uri);

    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  const simulateSpeechToText = async (uri) => {
    // Simulate processing time
    setTimeout(() => {
      const mockTranscripts = [
        'Calculus textbook',
        'Jollof rice',
        'Dorm furniture',
        'Phone charger',
        'Printing services',
      ];
      const randomTranscript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
      
      setSearchText(randomTranscript);
      onVoiceSearch?.(randomTranscript);
      
      // Haptic success feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1500);
  };

  const clearSearch = () => {
    setSearchText('');
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        {/* Search Icon */}
        <Ionicons 
          name="search" 
          size={20} 
          color="#718096" 
          style={styles.searchIcon}
        />
        
        {/* Text Input */}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#A0AEC0"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        
        {/* Clear Button (shown when text exists) */}
        {searchText.length > 0 && (
          <TouchableOpacity 
            onPress={clearSearch}
            style={styles.clearButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close-circle" size={18} color="#CBD5E0" />
          </TouchableOpacity>
        )}
        
        {/* Voice Search Button */}
        {showVoiceButton && (
          <TouchableOpacity 
            onPressIn={startVoiceRecording}
            onPressOut={stopVoiceRecording}
            style={[
              styles.voiceButton,
              isRecording && styles.voiceButtonActive
            ]}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={isRecording ? "mic" : "mic-outline"} 
              size={20} 
              color={isRecording ? "#FFFFFF" : "#4A5568"} 
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Recent Searches (Optional) */}
      {searchText.length === 0 && (
        <View style={styles.recentSearches}>
          <Text style={styles.recentTitle}>Recent searches:</Text>
          <View style={styles.recentTags}>
            <TouchableOpacity 
              style={styles.tag}
              onPress={() => setSearchText('Calculus 101')}
            >
              <Text style={styles.tagText}>Calculus 101</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.tag}
              onPress={() => setSearchText('Jollof rice')}
            >
              <Text style={styles.tagText}>Jollof rice</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.tag}
              onPress={() => setSearchText('Dorm lamp')}
            >
              <Text style={styles.tagText}>Dorm lamp</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2D3748',
    padding: 0,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    includeFontPadding: false,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  voiceButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EDF2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  voiceButtonActive: {
    backgroundColor: '#E53E3E',
    transform: [{ scale: 1.1 }],
  },
  recentSearches: {
    marginTop: 12,
  },
  recentTitle: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '600',
    marginBottom: 8,
  },
  recentTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 13,
    color: '#4A5568',
    fontWeight: '500',
  },
});

export default SearchBox;