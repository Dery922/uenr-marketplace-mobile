// components/CustomDrawerContent.tsx
import { getCurrentUser } from '@/api/authApi';
import { deleteToken } from '@/utils/tokenStorage';
import { Ionicons } from '@expo/vector-icons';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { router } from "expo-router";
import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const CustomDrawerContent = (props: any) => {
  const handleLogout = async () => {
  try {
    await deleteToken()
    console.log("Token deleted");
    router.push("/(auth)/LandingScreen")
  } catch (error) {
    console.log("Logout error:", error);
  }
};

  useEffect(() => {
    const fetchUser = async ()=>{
        try {
      const res = await getCurrentUser();

       setCurrentUserData(res.data);
    } catch (error) {
      console.log(error);
    }
    }
  
    fetchUser();
  },[])


const [currentUserData, setCurrentUserData] = useState({})
  return (
    <View style={styles.container}>
      <DrawerContentScrollView 
        {...props}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Drawer Header with User Profile */}
        <View style={styles.drawerHeader}>
     
           <Image style={styles.profileImage} source={require('../assets/images/avatar.png')} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{currentUserData.name}</Text>
            <Text style={styles.userEmail}>{currentUserData.email}</Text>
            <View style={styles.statusBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#38A169" />
              <Text style={styles.statusText}>Verified Student</Text>
            </View>
          </View>
          
          {/* Campus Badge */}
          <View style={styles.campusBadge}>
            <Ionicons name="school" size={12} color="#00BFFF" />
       
          </View>
        </View>



        {/* Main Drawer Items */}
        <DrawerItemList {...props} />

        {/* Additional Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Home</Text>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="library-outline" size={22} color="#4A5568" />
            </View>
            <Text style={styles.menuText}>Library Books</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="fast-food-outline" size={22} color="#4A5568" />
            </View>
            <Text style={styles.menuText}>Cafeteria Deals</Text>
          </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="cog-outline" size={22} color="#4A5568" />
            </View>
            <Text style={styles.menuText}>Campus Services</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="car-outline" size={22} color="#4A5568" />
            </View>
            <Text style={styles.menuText}>Campus Transport</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other</Text>
          <TouchableOpacity style={styles.menuItem}>
           
            <Text style={styles.menuText}>Terms and Conditions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
    
            <Text style={styles.menuText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>

      {/* Drawer Footer */}
      <View style={styles.drawerFooter}>
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={22} color="#E53E3E" />
          <Text style={styles.logoutText} onPress={handleLogout}>Log Out</Text>
        </TouchableOpacity>
        <Text style={styles.versionText}>UENR Market v1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingTop: 10,
  },
drawerHeader: { 
  flexDirection: 'row',
  alignItems: 'center',   // ✅ THIS IS KEY
  paddingHorizontal: 20,
  paddingVertical: 24,
  backgroundColor: '#F8FAFC',
  borderBottomWidth: 1,
  borderBottomColor: '#E2E8F0',
},

  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#00BFFF',
  },
userInfo: {
  flex: 1,               // ✅ take remaining space
  marginLeft: 16,        // ✅ spacing from image
},

  userName: {
    fontSize: 20,
    fontFamily: 'InterBold',
    color: '#1A365D',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'InterRegular',
    color: '#718096',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FFF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'InterSemiBold',
    color: '#38A169',
    marginLeft: 4,
  },
  campusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 191, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  campusText: {
    fontSize: 12,
    fontFamily: 'InterSemiBold',
    color: '#00BFFF',
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
    marginHorizontal: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#A0AEC0',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  menuIcon: {
    width: 40,
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    fontFamily: 'InterMedium',
    color: '#2D3748',
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#E53E3E',
    marginLeft: 12,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'InterRegular',
    color: '#A0AEC0',
    textAlign: 'center',
  },
});

export default CustomDrawerContent;