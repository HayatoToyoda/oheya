import { useState } from 'react';
import { Button, Image, View, StyleSheet, Alert, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { database } from '../../firebaseConfig';


export default function ImagePickerExample() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

      // 画像を圧縮
      const manipResult = await manipulateAsync(
        selectedImage,
        [{ resize: { width: 500 } }],
        { compress: 0.7, format: SaveFormat.JPEG }
      );

      // 圧縮した画像をFirebase Storageにアップロード
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
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob); // uploadBytesResumable を uploadBytes に戻す

      // アップロードした画像のダウンロードURLを取得
      const downloadURL = await getDownloadURL(storageRef);

      // Firestoreに画像のURLを保存
      await addDoc(collection(db, 'images'), {
        imageUrl: downloadURL,
      });

      Alert.alert('Success', 'Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image: ', error);
      if (error instanceof TypeError) {
        Alert.alert('Error', 'Network error occurred. Please check your internet connection.');
      } else if (error instanceof Error && error.message.includes('storage/unauthorized')) {
        Alert.alert('Error', 'You are not authorized to upload images. Please sign in.');
      } else {
        Alert.alert('Error', 'Failed to upload image. Please try again later.');
      }
    } finally {
      setIsUploading(false);
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