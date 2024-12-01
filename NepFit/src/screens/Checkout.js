import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Button, TextInput, Alert, FlatList, Image } from 'react-native';
import { useCart } from '../CartContext';
import { useOrder } from '../OrderHistoryContext';
import { CommonActions } from '@react-navigation/native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const CheckoutScreens = ({ navigation, route }) => {
  const { cartItems, shippingDetails } = route.params;
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const { clearCart } = useCart();
  const { addOrder } = useOrder();
  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const finalAmount = totalAmount - discountAmount;

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

  const checkDiscountCode = async () => {
    const db = getFirestore();
    const discountsRef = collection(db, 'discounts');

    const querySnapshot = await getDocs(query(discountsRef, where('code', '==', discountCode), where('isValid', '==', true)));

    if (!querySnapshot.empty) {
      const discountData = querySnapshot.docs[0].data();
      const discountPercentage = discountData.discountPercentage;
      const discount = (totalAmount * discountPercentage) / 100;
      setDiscountAmount(discount);
      Alert.alert('Discount Applied', `You saved ${discountPercentage}%!`);
    } else {
      Alert.alert('Invalid Discount Code', 'The discount code is not valid or expired.');
      setDiscountAmount(0);
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
      totalAmount: totalAmount,
      discountAmount: discountAmount,
      finalAmount: finalAmount,
    };

    addOrder(orderDetails);

    Alert.alert('Order placed successfully!', `Payment method: ${selectedPayment}, Total: $${finalAmount.toFixed(2)}`);

    clearCart();

    setModalVisible(false);

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'Profile', params: { orderDetails } },
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
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text>{item.productName}</Text>
              <Text>Quantity: {item.quantity}</Text>
            </View>
          </View>
        )}
      />

      <TextInput
        placeholder="Enter Discount Code"
        style={styles.input}
        value={discountCode}
        onChangeText={setDiscountCode}
      />
      <TouchableOpacity
        style={styles.paymentOption}
        onPress={checkDiscountCode}
      >
        <Text style={styles.paymentText}>Apply Discount</Text>
      </TouchableOpacity>

      <Text style={styles.priceText}>Total: ${totalAmount.toFixed(2)}</Text>
      {discountAmount > 0 && (
        <Text style={styles.priceText}>Discount Applied: -${discountAmount.toFixed(2)}</Text>
      )}
      <Text style={styles.priceText}>Final Total: ${finalAmount.toFixed(2)}</Text>

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
        onRequestClose={() => setModalVisible(!modalVisible)}
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
    paddingVertical: 15,
    paddingHorizontal: 20, 
    backgroundColor: '#007bff', 
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center', 
    justifyContent: 'center', 
    width: '70%', 
    maxWidth: 250, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    alignSelf: 'center', 
  },


  paymentText: {
    fontSize: 18,
    color: '#fff'
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
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

export default CheckoutScreens;