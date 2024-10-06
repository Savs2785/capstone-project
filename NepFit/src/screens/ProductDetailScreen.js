import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useCart } from '../CartContext'; 

const ProductDetailScreen = ({ route }) => {
  const { product } = route.params;
  const { addToCart, removeFromCart, getCartItems } = useCart();

  const [isInCart, setIsInCart] = useState(false);
  const [quantityInCart, setQuantityInCart] = useState(0); 

  useEffect(() => {
    const cartItems = getCartItems();
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setIsInCart(true);
      setQuantityInCart(existingItem.quantity); 
    } else {
      setIsInCart(false);
      setQuantityInCart(0); 
    }
  }, [getCartItems, product.id]);

  const handleAddToCart = () => {
    if (isInCart) {
      removeFromCart(product);
      setIsInCart(false);
      setQuantityInCart(0); 
      alert(`${product.productName} removed from cart!`);

    } else {
      addToCart({ ...product, quantity: 1 });
      setIsInCart(true);
      setQuantityInCart(1); 
      alert(`${product.productName} added to cart!`);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{product.productName}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.price}>Price: ${product.price}</Text>
      

      {isInCart && (
        <Text style={styles.quantityInCart}>
          In Cart: {quantityInCart} {quantityInCart > 1 }
        </Text>
      )}


      <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
        <Text style={styles.buttonText}>{isInCart ? 'Remove from Cart' : 'Add to Cart'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  description: {
    fontSize: 16,
    marginVertical: 5,
  },
  price: {
    fontSize: 20,
    color: 'green',
    marginVertical: 5,
  },
  quantityInCart: {
    fontSize: 16,
    marginVertical: 5,
    color: 'blue',
  },
  button: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProductDetailScreen;