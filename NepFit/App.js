import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabs from './src/navigation/BottomTabs';
import { WishlistProvider } from './src/WishlistContext';
import { CartProvider } from './src/CartContext';


const App = () => {
  return (
      <CartProvider>
        <WishlistProvider>
          <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <NavigationContainer>
              <BottomTabs />
            </NavigationContainer>
          </SafeAreaView>
        </WishlistProvider>
      </CartProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
