import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Button, TextInput, Alert } from 'react-native';

const CheckoutScreens = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const paymentDetails = {
    'Credit/Debit Card': {
      title: 'Credit/Debit Card Payment',
      info: 'Please enter your card details.',
    },
    'PayPal': {
      title: 'PayPal Payment',
      info: 'You will be redirected to PayPal to complete your payment securely.',
    },
    'Cash on Delivery': {
      title: 'Cash on Delivery',
      info: 'Please have the exact amount ready for the delivery person.',
    },
  };

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

      Alert.alert('Order placed successfully!', 'Your payment has been processed.');
    } else {
      Alert.alert('Order placed successfully!', `Payment method: ${selectedPayment}`);
    }

    setModalVisible(false); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      <Text>Your order summary and payment options will be displayed here.</Text>
      
      {Object.keys(paymentDetails).map(paymentType => (
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
            <Text style={styles.modalTitle}>{paymentDetails[selectedPayment]?.title}</Text>
            <Text style={styles.modalInfo}>{paymentDetails[selectedPayment]?.info}</Text>
            
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
