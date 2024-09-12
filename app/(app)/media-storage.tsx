import { useState } from 'react';
import { Button, Image, View, StyleSheet, Alert, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { storage, database, auth } from '../../firebaseConfig'; 
import { ref as  storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { ref as databaseRef,push, update, serverTimestamp, runTransaction } from 'firebase/database';
import { getAuth } from 'firebase/auth'; // Firebase Authentication をインポート
import ProgressBar from './ProgressBar'; 

const saveMediaMetadataToDatabase = async (filename: string, downloadURL: string) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.error("User not authenticated.");
      return;
    }

    const postIdRef = push(databaseRef(database, 'posts')); // Get a reference to the new post ID
    const postId = postIdRef.key;

    if (!postId) {
      console.error("Failed to generate post ID.");
      return;
    }

    await runTransaction(databaseRef(database), async (currentData) => {
      if (currentData === null) {
        currentData = {};
      }

      const postData = {
        postId: postId,
        uid: userId,
        imageURL: downloadURL,
        caption: 'Caption', // Can be changed as needed
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      console.log("postData:", postData);

      console.log("Writing to posts collection (within transaction)", postId)    
      currentData[`posts/${postId}`] = postData;
      console.log("After adding postData: currentData = ", currentData);
      
      console.log("Writing to users/{userId}/posts (within transaction)", userId, postId);
      currentData[`users/${userId}/posts/${postId}`] = true;
      console.log("After adding user-post link: currentData = ", currentData); 


      return currentData;
    });

    console.log('Media metadata saved successfully (transaction completed)');
  } catch (error: any) {
    console.error('Failed to save media metadata:', error);
    if (error.code === 'PERMISSION_DENIED') {
      Alert.alert('Error', 'You do not have permission to save media metadata.');
    } else if (error.code === 'DATABASE_ERROR') {
      Alert.alert('Error', 'Failed to connect to the database.');
      // Implement retry mechanism in case of database connection error
    } else if (error.code === 'ABORTED') {
      Alert.alert('Error', 'Transaction aborted. Data might be modified by another user.');
      // ABORTED error indicates that the transaction was interrupted due to a conflict
    } else {
      Alert.alert('Error', 'Failed to save media metadata. Please try again later. Error:', error.message);
      // For other errors, display detailed error information (error.message, etc.)
    }
  }
};

export default function ImagePickerExample() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); 
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null); 

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (result.assets[0].fileSize && result.assets[0].fileSize > 1024 * 1024 * 5) {
        Alert.alert('Error', 'File size exceeds the limit (5MB).');
        return;
      }
      setSelectedImage(result.assets[0].uri);
    } else {
      alert('You did not select any image.');
    }
  };

  const compressAndUploadImage = async () => {
    if (!selectedImage) {
      alert('Please select an image first.');
      return;
    }

    try {
      setIsUploading(true);

      const manipResult = await manipulateAsync(
        selectedImage,
        [{ resize: { width: 500 } }],
        { compress: 0.7, format: SaveFormat.JPEG }
      );

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

      const filename = manipResult.uri.substring(manipResult.uri.lastIndexOf('/') + 1);
      const userId = auth.currentUser?.uid; // ユーザーIDを取得
      const randomString = Math.random().toString(36).substring(2, 15); // ランダムな文字列を生成
      const storagePath = `images/${userId}/${randomString}_${filename}`; // ファイルパスを生成
      const imageRef = storageRef(storage, storagePath); // ストレージリファレンスを生成

      const uploadTask = uploadBytesResumable(imageRef, blob);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress); 
        }, 
        (error) => {
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
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUploadedImageUrl(downloadURL);
            Alert.alert('Success', 'Image uploaded successfully!');
            saveMediaMetadataToDatabase(filename, downloadURL); // メタデータ保存関数を呼び出し
          });
        }
      );

    } finally {
      setIsUploading(false);
      setUploadProgress(0); 
    }
  };

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
          {isUploading && <ProgressBar progress={uploadProgress / 100} />} 
          {uploadedImageUrl && (
            <Text>Uploaded Image URL: {uploadedImageUrl}</Text> 
          )}
        </>
      )}
    </View>
  );
}

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