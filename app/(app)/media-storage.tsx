import { useState } from 'react';
import { Button, Image, View, StyleSheet, Alert, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { storage, database, auth } from '../../firebaseConfig'; 
import { ref as  storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { ref as databaseRef,push, update, serverTimestamp, runTransaction } from 'firebase/database';
import { getAuth } from 'firebase/auth'; // Firebase Authentication 
import ProgressBar from './ProgressBar'; 

/**
 * Saves media metadata to the Realtime Database using a transaction.
 * @param filename - The name of the uploaded file.
 * @param downloadURL - The download URL of the uploaded file.
 */
const saveMediaMetadataToDatabase = async (filename: string, downloadURL: string) => {
  try {
    // Get the authenticated user's ID.
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.error("User not authenticated.");
      return;
    }

    // Generate a new post ID.
    const postIdRef = push(databaseRef(database, 'posts')); 
    const postId = postIdRef.key;

    if (!postId) {
      console.error("Failed to generate post ID.");
      return;
    }

    // Use a transaction to atomically update the database.
    await runTransaction(databaseRef(database), async (currentData) => {
      if (currentData === null) {
        currentData = {};
      }

      // Create the post data object.
      const postData = {
        postId: postId,
        uid: userId,
        imageURL: downloadURL,
        caption: 'Caption', // Can be customized.
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      console.log("postData:", postData);

      // Add the post data to the 'posts' collection.
      console.log("Writing to posts collection (within transaction)", postId)    
      currentData[`posts/${postId}`] = postData;
      console.log("After adding postData: currentData = ", currentData);
      
      // Add a reference to the post in the user's 'posts' node.
      console.log("Writing to users/{userId}/posts (within transaction)", userId, postId);
      currentData[`users/${userId}/posts/${postId}`] = true;
      console.log("After adding user-post link: currentData = ", currentData); 

      return currentData;
    });

    console.log('Media metadata saved successfully (transaction completed)');
  } catch (error: any) {
    console.error('Failed to save media metadata:', error);
    // Handle different error codes.
    if (error.code === 'PERMISSION_DENIED') {
      Alert.alert('Error', 'You do not have permission to save media metadata.');
    } else if (error.code === 'DATABASE_ERROR') {
      Alert.alert('Error', 'Failed to connect to the database.');
      // Implement retry logic for database connection errors.
    } else if (error.code === 'ABORTED') {
      Alert.alert('Error', 'Transaction aborted. Data might be modified by another user.');
      // Handle transaction aborts due to conflicts.
    } else {
      Alert.alert('Error', 'Failed to save media metadata. Please try again later. Error:', error.message);
      // Display detailed error information for other errors.
    }
  }
};

/**
 * A component that allows the user to pick an image from their camera roll,
 * compress it, upload it to Firebase Storage, and save its metadata to the Realtime Database.
 */
export default function ImagePickerExample() {
  // State variables for managing the image selection and upload process.
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); 
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null); 

  /**
   * Allows the user to pick an image from their camera roll using Expo's ImagePicker.
   */
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Check if the file size exceeds the limit (5MB).
      if (result.assets[0].fileSize && result.assets[0].fileSize > 1024 * 1024 * 5) {
        Alert.alert('Error', 'File size exceeds the limit (5MB).');
        return;
      }
      setSelectedImage(result.assets[0].uri);
    } else {
      alert('You did not select any image.');
    }
  };

  /**
   * Compresses the selected image and uploads it to Firebase Storage.
   */
  const compressAndUploadImage = async () => {
    if (!selectedImage) {
      alert('Please select an image first.');
      return;
    }

    try {
      setIsUploading(true);

      // Compress the image using Expo's ImageManipulator.
      const manipResult = await manipulateAsync(
        selectedImage,
        [{ resize: { width: 500 } }],
        { compress: 0.7, format: SaveFormat.JPEG }
      );

      // Convert the compressed image to a Blob.
      const blob = await new Promise<Blob>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response as Blob);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', manipResult.uri, true);
        xhr.send(null);
      });

      // Generate a unique filename for the image.
      const filename = manipResult.uri.substring(manipResult.uri.lastIndexOf('/') + 1);
      const userId = auth.currentUser?.uid; 
      const randomString = Math.random().toString(36).substring(2, 15); 
      const storagePath = `images/${userId}/${randomString}_${filename}`; 
      const imageRef = storageRef(storage, storagePath); 

      // Upload the image to Firebase Storage.
      const uploadTask = uploadBytesResumable(imageRef, blob);

      uploadTask.on('state_changed', 
        (snapshot) => {
          // Track upload progress.
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress); 
        }, 
        (error) => {
          // Handle upload errors.
          console.error('Error uploading image: ', error);
          switch (error.code) {
            case 'storage/unauthorized':
              Alert.alert('Error', 'You are not authorized to upload images. Please sign in.');
              break;
            case 'storage/canceled':
              Alert.alert('Error', 'Upload canceled.');
              break;
            default:
              Alert.alert('Error', 'Failed to upload image. Please try again later.');
              break;
          }
        }, 
        () => {
          // Get the download URL of the uploaded image.
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUploadedImageUrl(downloadURL);
            Alert.alert('Success', 'Image uploaded successfully!');
            // Save the image metadata to the database.
            saveMediaMetadataToDatabase(filename, downloadURL); 
          });
        }
      );

    } finally {
      setIsUploading(false);
      setUploadProgress(0); 
    }
  };

  // Render the component's UI.
  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {selectedImage && (
        <>
          <Image source={{ uri: selectedImage }} style={styles.image} />
          <Text>{selectedImage.substring(selectedImage.lastIndexOf('/') + 1)}</Text>
          <Button
            title="Upload Image"
            onPress={compressAndUploadImage}
            disabled={isUploading}
          />
          {/* Display a progress bar during upload. */}
          {isUploading && <ProgressBar progress={uploadProgress / 100} />} 
          {/* Display the uploaded image URL after upload. */}
          {uploadedImageUrl && (
            <Text>Uploaded Image URL: {uploadedImageUrl}</Text> 
          )}
        </>
      )}
    </View>
  );
}

// Styles for the component.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
});