// userService.ts
import { ref, onValue, off, } from 'firebase/database'; // Import getDatabase, Database, and DataSnapshot
import { database } from '../../firebaseConfig';
import { User } from '../../types/user'; // Adjust the import path as necessary

export const getUserProfile = (userId: string, callback: (data: User | null) => void) => {
  const userRef = ref(database, `users/${userId}`);
  
  const listener = onValue(userRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const userProfile = { uid: userId, ...data };
      console.log('utils/firebase/userService.ts - User profile retrieved successfully:', userProfile); // Log successful message
      callback(userProfile);
    } else {
      console.log('utils/firebase/userService.ts - User profile not found for userId:', userId); // Log error message
      callback(null);
    }
  }, {
    onlyOnce: true // Ensure the listener is triggered only once
  });

  // Return a function to unsubscribe from the listener
  return () => {
    off(userRef, 'value', listener);
    console.log('utils/firebase/userService.tx - Listener unsubscribed for userId:', userId); // Log message when unsubscribing
  };
};