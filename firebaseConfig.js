import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCHDVrx0sCmjZQnnhUlf8_9_UReUD2KZbo",
    authDomain: "oheya-3937b.firebaseapp.com",
    databaseURL: "https://oheya-3937b-default-rtdb.firebaseio.com",
    projectId: "oheya-3937b",
    storageBucket: "oheya-3937b.appspot.com",
    messagingSenderId: "556564903133",
    appId: "1:556564903133:web:3426a110250515fbd5d734",
    measurementId: "G-QS18D6DK95"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
// Add ReactNativeAsyncStorage to persist login state beteen sessions
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firebase Realtime Database
const db = getFirestore(app);

export { firebaseConfig, auth, db };
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase


