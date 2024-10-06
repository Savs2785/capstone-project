import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = ({ userImage }) => {
  const handleBellPress = () => {
    console.log('Bell icon pressed!');
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftHeader}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <Text style={styles.label}>NepFit</Text>
      </View>

      <View style={styles.rightHeader}>
        <TouchableOpacity onPress={handleBellPress}>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
        {userImage && (
          <Image
            source={{ uri: userImage }} // Use the user's image from props
            style={styles.userImage}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
});

export default Header;
