import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../../firebaseConfig';
import { User } from '../../types/user';
import { EmailInUseError, WeakPasswordError } from '../../types/errors/auth';
import { DatabaseError } from '../../types/errors/database';

export const createUser = async (email: string, password: string) => {
  try {
    // Create a new user with the provided email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Define the user object with initial values
    const user: User = {
      uid: userCredential.user.uid,
      email: email,
      followerCount: 0,
      followingCount: 0,
      postCount: 0
    }

    try {
      // Set the user data in the database under the user's unique ID
      await set(ref(database, `users/${userCredential.user.uid}`), user);
      console.log('User created successfully');
    } catch (databaseError) {
      // If there is a database error, remove the user credentials and throw a DatabaseError
      await userCredential.user.delete();
      console.log('User credentials removed due to database error');
      throw new DatabaseError('Database operation failed.');
    }
  } catch (error: any) {
    // Handle specific errors based on the error code
    if (error.code) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          console.log('The email address is already in use.');
          throw new EmailInUseError('The email address is already in use.');
        case 'auth/weak-password':
          console.log('The password is too weak');
          throw new WeakPasswordError('The password is too weak.');
        default:
          console.log('Unexpected Firebase error occurred while creating an user.');
          throw error;
      }
    } else { // includes DatabaseError and error when delete()
      console.log(error);
      throw error;
    }
  }
};