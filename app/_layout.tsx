import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="home" options={{ title: 'Home Screen' }} />
      <Stack.Screen name="about" options={{ title: 'About' }} />
      <Stack.Screen name="itemsForALine" options={{ title: 'Items For A Line' }} />
    </Stack>
  );
}
