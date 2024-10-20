import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Image, FlatList, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import globalStyles from '../styles/globalStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useWishlist } from '../WishlistContext';
import { ProductSearch } from '../ProductSearchContext';

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
  const [suggestions, setSuggestions] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const { addToWishlist } = useWishlist();

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    if (text) {
      const filteredSuggestions = products.filter(product =>
        product.productName.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    try {
      const productCollectionRef = collection(db, 'NepFitl');
      const productSnapshot = await getDocs(productCollectionRef);
      const productList = productSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(productList);

      const uniqueCategories = [...new Set(productList.map(product => product.categories))];
      setCategories(['All', ...uniqueCategories]);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  const filteredProducts = ProductSearch(products, searchQuery, selectedCategory);

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
    setModalVisible(false);
  };

  const resetCategorySelection = () => {
    setSelectedCategory('All');
  };

  const handleSuggestionPress = (item) => {
    setSearchQuery(item.productName);
    setSuggestions([]);
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
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => {
            setSearchQuery('');
            setSuggestions([]);
          }}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((item) => (
            <TouchableOpacity key={item.id} onPress={() => handleSuggestionPress(item)}>
              <Text style={styles.suggestionText}>{item.productName}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.imageContainer}>
        <Image
          source={images[currentImageIndex]}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.latestProductsLabel}>Latest Products</Text>
        <View style={styles.filterSortContainer}>
          <TouchableOpacity onPress={selectedCategory === 'All' ? () => setModalVisible(true) : resetCategorySelection}>
            <Icon name={selectedCategory === 'All' ? "filter-list" : "close"} size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Selection Modal */}
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

// Add the new style for clear button
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
  clearText: {
    color: '#007bff',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  suggestionsContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    zIndex: 1000,
    maxHeight: 200,
  },
  suggestionText: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
  filterSortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 20,
  },
  categoryOption: {
    padding: 10,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  categoryText: {
    fontSize: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  productContainer: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  productImage: {
    width: '100%',
    height: 100,
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 14,
    marginVertical: 5,
  },
  productStock: {
    fontSize: 12,
    marginBottom: 10,
    color: 'green',
  },
  wishlistButton: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  wishlistButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen;