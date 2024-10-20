import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import Header from '../components/Header';
import globalStyles from '../styles/globalStyles';
import { useOrder } from '../OrderHistoryContext'; 

const SettingsScreen = () => {
  const { orders } = useOrder();

  return (
    <View style={globalStyles.container}>
      <Header />
      <Text style={styles.screenText}>Your Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.orderContainer}>
            <Text style={styles.paymentMethodText}>Payment Method: {item.paymentMethod}</Text>
            {item.paymentMethod === 'Credit/Debit Card' && (
              <>
                <Text>Cardholder Name: {item.cardHolder}</Text>
                <Text>Card Number: **** **** **** {item.cardNumber.slice(-4)}</Text>
                <Text>Expiry Date: {item.expiryDate}</Text>
              </>
            )}
            <FlatList
              data={item.items} 
              keyExtractor={(item) => item.id.toString()} 
              renderItem={({ item }) => {
                console.log('Item Name:', item.productName);
                console.log('Item Image URL:', item.imageUrl);

                return (
                  <View style={styles.cartItem}>
                    <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
                    <View style={styles.productDetails}>
                      <Text style={styles.productName}>{item.productName}</Text>
                      <Text style={{ fontSize: 12 }}>Quantity: {item.quantity}</Text>

                    </View>
                  </View>
                );
              }}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  orderContainer: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginVertical: 10,
  },
  paymentMethodText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 5, 
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
