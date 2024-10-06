import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabs from './src/navigation/BottomTabs';
import WishlistScreen from './src/screens/WishlistScreen';
import { WishlistProvider } from './src/WishlistContext';


const App = () => {
  return (
    <WishlistProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <NavigationContainer>
          <BottomTabs />
        </NavigationContainer>
      </SafeAreaView>
      </WishlistProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
