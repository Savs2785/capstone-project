import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity, Modal, Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import Header from '../components/Header';
import globalStyles from '../styles/globalStyles';
import { useOrder } from '../OrderHistoryContext';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubscriptionModalVisible, setIsSubscriptionModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);  // Store selected plan
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const { orders } = useOrder();
  const navigation = useNavigation();

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            setName(data.name);
            setEmail(data.email);
            setAge(data.age);
            setSelectedPlan(data.selectedPlan || null); // Set selected plan from user data
          } else {
            console.log('No user found!');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateProfile = async () => {
    const user = auth.currentUser;

    if (user) {
      try {
        setLoading(true);
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          name: name,
          email: email,
          age: age,
          selectedPlan: selectedPlan,  // Update the subscription plan in Firestore
        });

        const updatedUserDoc = await getDoc(userDocRef);
        if (updatedUserDoc.exists()) {
          setUserData(updatedUserDoc.data());
          alert('Profile updated successfully!');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile.');
      } finally {
        setLoading(false);
        setIsModalVisible(false);
      }
    }
  };

  // Subscription Payment Function
  const handleSubscriptionPayment = () => {
    if (!selectedPlan) {
      Alert.alert('Error', 'Please select a subscription plan.');
      return;
    }
    if (!cardHolder || !cardNumber || !expiryDate || !cvv) {
      Alert.alert('Error', 'Please fill out all card details.');
      return;
    }

    // Proceed with payment logic
    Alert.alert(`Payment Successful, You have subscribed to the ${selectedPlan} plan.`);

    // Update the user's subscription plan in Firestore
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      updateDoc(userDocRef, {
        selectedPlan: selectedPlan,  // Store the selected plan
      });
    }

    setIsSubscriptionModalVisible(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Error logging out.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={globalStyles.container}>
      <Header />
      <Text style={styles.screenText}>Your Profile</Text>
      {userData && (
        <View style={styles.profileContainer}>
          <Text>Name: {userData.name}</Text>
          <Text>Email: {userData.email}</Text>
          <Text>Age: {userData.age}</Text>
          {selectedPlan && (
            <Text style={styles.subscriptionBadge}>{selectedPlan} Member</Text>
          )}
        </View>
      )}

      <TouchableOpacity style={styles.updateButton} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.subscriptionButton} onPress={() => setIsSubscriptionModalVisible(true)}>
        <Text style={styles.buttonText}>Subscribe to a Plan</Text>
      </TouchableOpacity>

      <Text style={styles.screenText}>Your Orders</Text>
      <FlatList
  data={orders.length > 0 ? orders : [{ paymentMethod: 'Debit/Credit Card', items: [] }]}  // Check if orders are available
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
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.productName}</Text>
              <Text style={{ fontSize: 12 }}>Quantity: {item.quantity}</Text>
            </View>
          </View>
        )}
      />

      {/* Add Gift Box Text Based on Plan */}
      {orders.length === 0 ? (  // Check if orders is empty and show the gift text
        <>
          <Text style={styles.giftBoxText}>
            {selectedPlan === 'Basic' && 'Basic Order Box'}
            {selectedPlan === 'Elite' && 'Elite Order Box'}
            {selectedPlan === 'VIP' && 'VIP Order Box'}
          </Text>
          {/* Additional Discount Message */}
          <Text style={styles.giftSemiBoxText}>
            {selectedPlan === 'Basic' && 'You will not get a discount as Basic member.'}
            {selectedPlan === 'Elite' && 'You will get a 10% discount as Elite member.'}
            {selectedPlan === 'VIP' && 'You will get a 15% discount as VIP member.'}
          </Text>
        </>
      ) : null}
    </View>
  )}
/>



      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Update Profile</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Age"
              value={age}
              onChangeText={setAge}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
  visible={isSubscriptionModalVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setIsSubscriptionModalVisible(false)}
>
  <View style={styles.modalBackground}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Select a Subscription Plan</Text>

      {/* Basic Plan Button */}
      <TouchableOpacity
        style={[styles.planButton, selectedPlan === 'Basic' && styles.selectedPlanButton]}
        onPress={() => setSelectedPlan('Basic')}
      >
        <Text style={styles.buttonText}>Basic 10$/Month</Text>
      </TouchableOpacity>

      {/* Elite Plan Button */}
      <TouchableOpacity
        style={[styles.planButton, selectedPlan === 'Elite' && styles.selectedPlanButton]}
        onPress={() => setSelectedPlan('Elite')}
      >
        <Text style={styles.buttonText}>Elite 20$/Month</Text>
      </TouchableOpacity>

      {/* VIP Plan Button */}
      <TouchableOpacity
        style={[styles.planButton, selectedPlan === 'VIP' && styles.selectedPlanButton]}
        onPress={() => setSelectedPlan('VIP')}
      >
        <Text style={styles.buttonText}>VIP 30$/Month</Text>
      </TouchableOpacity>

      <TextInput
  style={styles.input}
  placeholder="Cardholder Name"
  placeholderTextColor="#888"
  value={cardHolder}
  onChangeText={setCardHolder}
/>
<TextInput
  style={styles.input}
  placeholder="Card Number"
  placeholderTextColor="#888"
  value={cardNumber}
  onChangeText={setCardNumber}
/>
<TextInput
  style={styles.input}
  placeholder="Expiry Date"
  placeholderTextColor="#888"
  value={expiryDate}
  onChangeText={setExpiryDate}
/>
<TextInput
  style={styles.input}
  placeholder="CVV"
  placeholderTextColor="#888"
  value={cvv}
  onChangeText={setCvv}
  secureTextEntry={true}
/>

      <View style={styles.modalActions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => setIsSubscriptionModalVisible(false)}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubscriptionPayment}>
          <Text style={styles.buttonText}>Subscribe</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>


      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screenText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  profileContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
  },
  subscriptionBadge: {
    color: 'green',
    fontWeight: 'bold',
  },
  updateButton: {
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    marginBottom: 20,
  },
  subscriptionButton: {
    padding: 15,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    marginBottom: 20,
  },
  logoutButton: {
    padding: 15,
    backgroundColor: '#f44336',
    borderRadius: 5,
    marginBottom: 20,
  },
  orderContainer: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  giftBoxText: {
    fontSize: 14,
    marginTop: 10,
    fontStyle: 'italic',
    color: 'black',
  },
  paymentMethodText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#f44336',
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    flex: 1,
  },
  planButton: {
    padding: 15,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  planButton: {
    padding: 15,
    backgroundColor: '#FFFFFF', // Default white background
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc', // Border color for unselected plan
  },
  selectedPlanButton: {
    backgroundColor: '#4CAF50', // Highlight selected plan with green background
    borderColor: '#4CAF50', // Change border to match the selected plan color
  },
  giftBoxText: {
    fontSize: 14,
    marginTop: 10,
    fontWeight: 'bold',  // Use fontWeight for bold text
    color: 'green',      // Change color for debugging
  },  
  giftSemiBoxText: {
    fontSize: 12,
    marginTop: 10,
    fontStyle: 'italic',
    color: 'green',  // Change color for debugging
  },
});

export default SettingsScreen;