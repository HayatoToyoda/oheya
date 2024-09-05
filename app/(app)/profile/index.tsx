import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

const userIds = ['johndoe', 'user1', 'user2']; // Statically typed user IDs

const ProfileList = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profiles</Text>
      {userIds.map((userId) => (
        <Link key={userId} href={`/profile/${userId}`} style={styles.link}>
          <Text style={styles.linkText}>{userId}</Text>
        </Link>
      ))}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  link: {
    marginVertical: 10,
  },
  linkText: {
    fontSize: 18,
    color: 'blue',
  },
});

export default ProfileList;
