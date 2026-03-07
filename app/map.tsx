
import React from 'react';
import {
    StyleSheet,
    View
} from 'react-native';


const MapScreen = () => {
 
  return (
    <View style={styles.container}>
  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    // Shadow for Android
    elevation: 3,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
  },



});

export default MapScreen;