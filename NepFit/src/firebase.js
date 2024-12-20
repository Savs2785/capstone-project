import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCInuqAKu6-EaPhfBQv1SDlz4H0MA6GhjI",
  authDomain: "capstone-project-a4e2c.firebaseapp.com",
  projectId: "capstone-project-a4e2c",
  storageBucket: "capstone-project-a4e2c.appspot.com",
  messagingSenderId: "318268261046",
  appId: "1:318268261046:web:94c49b9b539557e4c31c17"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const storage = getStorage(app);

export { db, auth, storage };