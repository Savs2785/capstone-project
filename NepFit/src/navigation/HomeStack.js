// HomeStack.js
import React from 'react';
import CheckoutScreens from '../screens/Checkout';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import AddressScreen from '../screens/ShippingAddressScreen';

const Stack = createStackNavigator();

const HomeStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProductDetail"
                component={ProductDetailScreen}
                options={{ title: 'Product Details' }}
            />
             <Stack.Screen
                name="Address"
                component={AddressScreen}
                options={{ title: 'Shipping Address' }}
            />
            <Stack.Screen
                name="Checkout"
                component={CheckoutScreens}
                options={{ title: 'Checkout' }}
            />
        </Stack.Navigator>
    );
};

export default HomeStack;
