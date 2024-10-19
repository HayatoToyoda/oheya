import { Pressable, Text, View, Button } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { handleSignOut } from "@/utils/firebase/auth";
import { Link } from "expo-router";

const fileName = 'app/(app)/index.tsx';

export default function Index() {
  const componentName = 'Index()';

  const { user } = useAuth();

  const onSignOut = async () => {
    try {
      await handleSignOut();
    } catch (error) {
      console.log(`${fileName}/${componentName} - Sign out error:`, error);
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
      <Text testID="user-email-text">Welcome, {user?.email}</Text>
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
      <Link href="/DisplayMedia" asChild>
        <Pressable>
          <Text>Go to Display Media</Text>
        </Pressable>
      </Link>
      <Link href="/media-storage" asChild>
        <Pressable>
          <Text>Go to media storage</Text>
        </Pressable>
      </Link>
      <Link href="/test" asChild>
        <Pressable>
          <Text>Go to test</Text>
        </Pressable>
      </Link>
      <Link href="/profile" asChild>
        <Pressable>
          <Text>Go to User Profiles</Text>
        </Pressable>
      </Link>
      <Link href="/ModelViewer" asChild>
        <Pressable>
          <Text>Go to Model Viewer</Text>
        </Pressable>
      </Link>
    </View>
  );
}
