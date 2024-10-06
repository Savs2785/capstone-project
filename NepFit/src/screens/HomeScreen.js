import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Image, FlatList, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import globalStyles from '../styles/globalStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { db } from '../firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { useWishlist } from '../WishlistContext'; 

const images = [
  require('../../assets/sale1.jpg'),
  require('../../assets/sale2.jpg'),
  require('../../assets/sale3.jpg'),
  require('../../assets/sale4.jpg'),
];

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']); // Initialize with 'All'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const navigation = useNavigation();
  const { addToWishlist } = useWishlist();

  // Handle search input changes
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    console.log('Search Query:', text);
  };

  // Rotating image effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Attempting to fetch products...');
        const productCollectionRef = collection(db, 'NepFitl'); 
        const productSnapshot = await getDocs(productCollectionRef);
        
        console.log('Number of documents fetched:', productSnapshot.size); 

        const productList = productSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log('Fetched Products:', productList);
        setProducts(productList);


        const uniqueCategories = [...new Set(productList.map(product => product.categories))];
        setCategories(['All', ...uniqueCategories]);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.categories === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productContainer}
      onPress={() => navigation.navigate('ProductDetail', { product: item })} 
    >
      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.productImage}
          resizeMode="contain"
        />
      ) : (
        <Text>No image available</Text>
      )}
      <Text style={styles.productTitle}>{item.productName}</Text>
      <Text style={styles.productPrice}>Price: ${item.price}</Text>
      <Text style={styles.productStock}>In Stock: {item.noOfStock}</Text>
      <TouchableOpacity 
        style={styles.wishlistButton} 
        onPress={() => addToWishlist(item)}
      >
        <Text style={styles.wishlistButtonText}>Add to Wishlist</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const handleCategorySelection = (category) => {
    setSelectedCategory(category);
    setModalVisible(false); // Close modal after selection
  };

  const resetCategorySelection = () => {
    setSelectedCategory('All');
  };

  return (
    <View style={globalStyles.container}>
      <Header />
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="What are you looking for?"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={images[currentImageIndex]}
          style={styles.image}
          resizeMode="cover"
        />
      </View>


      <View style={styles.filterContainer}>
        <Text style={styles.latestProductsLabel}>Latest Products</Text>
        <TouchableOpacity onPress={selectedCategory === 'All' ? () => setModalVisible(true) : resetCategorySelection}>
          <Icon name={selectedCategory === 'All' ? "filter-list" : "close"} size={24} color="#000" />
        </TouchableOpacity>
      </View>


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} 
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Select Category</Text>
            {categories.map((category, index) => (
              <Pressable 
                key={index} 
                style={styles.categoryOption}
                onPress={() => handleCategorySelection(category)} 
              >
                <Text style={styles.categoryText}>{category}</Text>
              </Pressable>
            ))}
            <Pressable 
              style={[styles.categoryOption, styles.cancelButton]}
              onPress={() => setModalVisible(false)} 
            >
              <Text style={styles.categoryText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      ) : (
        <Text>No products found...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 5,
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 5,
  },
  searchIcon: {
    color: '#999',
  },
  imageContainer: {
    height: 200,
    marginVertical: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  latestProductsLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'left',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#f44336', 
  },
  productContainer: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    maxWidth: '48%',
  },
  productImage: {
    width: '100%',
    height: 100,
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#000',
  },
  productStock: {
    fontSize: 14,
    color: '#000',
  },
  wishlistButton: {
    backgroundColor: '#007bff',
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  wishlistButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

export default HomeScreen;
