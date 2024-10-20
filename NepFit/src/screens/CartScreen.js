import React from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Image } from 'react-native';
import { useCart } from '../CartContext'; 

const CartScreen = ({ navigation }) => { 
  const { getCartItems, removeFromCart, updateQuantity } = useCart();
  const cartItems = getCartItems();

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
      
      <Text style={styles.itemText}>{item.productName}</Text>
      
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          onPress={() => {
            const newQuantity = item.quantity > 1 ? item.quantity - 1 : 1;
            updateQuantity(item, newQuantity);
          }}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
        <TouchableOpacity
          onPress={() => {
            updateQuantity(item, item.quantity + 1); 
          }}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.itemText}>Price: ${(item.price * item.quantity).toFixed(2)}</Text>
      
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => {
          removeFromCart(item);
          Alert.alert(`${item.productName} removed from cart!`);
        }}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  const handleCheckout = () => {
    navigation.navigate('Address', { cartItems }); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      {cartItems.length > 0 ? (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
          <Text style={styles.totalText}>Total Price: ${totalPrice}</Text>

          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Continue to Checkout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.emptyCartText}>Your cart is empty.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 18,
  },
  removeButton: {
    marginTop: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
  },
  emptyCartText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  quantityButtonText: {
    fontSize: 20,
    marginHorizontal: 10,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'right',
  },
  checkoutButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartScreen;