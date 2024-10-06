import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';
import globalStyles from '../styles/globalStyles';

const AddressScreen = () => {
  return (
    <View style={globalStyles.container}>
      <Text style={styles.screenText}>Address Screen</Text>
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

export default AddressScreen;
