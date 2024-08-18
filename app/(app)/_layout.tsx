import { Redirect, Stack } from 'expo-router';
import { Text } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function AppLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!user) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="home" options={{ title: 'Home Screen' }} />
      <Stack.Screen name="about" options={{ title: 'About' }} />
      <Stack.Screen name="itemsForALine" options={{ title: 'Items For A Line' }} />
      <Stack.Screen name="profile/index" options={{ title: 'User profiles' }} />
    </Stack>
  );
}