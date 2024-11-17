import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabs from './src/navigation/BottomTabs';
import Login from './src/screens/login';
import SignUp from './src/screens/signUp';
import { OrderProvider } from './src/OrderHistoryContext';
import { WishlistProvider } from './src/WishlistContext';
import { CartProvider } from './src/CartContext';
import { auth } from './src/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Stack = createStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  return (
    <OrderProvider>
      <CartProvider>
        <WishlistProvider>
          <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <NavigationContainer>
              {user ? (
                <BottomTabs />
              ) : (
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="Login" component={Login} />
                  <Stack.Screen name="SignUp" component={SignUp} />
                </Stack.Navigator>
              )}
            </NavigationContainer>
          </SafeAreaView>
        </WishlistProvider>
      </CartProvider>
    </OrderProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;