import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { onAuthStateChanged, signOut, User } from 'firebase/auth'; 
import { auth } from '../firebaseConfig'; 

export default function HomeScreen({ navigation }: { navigation: any }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); 
      // Redirect to the sign-in screen if the user is not authenticated
      if (!user) {
        navigation.navigate('SignIn'); 
      }
    });
    return unsubscribe; 
  }, [navigation]); // Add navigation to the dependency array

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Navigate to the sign-in screen after signing out
      navigation.navigate('SignIn');
    } catch (error: any) {
      console.error('Sign-out error: ', error);
    }
  };

  return (
    <View style={styles.container}>
      {user ? ( 
        <>
          <Text style={styles.welcomeText}>Welcome, {user.email}</Text>
          <Button title="Sign Out" onPress={handleSignOut} />
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 20,
  },
});