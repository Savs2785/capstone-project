import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WishlistScreen from '../screens/WishlistScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';

const Stack = createStackNavigator();

const WishlistStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="wishlist" 
        component={WishlistScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen} 
        options={{ title: 'Product Details' }} 
      />
    </Stack.Navigator>
  );
};

export default WishlistStack;
