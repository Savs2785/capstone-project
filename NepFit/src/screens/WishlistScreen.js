import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';

const WishlistScreen = () => {
  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Your Wishlist</Text>
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
});

export default WishlistScreen;
