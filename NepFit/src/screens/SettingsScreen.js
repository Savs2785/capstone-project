import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';
import globalStyles from '../styles/globalStyles';

const SettingsScreen = () => {
  return (
    <View style={globalStyles.container}>
      <Header />
      <Text style={styles.screenText}>Settings Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screenText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SettingsScreen;
