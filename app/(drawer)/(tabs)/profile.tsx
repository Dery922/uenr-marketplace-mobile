// screens/ProfileScreen.js
import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as ImagePicker from 'expo-image-picker';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { getCurrentUser } from '@/api/authApi';
import { getMyProductCount } from '@/api/productApi';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
const { width } = Dimensions.get('window');

import { darkTheme, lightTheme } from '@/constants/theme';
import { toggleTheme } from '@/redux/themeSlice';




const ProfileScreen = () => {

const darkMode = useSelector((state: any) => state.theme.darkMode);

const theme = darkMode ? darkTheme : lightTheme;

const dispatch = useDispatch();


  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  // const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [currentUserData, setCurrentUserData] = useState({});
  const [productCount, setProductCount] = useState();
  
  // Animation refs
  const slideAnim = useRef(new Animated.Value(1000)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const profileImageScale = useRef(new Animated.Value(0.5)).current;
  const statsScaleAnims = useRef(Array(5).fill().map(() => new Animated.Value(0))).current;

  const user = {
    name: 'Kwame Asare',
    email: 'uenr.edu.gh',
    phone: '+233 24 123 4567',
    university: 'University of Energy....',
    campus: 'Fiapre Campus',
    studentId: 'UENR2023001',
    rating: 4.8,
    listings: 12,
    sold: 8,
    memberSince: '2023',
  };

 useFocusEffect(
  useCallback(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        const count = await getMyProductCount();

        setProductCount(count.data.totalProducts);
        setCurrentUserData(res.data);

      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, [])
);


  const handleEditProfilePress = () => {
  // Animate the button press
  Animated.sequence([
    Animated.timing(scaleAnim, {
      toValue: 0.98,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 150,
      friction: 3,
      useNativeDriver: true,
    }),
  ]).start(() => {
    // Navigate after animation completes
    animateExit(() => {
      router.push('/edit-profile');
    });
  });
};


  const menuItems = [
    {
      id: 'my-listings',
      title: 'My Listings',
      icon: 'list',
      count: productCount,
      color: '#00BFFF',

    },
    {
      id: 'sold-items',
      title: 'Sold Items',
      icon: 'checkmark-circle',
      count: user.sold,
      color: '#38A169',
    },
    {
      id: 'saved',
      title: 'Saved Items',
      icon: 'heart',
      count: 5,
      color: '#D53F8C',
    },
    {
      id: 'reviews',
      title: 'My Reviews',
      icon: 'star',
      count: 24,
      color: '#D69E2E',
    },
    {
      id: 'messages',
      title: 'Messages',
      icon: 'chatbubble',
      count: 3,
      color: '#ED8936',
      badge: true,
    },
  ];

  const settingsItems = [
    {
      id: 'edit-profile',
      title: 'Edit Profile',
      icon: 'create-outline',
      type: 'link',
      onPress: handleEditProfilePress, 
    },
    {
      id: 'security',
      title: 'Security',
      icon: 'shield-checkmark-outline',
      type: 'link',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'notifications-outline',
      type: 'switch',
      value: notificationsEnabled,
      onValueChange: setNotificationsEnabled,
    },
    {
      id: 'dark-mode',
      title: 'Dark Mode',
      icon: 'moon-outline',
      type: 'switch',
      value: darkMode,
      onValueChange: () => dispatch(toggleTheme()),
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      type: 'link',
    },
    {
      id: 'about',
      title: 'About App',
      icon: 'information-circle-outline',
      type: 'link',
    },
  ];

  // Use useFocusEffect to trigger animations on every visit
  useFocusEffect(
    useCallback(() => {
      // Reset all animations to starting positions
      slideAnim.setValue(1000);
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
      profileImageScale.setValue(0.5);
      statsScaleAnims.forEach(anim => anim.setValue(0));
      
      setIsVisible(true);settingsItems
      
      // Start animations with a small delay to ensure UI is ready
      setTimeout(() => {
        startAnimations();
      }, 100);
      
      return () => {
        setIsVisible(false);
        // Cleanup: stop any ongoing animations
        slideAnim.stopAnimation();
        fadeAnim.stopAnimation();
        scaleAnim.stopAnimation();
        profileImageScale.stopAnimation();
        statsScaleAnims.forEach(anim => anim.stopAnimation());
      };
    }, [])
  );



  // In ProfileScreen.js, add this function for edit profile navigation:






  const startAnimations = () => {
    // Profile image animation (grows from center)
    Animated.spring(profileImageScale, {
      toValue: 1,
      tension: 150,
      friction: 10,
      useNativeDriver: true,
      delay: 200,
    }).start();

    // Bottom section slide up
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    }).start();

    // Content fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay: 300,
      useNativeDriver: true,
    }).start();

    // Scale animation for main content
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
      delay: 350,
    }).start();

    // Staggered animation for stats cards
    setTimeout(() => {
      Animated.stagger(80, statsScaleAnims.map((anim, index) => 
        Animated.spring(anim, {
          toValue: 1,
          tension: 180,
          friction: 12,
          useNativeDriver: true,
          delay: index * 60,
        })
      )).start();
    }, 400);
  };

  const pickProfileImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        // Animate profile image change
        Animated.sequence([
          Animated.timing(profileImageScale, {
            toValue: 0.8,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.spring(profileImageScale, {
            toValue: 1,
            tension: 150,
            friction: 10,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setProfileImage(result.assets[0].uri);
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

const handleMenuItemPress = (id) => {
  // Animate the pressed stat card
  const index = menuItems.findIndex(item => item.id === id);
  if (statsScaleAnims[index]) {
    Animated.sequence([
      Animated.timing(statsScaleAnims[index], {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(statsScaleAnims[index], {
        toValue: 1,
        tension: 150,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  }

  switch (id) {
    case 'my-listings':
      // Navigate to the My Listings page
      router.push('/my-listings');
      break;
    case 'sold-items':
      // Navigate to the Sold Items page (create this file too)
      router.push('/sold-items');
      break;
    case 'saved':
      // Navigate to the Saved Items page
      router.push('/saved');
      break;
    case 'reviews':
      // Navigate to the Reviews page
      router.push('/reviews');
      break;
    case 'messages':
      router.push('/messages');
      break;
    default:
      // Just show alert with animation
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
      ]).start(() => {
        Alert.alert('Coming Soon', 'This feature is coming soon!');
      });
  }
};

  const animateExit = (callback) => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1000,
        duration: 400,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (callback) callback();
    });
  };

  const handleBackPress = () => {
    animateExit(() => {
      router.back();
    });
  };

  const animateSwitchToggle = (setter, value) => {
    // Add a small bounce animation when toggling switches
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.01,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 150,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setter(!value);
    });
  };

  const animateLogoutPress = () => {
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
    ]).start(() => {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { 
            text: 'Cancel', 
            style: 'cancel',
            onPress: () => {
              // Reset animation
              Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 150,
                friction: 3,
                useNativeDriver: true,
              }).start();
            }
          },
          { 
            text: 'Logout', 
            style: 'destructive',
            onPress: () => {
              // Animate exit before logout
              animateExit(() => {
                Alert.alert('Logged Out', 'You have been logged out successfully');
              });
            }
          }
        ]
      );
    });
  };

  const handleSettingsPress = () => {
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
    ]).start(() => {
      Alert.alert('Settings', 'Advanced settings coming soon!');
    });
  };

  const handleSharePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 150,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Alert.alert('Share Profile', 'Share your profile link');
    });
  };

  if (!isVisible) {
    return (
      <View style={styles.container}>
        <View style={styles.topSection}>
          <View style={styles.topContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Blue Section (20%) */}
      <View style={styles.topSection}>
        <View style={styles.topContent}>
          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          {/* Settings Button */}
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={handleSettingsPress}
          >
            <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* User Profile with Animation */}
          <View style={styles.profileContainer}>
            {/* Profile Image with scale animation */}
            <Animated.View style={{ transform: [{ scale: profileImageScale }] }}>
              <TouchableOpacity onPress={pickProfileImage} activeOpacity={0.8}>
                <View style={styles.profileImageWrapper}>
                  {/* <Image 
                    source={{ uri: profilelogo }} 
                    style={styles.profileImage}
                  /> */}
                  <Image    style={styles.profileImage} source={require('../../../assets/images/avatar.png')} />


                  
                  <View style={styles.editImageButton}>
                    <Ionicons name="camera" size={14} color="#FFFFFF" />
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* User Info */}
            <Text style={styles.userName}>{currentUserData.name}</Text>
           
            
            {/* Rating */}
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#F6AD55" />
              <Text style={styles.ratingText}>{user.rating}</Text>
              <Text style={styles.ratingLabel}>Seller Rating</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom White Section (80%) with curved top - Animated */}
     <Animated.View
          style={[
            styles.bottomSection,
            {
              backgroundColor: theme.background,
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
              paddingBottom: tabBarHeight + insets.bottom + 5,
            },
            ]}
                  >
          <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
            {/* University Info Card */}
            <View style={styles.universityCard}>
              <Ionicons name="school" size={24} color="#00BFFF" />
              <View style={styles.universityInfo}>
                <Text style={styles.universityName}>{user.university}</Text>
                <Text style={styles.campusName}>{user.campus}</Text>
                <Text style={styles.studentId}>ID: {user.studentId}</Text>
              </View>
              <View style={styles.memberSince}>
                <Text style={styles.memberSinceText}>Member since</Text>
                <Text style={styles.memberSinceYear}>{user.memberSince}</Text>
              </View>
            </View>

            {/* Quick Stats Grid with animations */}
            <View style={styles.statsGrid}>
              {menuItems.map((item, index) => (
                <Animated.View
                  key={item.id}
                  style={{
                    transform: [{ scale: statsScaleAnims[index] }]
                  }}
                >
                  <TouchableOpacity
                    style={styles.statCard}
                    onPress={() => handleMenuItemPress(item.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.statIcon, { backgroundColor: item.color }]}>
                      <Ionicons name={item.icon} size={20} color="#FFFFFF" />
                    </View>
                    <Text style={styles.statCount}>{item.count}</Text>
                    <Text style={styles.statTitle}>{item.title}</Text>
                    {item.badge && (
                      <Animated.View 
                        style={[
                          styles.badge,
                          {
                            transform: [{
                              scale: statsScaleAnims[index].interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.5, 1]
                              })
                            }]
                          }
                        ]}
                      >
                        <Text style={styles.badgeText}>3</Text>
                      </Animated.View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>

            {/* Settings Section */}
            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>Settings</Text>
              {settingsItems.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.settingItem}
                  onPress={() => {
                  if (item.id === 'edit-profile' && item.onPress) {
                    item.onPress(); // This will trigger the animated navigation
                  } else if (item.type === 'link') {
                    // Add press animation for other links
                    Animated.sequence([
                      Animated.timing(scaleAnim, {
                        toValue: 1.01,
                        duration: 100,
                        useNativeDriver: true,
                      }),
                      Animated.spring(scaleAnim, {
                        toValue: 1,
                        tension: 150,
                        friction: 3,
                        useNativeDriver: true,
                      }),
                    ]).start(() => {
                      Alert.alert('Coming Soon', `${item.title} is coming soon!`);
                    });
                  }
                }}
                                  activeOpacity={0.7}
                >
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIcon}>
                      <Ionicons name={item.icon} size={22} color="#4A5568" />
                    </View>
                    <Text style={styles.settingText}>{item.title}</Text>
                  </View>
                  
                  {item.type === 'switch' ? (
                    <Switch
                      value={item.value}
                      onValueChange={() => animateSwitchToggle(item.onValueChange, item.value)}
                      trackColor={{ false: '#E2E8F0', true: '#00BFFF' }}
                      thumbColor="#FFFFFF"
                    />
                  ) : (
                    <Ionicons name="chevron-forward" size={20} color="#A0AEC0" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Contact Info */}
            <View style={styles.contactSection}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <View style={styles.contactItem}>
                <Ionicons name="call-outline" size={20} color="#718096" />
                <Text style={styles.contactText}>{currentUserData.phoneNumber}</Text>
              </View>
              <View style={styles.contactItem}>
                <Ionicons name="mail-outline" size={20} color="#718096" />
                <Text style={styles.contactText}>{currentUserData.email}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.shareButton}
                onPress={handleSharePress}
                activeOpacity={0.8}
              >
                <Ionicons name="share-social-outline" size={20} color="#00BFFF" />
                <Text style={styles.shareButtonText}>Share Profile</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.logoutButton}
                onPress={animateLogoutPress}
                activeOpacity={0.8}
              >
                <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

