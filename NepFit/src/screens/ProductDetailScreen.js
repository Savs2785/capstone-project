import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput, Image, ActivityIndicator } from 'react-native';
import { useCart } from '../CartContext';
import { db, auth, storage } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, doc, getDoc, limit } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

const ProductDetailScreen = ({ route }) => {
  const { product } = route.params;
  const { addToCart, removeFromCart, getCartItems } = useCart();

  const [isInCart, setIsInCart] = useState(false);
  const [quantityInCart, setQuantityInCart] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewImage, setReviewImage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState(null);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState(''); // State for keyword filter

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const cartItems = getCartItems();
    const existingItem = cartItems.find((item) => item.id === product.id);
    setIsInCart(!!existingItem);
    setQuantityInCart(existingItem ? existingItem.quantity : 0);

    const fetchReviews = async () => {
      try {
        const reviewsQuery = query(collection(db, 'reviews'), where('productId', '==', product.id), limit(10));
        const unsubscribe = onSnapshot(reviewsQuery, async (querySnapshot) => {
          const fetchedReviews = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            reviewId: doc.id,
          }));

          const userIds = fetchedReviews.map((review) => review.userId);
          const uniqueUserIds = [...new Set(userIds)];

          const usersData = await Promise.all(
            uniqueUserIds.map(async (userId) => {
              const userDoc = await getDoc(doc(db, 'users', userId));
              return { userId, userName: userDoc.exists() ? userDoc.data().name : 'Unknown User' };
            })
          );

          const usersMap = usersData.reduce((acc, { userId, userName }) => {
            acc[userId] = userName;
            return acc;
          }, {});

          setUsersMap(usersMap);
          setReviews(fetchedReviews);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        setError('Error fetching reviews. Please try again later.');
        setLoading(false);
      }
    };

    fetchReviews();
  }, [getCartItems, product.id]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets ? result.assets[0].uri : result.uri;
        setReviewImage(uri);
      }
    } catch (error) {
    }
  };

  
  
  

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) return Alert.alert('Please write a review!');
    if (rating === 0) return Alert.alert('Please select a rating!');
    if (!user) return Alert.alert('Please sign in to submit a review.');

    let imageUrl = null;
    if (reviewImage) {
      try {
        const response = await fetch(reviewImage);
        if (!response.ok) throw new Error('Failed to fetch image.');
        const blob = await response.blob();
        const imageRef = ref(storage, `reviews/${Date.now()}.jpg`);
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      } catch (error) {
        return Alert.alert('Error uploading image. Please try again.');
      }
    }

    try {
      const reviewData = {
        productId: product.id,
        userId: user.uid,
        reviewText,
        rating,
        imageUrl,
        timestamp: new Date(),
      };
      await addDoc(collection(db, 'reviews'), reviewData);
      Alert.alert('Review submitted!');
      setReviewText('');
      setRating(0);
      setReviewImage(null);
    } catch (error) {
      Alert.alert('Error submitting review. Please try again.');
    }
  };

  const handleAddToCart = () => {
    if (isInCart) {
      removeFromCart(product);
      setIsInCart(false);
      setQuantityInCart(0);
      Alert.alert(`${product.productName} removed from cart!`);
    } else {
      addToCart({ ...product, quantity: 1 });
      setIsInCart(true);
      setQuantityInCart(1);
      Alert.alert(`${product.productName} added to cart!`);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesRating = selectedRatingFilter === null || review.rating === selectedRatingFilter;
    const matchesKeyword =
      !keyword || review.reviewText.toLowerCase().includes(keyword.toLowerCase()); // Filter by keyword
    return matchesRating && matchesKeyword;
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{product.productName}</Text>
        <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
        <Text style={styles.description}>{product.description}</Text>
        <Text style={styles.price}>Price: ${product.price}</Text>
        {isInCart && <Text style={styles.quantityInCart}>In Cart: {quantityInCart}</Text>}
        <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
          <Text style={styles.buttonText}>{isInCart ? 'Remove from Cart' : 'Add to Cart'}</Text>
        </TouchableOpacity>

        <Text style={styles.ratingLabel}>Rating:</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Text style={rating >= star ? styles.filledStar : styles.emptyStar}>★</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={[styles.textInput, ]}
          placeholder="Write your review"
          multiline
          value={reviewText}
          onChangeText={setReviewText}
        />

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick an Image</Text>
        </TouchableOpacity>
        {reviewImage && <Image source={{ uri: reviewImage }} style={styles.reviewImage} />}

        <TouchableOpacity style={styles.button} onPress={handleSubmitReview}>
          <Text style={styles.buttonText}>Submit Review</Text>
        </TouchableOpacity>

        <Text style={styles.filterLabel}>Filter by Rating:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, selectedRatingFilter === null && styles.selectedFilterButton]}
            onPress={() => setSelectedRatingFilter(null)}
          >
            <Text style={styles.filterButtonText}>All</Text>
          </TouchableOpacity>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              style={[styles.filterButton, selectedRatingFilter === star && styles.selectedFilterButton]}
              onPress={() => setSelectedRatingFilter(star === selectedRatingFilter ? null : star)}
            >
              <Text style={styles.filterButtonText}>{star} Stars</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TextInput
          style={styles.textInput}
          placeholder="Search reviews by keyword"
          value={keyword}
          onChangeText={setKeyword}
        />
        <Text style={styles.reviewsTitle}>Reviews</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <ScrollView style={styles.reviewsList}>
            {filteredReviews.map((review) => (
              <View key={review.reviewId} style={styles.reviewCard}>
                <Text style={styles.reviewUser}>{usersMap[review.userId] || 'Unknown User'}</Text>
                <Text style={styles.reviewRating}>Rating: {review.rating} ★</Text>
                <Text style={styles.reviewText}>{review.reviewText}</Text>
                {review.imageUrl && <Image source={{ uri: review.imageUrl }} style={styles.reviewImage} />}
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  description: { fontSize: 16, marginVertical: 10 },
  price: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  button: {
    backgroundColor: '#28a745',  
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',  
    fontSize: 16,
  },
  productImage: { width: '100%', height: 300, resizeMode: 'contain' },
  textInput: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 10 },
  reviewImage: { width: 100, height: 100, resizeMode: 'contain', marginTop: 10 },
  ratingLabel: { fontSize: 16, marginTop: 10 },
  ratingContainer: { flexDirection: 'row', marginVertical: 10 },
  filledStar: { color: '#f5b041', fontSize: 30 },
  emptyStar: { color: '#ccc', fontSize: 30 },
  reviewsTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20 },
  reviewsList: { marginVertical: 10 },
  reviewCard: { marginBottom: 20, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 },
  reviewUser: { fontSize: 16, fontWeight: 'bold' },
  reviewRating: { fontSize: 14, marginVertical: 5 },
  reviewText: { fontSize: 14 },
  filterLabel: { fontSize: 16, marginVertical: 10 },
  filterContainer: { flexDirection: 'row', marginVertical: 10 },
  filterButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  selectedFilterButton: {
    backgroundColor: '#007bff',
  },
  filterButtonText: { color: '#007bff', fontSize: 14 },
  errorText: { color: 'red', fontSize: 16 },
});

export default ProductDetailScreen;
