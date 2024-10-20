import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Button, TextInput, Alert, FlatList, Image } from 'react-native';
import { useCart } from '../CartContext';
import { useOrder } from '../OrderHistoryContext';
import { CommonActions } from '@react-navigation/native';

const CheckoutScreens = ({ navigation, route }) => {
  const { cartItems, shippingDetails } = route.params;
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const { clearCart } = useCart();
  const { addOrder } = useOrder();

  const handlePaymentOptionPress = (paymentType) => {
    setSelectedPayment(paymentType);
    setModalVisible(true);
    if (paymentType !== 'Credit/Debit Card') {
      setCardNumber('');
      setCardHolder('');
      setExpiryDate('');
      setCvv('');
    }
  };

  const handleOrder = () => {
    if (selectedPayment === 'Credit/Debit Card') {
      if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
        Alert.alert('Error', 'Please fill in all card details.');
        return;
      }
    }
  
    const orderDetails = {
      paymentMethod: selectedPayment,
      cardHolder: cardHolder,
      cardNumber: cardNumber,
      expiryDate: expiryDate,
      cvv: cvv,
      items: cartItems,
      shippingDetails: shippingDetails,
    };
  
    addOrder(orderDetails);
    
    Alert.alert('Order placed successfully!', `Payment method: ${selectedPayment}`);
  
    clearCart();
  
    setModalVisible(false);
    
    // Reset navigation stack and navigate to Profile screen with order details
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'Profile', params: { orderDetails } }, // Pass the order details
        ],
      })
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>

      <FlatList
  data={cartItems}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => {
    return (
      <View style={styles.cartItem}>
        <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text>{item.productName}</Text>
          <Text>Quantity: {item.quantity}</Text>
        </View>
      </View>
    );
  }}
/>


      {['Credit/Debit Card', 'PayPal', 'Cash on Delivery'].map(paymentType => (
        <TouchableOpacity 
          key={paymentType}
          style={styles.paymentOption} 
          onPress={() => handlePaymentOptionPress(paymentType)}
        >
          <Text style={styles.paymentText}>{paymentType}</Text>
        </TouchableOpacity>
      ))}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{`${selectedPayment} Payment`}</Text>
            <Text style={styles.modalInfo}>Please enter your payment details.</Text>

            {selectedPayment === 'Credit/Debit Card' && (
              <>
                <TextInput
                  placeholder="Cardholder Name"
                  style={styles.input}
                  value={cardHolder}
                  onChangeText={setCardHolder}
                />
                <TextInput
                  placeholder="Card Number"
                  style={styles.input}
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  keyboardType="numeric"
                />
                <TextInput
                  placeholder="MM/YY"
                  style={styles.input}
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                  maxLength={5} 
                />
                <TextInput
                  placeholder="CVV"
                  style={styles.input}
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="numeric"
                  maxLength={3}
                />
              </>
            )}
            <Button title="Confirm Payment" onPress={handleOrder} />
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  paymentOption: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginVertical: 10,
  },
  paymentText: {
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInfo: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    color: 'blue',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    width: '100%',
  },
});

export default CheckoutScreens;
