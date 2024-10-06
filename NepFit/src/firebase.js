import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCInuqAKu6-EaPhfBQv1SDlz4H0MA6GhjI",
  authDomain: "capstone-project-a4e2c.firebaseapp.com",
  projectId: "capstone-project-a4e2c",
  storageBucket: "capstone-project-a4e2c.appspot.com",
  messagingSenderId: "318268261046",
  appId: "1:318268261046:web:94c49b9b539557e4c31c17"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };