// app/my-listings/index.tsx
import { deleteProduct, getMyProducts } from "@/api/productApi";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { GestureHandlerRootView, RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { SafeAreaView } from 'react-native-safe-area-context';


const { width, height } = Dimensions.get('window');

interface ListingItem {
  id: string;
  title: string;
  price: string;
  status: 'active' | 'sold' | 'draft' | 'pending';
  image: string;
  date: string;
  views: number;
  category: string;
  description?: string;
  location?: string;
  condition?: 'new' | 'like-new' | 'good' | 'fair';
}

const MyListingsScreen = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [listings, setListings] = useState<ListingItem[]>([

  ]);

  const [editingItem, setEditingItem] = useState<ListingItem | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedPrice, setEditedPrice] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const swipeableRefs = useRef<{[key: string]: Swipeable | null}>({});

  const filters = [
    { id: 'all', label: 'All', count: listings.length, icon: 'grid' },
    { id: 'active', label: 'Active', count: listings.filter(l => l.status === 'active').length, icon: 'flash' },
    { id: 'sold', label: 'Sold', count: listings.filter(l => l.status === 'sold').length, icon: 'checkmark-circle' },
    { id: 'pending', label: 'Pending', count: listings.filter(l => l.status === 'pending').length, icon: 'time' },
    { id: 'draft', label: 'Drafts', count: listings.filter(l => l.status === 'draft').length, icon: 'document' },
  ];

  const handleFilterPress = (filterId: string) => {
    setActiveFilter(filterId);
    // Close any open swipeables
    Object.values(swipeableRefs.current).forEach(ref => ref?.close());
  };

  const filteredListings = listings.filter(listing => {
    if (activeFilter === 'all') return true;
    return listing.status === activeFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#38A169';
      case 'sold': return '#ED8936';
      case 'pending': return '#D69E2E';
      case 'draft': return '#718096';
      default: return '#718096';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return 'flash';
      case 'sold': return 'checkmark-circle';
      case 'pending': return 'time';
      case 'draft': return 'document';
      default: return 'help-circle';
    }
  };

  const handleEdit = (item: ListingItem) => {
    setEditingItem(item);
    setEditedTitle(item.title);
    setEditedPrice(item.price);
    setEditedDescription(item.description || '');
    setIsActive(item.status === 'active');
    setIsEditModalVisible(true);
    swipeableRefs.current[item.id]?.close();
  };

  const handleSaveEdit = () => {
    if (!editingItem || !editedTitle.trim() || !editedPrice.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setListings(prev => prev.map(item => 
      item.id === editingItem.id 
        ? {
            ...item,
            title: editedTitle,
            price: editedPrice,
            description: editedDescription,
            status: isActive ? 'active' : 'draft',
            date: 'Just now'
          }
        : item
    ));

    Alert.alert('Success', 'Listing updated successfully');
    setIsEditModalVisible(false);
    setEditingItem(null);
  };

  // const handleDelete = (itemId: string) => {
  //   setItemToDelete(itemId);
  //   setIsDeleteModalVisible(true);
  // };

const handleDelete = async (itemId: string) => {
  try {
    await deleteProduct(itemId);

    // remove product from list UI
    setListings(prev => prev.filter(item => item._id !== itemId));

    // refetch updated count
    fetchProductCount();

    Alert.alert("Success", "Product deleted");

  } catch (error) {
    Alert.alert("Error", "Failed to delete product");
  }
};
  const confirmDelete = () => {
    if (itemToDelete) {
      setListings(prev => prev.filter(item => item.id !== itemToDelete));
      Alert.alert('Success', 'Listing deleted successfully');
    }
    setIsDeleteModalVisible(false);
    setItemToDelete(null);
  };

  const handleDuplicate = (item: ListingItem) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      title: `${item.title} (Copy)`,
      date: 'Just now',
      views: 0,
      status: 'draft' as const
    };

    setListings(prev => [newItem, ...prev]);
    Alert.alert('Success', 'Listing duplicated successfully');
    swipeableRefs.current[item.id]?.close();
  };

  const handleViewStats = (item: ListingItem) => {
    Alert.alert(
      'Listing Statistics',
      `Title: ${item.title}\nViews: ${item.views}\nStatus: ${item.status}\nPosted: ${item.date}\nCategory: ${item.category}`,
      [{ text: 'OK' }]
    );
    swipeableRefs.current[item.id]?.close();
  };

  const handleToggleStatus = (itemId: string) => {
    setListings(prev => prev.map(item => 
      item.id === itemId 
        ? {
            ...item,
            status: item.status === 'active' ? 'draft' : 'active',
            date: 'Updated now'
          }
        : item
    ));
  };

  const renderRightActions = (item: ListingItem) => {
    return (
      <View style={styles.swipeActions}>
        <RectButton
          style={[styles.swipeButton, { backgroundColor: '#ED8936' }]}
          onPress={() => handleEdit(item)}
        >
          <Ionicons name="create-outline" size={22} color="#FFFFFF" />
          <Text style={styles.swipeButtonText}>Edit</Text>
        </RectButton>
        
        {/* <RectButton
          style={[styles.swipeButton, { backgroundColor: '#38A169' }]}
          onPress={() => handleDuplicate(item)}
        >
          <Ionicons name="copy-outline" size={22} color="#FFFFFF" />
          <Text style={styles.swipeButtonText}>Duplicate</Text>
        </RectButton> */}
{/*         
        <RectButton
          style={[styles.swipeButton, { backgroundColor: '#D69E2E' }]}
          onPress={() => handleViewStats(item)}
        >
          <Ionicons name="stats-chart-outline" size={22} color="#FFFFFF" />
          <Text style={styles.swipeButtonText}>Stats</Text>
        </RectButton> */}
        
        <RectButton
          style={[styles.swipeButton, { backgroundColor: '#E53E3E' }]}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
          <Text style={styles.swipeButtonText}>Delete</Text>
        </RectButton>
      </View>
    );
  };

  const renderListingItem = ({ item }: { item: ListingItem }) => (
    
    <Swipeable
      ref={ref => swipeableRefs.current[item.id] = ref}
      renderRightActions={() => renderRightActions(item)}
      overshootRight={false}
      friction={2}
    >
      <TouchableOpacity 
        style={styles.listingCard}
        onPress={() => Alert.alert('View Listing', `View details for ${item.title}`)}
        activeOpacity={0.9}
      >
   
        <Image source={{ uri: item.image }} style={styles.listingImage} />

        <View style={styles.listingContent}>
          <View style={styles.listingHeader}>
            <View style={styles.titleContainer}>
              <Text style={styles.listingTitle} numberOfLines={1}>{item.title}</Text>
              <TouchableOpacity 
                style={styles.quickAction}
                onPress={() => handleToggleStatus(item.id)}
              >
                <Ionicons 
                  name={item.status === 'active' ? 'eye-off-outline' : 'eye-outline'} 
                  size={16} 
                  color={item.status === 'active' ? '#38A169' : '#718096'} 
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.listingPrice}>{item.price}</Text>
          </View>

          <Text style={styles.listingDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.listingFooter}>
            <View style={styles.footerLeft}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                <Ionicons 
                  name={getStatusIcon(item.status)} 
                  size={12} 
                  color={getStatusColor(item.status)} 
                />
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                  {/* {item.status.charAt(0).toUpperCase() + item.status.slice(1)} */}
                </Text>
              </View>
              
              <View style={styles.viewContainer}>
                <Ionicons name="eye-outline" size={12} color="#718096" />
                <Text style={styles.viewsText}>{item.views} views</Text>
              </View>
            </View>

            <View style={styles.footerRight}>
              <Text style={styles.dateText}>{item.date}</Text>
              <TouchableOpacity 
                style={styles.moreButton}
                onPress={() => {
                  Alert.alert(
                    'Quick Actions',
                    'Choose an action:',
                    [
                      { text: 'Edit', onPress: () => handleEdit(item) },
                      { text: 'Cancel', style : 'cancel'},
                      { text: 'View Stats', onPress: () => handleViewStats(item) },
                      { text: 'Delete', onPress: () => handleDelete(item.id) },
                  
                    ]
                  );
                }}
              >
                <Ionicons name="ellipsis-vertical" size={16} color="#A0AEC0" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await getMyProducts();
    const formatted = res.data.map((product: any) => ({
  id: product._id,
  title: product.title,
  price: product.price,
  status: product.status || 'active',
 image: product.images?.[0] 
  ? product.images[0]
  : 'https://via.placeholder.com/400x300.png?text=No+Image',
  date: new Date(product.createdAt).toLocaleDateString(),
  views: 0,
  category: product.category,
  description: product.description,
}));
      setListings(formatted);
     
    } catch (error) {
      console.log(error);
    }
  };
  fetchProducts();
}, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#2D3748" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>My Listings</Text>
            <Text style={styles.headerSubtitle}>{listings.length} total items</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push("/sell")}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <FlatList
            data={filters}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.filterList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeFilter === item.id && styles.activeFilterButton
                ]}
                onPress={() => handleFilterPress(item.id)}
              >
                <Ionicons 
                  name={item.icon as any} 
                  size={16} 
                  color={activeFilter === item.id ? '#FFFFFF' : '#718096'} 
                />
      
                <Text style={[
                  styles.filterText,
                  activeFilter === item.id && styles.activeFilterText
                ]}>
                  {item.label}
                </Text>
                <View style={[
                  styles.countBadge,
                  activeFilter === item.id && styles.activeCountBadge
                ]}>
                  <Text style={styles.countText}>{item.count}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Stats Bar */}
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{listings.filter(l => l.status === 'active').length}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{listings.reduce((sum, item) => sum + item.views, 0)}</Text>
            <Text style={styles.statLabel}>Total Views</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{listings.filter(l => l.status === 'sold').length}</Text>
            <Text style={styles.statLabel}>Sold</Text>
          </View>
        </View>

        {/* Listings */}
        <FlatList
          data={filteredListings}
          renderItem={renderListingItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="list" size={80} color="#CBD5E0" />
              <Text style={styles.emptyTitle}>No listings found</Text>
              <Text style={styles.emptySubtitle}>
                {activeFilter === 'all' 
                  ? 'Start by creating your first listing!' 
                  : `No ${activeFilter} listings found`}
              </Text>
              <TouchableOpacity style={styles.createButton}>
                <Ionicons name="add-circle" size={20} color="#FFFFFF" />
                <Text onPress={() => router.push("/sell")} style={styles.createButtonText}>Create New Listing</Text>
              </TouchableOpacity>
            </View>
          }
        />

        {/* Edit Modal */}
        <Modal
          visible={isEditModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsEditModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Listing</Text>
                <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#4A5568" />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Title *</Text>
                <TextInput
                  style={styles.input}
                  value={editedTitle}
                  onChangeText={setEditedTitle}
                  placeholder="Enter listing title"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Price *</Text>
                <TextInput
                  style={styles.input}
                  value={editedPrice}
                  onChangeText={setEditedPrice}
                  placeholder="Enter price"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={editedDescription}
                  onChangeText={setEditedDescription}
                  placeholder="Enter description"
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Make Listing Active</Text>
                <Switch
                  value={isActive}
                  onValueChange={setIsActive}
                  trackColor={{ false: '#E2E8F0', true: '#38A169' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsEditModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSaveEdit}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          visible={isDeleteModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsDeleteModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.deleteModalContent}>
              <View style={styles.deleteIconContainer}>
                <Ionicons name="warning" size={60} color="#E53E3E" />
              </View>
              <Text style={styles.deleteTitle}>Delete Listing?</Text>
              <Text style={styles.deleteText}>
                This action cannot be undone. The listing will be permanently deleted.
              </Text>
              <View style={styles.deleteButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelDeleteButton]}
                  onPress={() => setIsDeleteModalVisible(false)}
                >
                  <Text style={styles.cancelDeleteButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.confirmDeleteButton]}
                  onPress={confirmDelete}
                >
                  <Text style={styles.confirmDeleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
    marginTop: 2,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00BFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  filterList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#F7FAFC',
  },
  activeFilterButton: {
    backgroundColor: '#00BFFF',
  },
  filterText: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '500',
    marginLeft: 6,
    marginRight: 8,
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  countBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
  },
  activeCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  countText: {
    fontSize: 11,
    color: '#718096',
    fontWeight: '600',
    textAlign: 'center',
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    marginTop: 8,
    borderRadius: 12,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3748',
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#E2E8F0',
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  listingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  listingImage: {
    width: '100%',
    height: 160,
  },
  listingContent: {
    padding: 16,
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    flex: 1,
    marginRight: 8,
  },
  quickAction: {
    padding: 4,
  },
  listingPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#00BFFF',
    marginLeft: 8,
  },
  listingDescription: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
    marginBottom: 12,
  },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  viewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewsText: {
    fontSize: 12,
    color: '#718096',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  moreButton: {
    padding: 4,
  },
  swipeActions: {
    flexDirection: 'row',
    width: 240,
  },
  swipeButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  swipeButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4A5568',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00BFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: height * 0.85,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D3748',
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2D3748',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelButtonText: {
    color: '#4A5568',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#00BFFF',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  deleteIconContainer: {
    marginBottom: 20,
  },
  deleteTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 12,
  },
  deleteText: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  deleteButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelDeleteButton: {
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelDeleteButtonText: {
    color: '#4A5568',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmDeleteButton: {
    backgroundColor: '#E53E3E',
  },
  confirmDeleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MyListingsScreen;