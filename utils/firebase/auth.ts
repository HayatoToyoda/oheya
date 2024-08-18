import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '@/firebaseConfig';
import { User } from '@/types/user';
import { EmailInUseError, WeakPasswordError } from '@/types/errors/auth';
import { DatabaseError } from '@/types/errors/database';

export const createUser = async (email: string, password: string) => {
  try {
    // Create a new user with the provided email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Define the user object with initial values
    const user: User = {
      uid: userCredential.user.uid,
      followerCount: 0,
      followingCount: 0,
      postCount: 0
    }

    try {
      // Set the user data in the database under the user's unique ID
      await set(ref(database, `users/${userCredential.user.uid}`), user);
      console.log('utils/firebase/auth.ts/User created successfully');
    } catch (databaseError) {
      // If there is a database error, remove the user credentials and throw a DatabaseError
      await userCredential.user.delete();
      console.log('utils/firebase/auth.ts/createUser() - User credentials removed due to database error');
      throw new DatabaseError('Database operation failed.');
    }
  } catch (error: any) {
    // Handle specific errors based on the error code
    if (error.code) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          console.log('utils/firebase/auth.ts/createUser() - The email address is already in use.');
          throw new EmailInUseError('The email address is already in use.');
        case 'auth/weak-password':
          console.log('utils/firebase/auth.ts/createUser() - The password is too weak');
          throw new WeakPasswordError('The password is too weak.');
        default:
          console.log('utils/firebase/auth.ts/createUser() - Unexpected Firebase error occurred while creating an user.');
          throw error;
      }
    } else { // includes DatabaseError and error when delete()
      console.log('utils/firebase/auth.ts/createUser() - ', error);
      throw error;
    }
  }
};

export const handleSignIn = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log('utils/firebase/auth.ts/handleSignIn() - Successfully signed in')
  } catch (error) {
    console.log('utils/firebase/auth.ts/handleSignIn() - Sign in error:', error);
  }
};

export const handleSignOut = async () => {
  try {
    await signOut(auth);
    console.log('utils/firebase/auth.ts/handleSignOut() - Successfully signed out')
  } catch (error) {
    console.log('utils/firebase/auth.ts/handleSignOut() - Sign out error:', error);
  }
};