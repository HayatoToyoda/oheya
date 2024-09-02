// [uid].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getUserProfile } from '@/utils/firebase/userService';
import { User } from '@/types/user'; // Adjust the import path as necessary

const UserProfile = () => {
  const { uid } = useLocalSearchParams<{ uid: string }>();

  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('app/profile/[uid].tsx/UserProfile() - UID:', uid); // Log the file path and UID for debugging
    if (!uid) return;

    const unsubscribe = getUserProfile(uid, (data) => {
      setUserData(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  if (loading) {
    console.log('app/profile/[uid].tsx/UserProfile() - Status: Loading user data...'); // Log status: Loading user data
    return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
  }

  if (!userData) {
    console.log('app/profile/[uid].tsx/UserProfile() - Status: User data not found.'); // Log status: User data not found
    return <Text style={styles.errorText}>User not found</Text>;
  }

  console.log('app/profile/[uid].tsx/UserProfile() - Status: Rendering user profile data.'); // Log status: Rendering user profile data
  return (
    <View style={styles.container}>
      {userData.profilePicture && (
        <Image source={{ uri: userData.profilePicture }} style={styles.profilePicture} />
      )}
      <Text style={styles.uid}>{userData.uid}</Text>
      {userData.bio ? (
        <Text style={styles.bio}>{userData.bio}</Text>
      ) : (
        <Text style={styles.bio}>Bio unset yet</Text>
      )}
      <Text style={styles.stats}>Followers: {userData.followerCount}</Text>
      <Text style={styles.stats}>Following: {userData.followingCount}</Text>
      <Text style={styles.stats}>Posts: {userData.postCount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  uid: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 16,
    marginTop: 10,
  },
  stats: {
    fontSize: 16,
    marginTop: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default UserProfile;
