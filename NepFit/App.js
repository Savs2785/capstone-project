import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, View, Text, ActivityIndicator } from 'react-native';
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
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createStackNavigator();

const SplashScreen = () => {
  return (
    <View style={styles.splashContainer}>
      <Text style={styles.appName}>NepFit</Text>
      <Text style={styles.appDescription}>
      Elevate Your Fitness Journey.
      </Text>
      <ActivityIndicator size="large" color="black" />
    </View>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const splashTimer = setTimeout(() => setIsSplashVisible(false), 1500);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      clearTimeout(splashTimer);
      unsubscribe();
    };
  }, []);

  if (isSplashVisible) {
    return <SplashScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
                    <Stack.Screen name="login" component={Login} />
                    <Stack.Screen name="SignUp" component={SignUp} />
                  </Stack.Navigator>
                )}
              </NavigationContainer>
            </SafeAreaView>
          </WishlistProvider>
        </CartProvider>
      </OrderProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginTop: 20,
  },
  appDescription: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 10,
    marginBottom: 10
  },
});

export default App;
