import { View, Text, Button, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useRouter, Link } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace('./auth/signIn'); 
    } catch (error: any) {
      console.error('Sign-out error: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to the Home Screen!</Text>
      
      <Link href="/" style={styles.link}>
        <Text style={styles.linkText}>Go to Index</Text> 
      </Link>
      <Link href="/home" style={styles.link}>
        <Text style={styles.linkText}>Go to Home</Text>
      </Link>
      <Link href="/about" style={styles.link}>
        <Text style={styles.linkText}>Go to About</Text>
      </Link>
      <Link href="/itemsForALine" style={styles.link}>
        <Text style={styles.linkText}>Go to Items for a Line</Text> 
      </Link>

      <Button title="Sign Out" onPress={handleSignOut} />
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
  link: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  linkText: {
    color: 'blue',
  }
});