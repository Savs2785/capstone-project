// BottomTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack'; // Import your HomeStack
import WishlistScreen from '../screens/WishlistScreen'; // Adjust the import path as needed
import CartScreen from '../screens/CartScreen'; // Adjust the import path as needed
import SettingsScreen from '../screens/SettingsScreen'; // Adjust the import path as needed
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Wishlist':
              iconName = focused ? 'heart' : 'heart-outline';
              break;
            case 'Cart':
              iconName = focused ? 'cart' : 'cart-outline';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'home';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack} // Use the HomeStack instead of HomeScreen
        options={{ headerShown: false }} // Hide the header for Home
      />
      <Tab.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{ headerShown: false }} // Hide the header for Wishlist
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ headerShown: false }} // Hide the header for Cart
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }} // Hide the header for Settings
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
