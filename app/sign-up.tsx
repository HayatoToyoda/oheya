import React, { useState } from 'react';
import { router, Link } from 'expo-router';
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from 'react-native';
import { createUser, handleSignIn } from '@/utils/firebase/auth'; 
import { EmailInUseError, WeakPasswordError } from '@/types/errors/auth';
import { DatabaseError } from '@/types/errors/database';

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<null | string>(null);

  const onSignUp = async () => {
    try {
      await createUser(email, password);
      setError(null); // Clear any previous errors
      router.replace('/')
    } catch (error) {
      console.log('app/sign-up.tsx/SignUpForm() - Sign up error:', error);
      if (error instanceof EmailInUseError) {
        setError('The email address is already in use.');
      } else if (error instanceof WeakPasswordError) {
        setError('The password is too weak.');
      } else if (error instanceof DatabaseError) {
        setError('Database operation failed.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={onSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={styles.signinText}>Already registered?
        <Link href="/sign-in" asChild>
          <Text style={styles.signinLink}> Sign in now!</Text>
        </Link> 
      </Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5 
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signinText: {
    marginTop: 20, // Add spacing between the Sign In button and the signup text
    color: '#333',
  },
  signinLink: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default SignUpForm;