// Styles remain exactly the same as your provided code...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#00BFFF',
    backgroundColor:   '#00BFFF' 
  },
  topSection: {
    height: '20%',
    backgroundColor: '#00BFFF',
    paddingTop: 40,
  },
  topContent: {
    flex: 1,
    paddingHorizontal: 20,
    padding:10,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',

    top: 10, // Changed from 0 to 10
    left: 20, // Changed from 0 to 20

    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  settingsButton: {
    position: 'absolute',
    top: 10, // Changed from 0 to 10
    right: 20, // Changed from 0 to 20
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  profileImageWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#00BFFF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  ratingText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
    marginRight: 6,
  },
  ratingLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
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
  universityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    marginTop: 10,
  },
  universityInfo: {
    flex: 1,
    marginLeft: 12,
  },
  universityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 2,
  },
  campusName: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 2,
  },
  studentId: {
    fontSize: 12,
    color: '#718096',
  },
  memberSince: {
    alignItems: 'center',
  },
  memberSinceText: {
    fontSize: 10,
    color: '#A0AEC0',
    marginBottom: 2,
  },
  memberSinceYear: {
    fontSize: 20,
    fontWeight: '700',
    color: '#00BFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: (width - 72) / 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statCount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  settingsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 24,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#2D3748',
    fontWeight: '500',
  },
  contactSection: {
    marginBottom: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 15,
    color: '#4A5568',
    marginLeft: 12,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#00BFFF',
    paddingVertical: 16,
    borderRadius: 12,
  },
  shareButtonText: {
    color: '#00BFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  logoutButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4444',
    paddingVertical: 16,
    borderRadius: 12,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProfileScreen;