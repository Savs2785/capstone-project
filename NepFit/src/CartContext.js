import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (itemWithQuantity) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === itemWithQuantity.id);

      if (existingItem) {
        return prevItems.map(item =>
          item.id === itemWithQuantity.id
            ? { ...item, quantity: item.quantity + itemWithQuantity.quantity }
            : item
        );
      } else {
        return [...prevItems, itemWithQuantity];
      }
    });
  };

  const updateQuantity = (item, newQuantity) => {
    setCartItems((prevItems) => 
      prevItems.map(cartItem =>
        cartItem.id === item.id ? { ...cartItem, quantity: newQuantity } : cartItem
      )
    );
  };

  const removeFromCart = (item) => {
    setCartItems((prevItems) => prevItems.filter(cartItem => cartItem.id !== item.id));
  };

  const getCartItems = () => cartItems;

  const clearCart = () => {
    setCartItems([]);
  };
  
  return (
    <CartContext.Provider value={{ addToCart, updateQuantity, removeFromCart, getCartItems, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);