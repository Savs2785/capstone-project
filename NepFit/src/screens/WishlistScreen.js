import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useWishlist } from '../WishlistContext'; // Import the custom hook
import Header from '../components/Header';

const WishlistScreen = () => {
  const { wishlist, removeFromWishlist } = useWishlist(); // Access the wishlist and remove function from context

  const renderWishlistItem = ({ item }) => (
    <View style={styles.wishlistItem}>
      
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
      ) : (
        <Text>No image available</Text>
      )}
      <Text style={styles.productName}>{item.productName}</Text>
      <Text style={styles.productDescription}>{item.description}</Text>
      <Text style={styles.productPrice}>${item.price}</Text>
      <TouchableOpacity onPress={() => removeFromWishlist(item.productName)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Your Wishlist</Text>
      {wishlist.length > 0 ? (
        <FlatList
          data={wishlist}
          renderItem={renderWishlistItem}
          keyExtractor={(item) => item.productName}
        />
      ) : (
        <Text>No items in your wishlist.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  wishlistItem: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  productImage: {
    width: '100%',
    height: 100,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productDescription: {
    marginVertical: 5,
    fontSize: 12,
    color: '#555',
  },
  productPrice: {
    fontSize: 14,
    color: '#000',
  },
  removeButton: {
    backgroundColor: '#ff4d4d',
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  removeButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default WishlistScreen;