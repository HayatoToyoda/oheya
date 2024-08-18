import { Pressable, Text, View, Button } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { handleSignOut } from "@/utils/firebase/auth";
import { Link } from "expo-router";

export default function Index() {
  const { user } = useAuth();

  const onSignOut = async () => {
    try {
      await handleSignOut();
    } catch (error) {
      console.error('app/(app)/index.tsx/Index() - Sign out error:', error);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Welcome, {user?.email}</Text>
      <Button title="Sign Out" onPress={onSignOut} />
      <Link href="/home" asChild>
        <Pressable>
          <Text>Go to Home Screen</Text>
        </Pressable>
      </Link>
      <Link href="/about" asChild>
        <Pressable>
          <Text>Go to About Page</Text>
        </Pressable>
      </Link>
      <Link href="/itemsForALine" asChild>
        <Pressable>
          <Text>Go to Items For A Line</Text>
        </Pressable>
      </Link>
      <Link href="/profile" asChild>
        <Pressable>
          <Text>Go to User Profiles</Text>
        </Pressable>
      </Link>
    </View>
  );
}