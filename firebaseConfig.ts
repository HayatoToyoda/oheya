import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { Platform } from "react-native";


// Conditional import for React Native persistence
let reactNativePersistence;
if (Platform.OS !== 'web') {
  const { getReactNativePersistence } = require('firebase/auth');
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  reactNativePersistence = getReactNativePersistence(AsyncStorage);
}

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCHDVrx0sCmjZQnnhUlf8_9_UReUD2KZbo",
    authDomain: "oheya-3937b.firebaseapp.com",
    projectId: "oheya-3937b",
    storageBucket: "oheya-3937b.appspot.com",
    messagingSenderId: "556564903133",
    appId: "1:556564903133:web:3426a110250515fbd5d734",
    measurementId: "G-QS18D6DK95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Conditional setting for auth depending on platform
let auth: any;
if (Platform.OS !== 'web') {
  auth = initializeAuth(app, {
    persistence: reactNativePersistence
  });
} else {
  auth = getAuth(app);
}

// Initialize Firebase Realtime Database
const database = getDatabase(app);

export { firebaseConfig, auth, database };
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase