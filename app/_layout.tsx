import { Slot } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import applyGlobalPolyfills from "@/applyGlobalPolyfills"; // <-- Change the path

applyGlobalPolyfills()


export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}