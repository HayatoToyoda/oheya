import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export default function ImageUploadScreen() {
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImageInfo | null>(null);

  const openImagePickerAsync = async () => {
    // パーミッションを確認
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('メディアライブラリへのアクセス許可が必要です');
      return;
    }

    // ImagePicker を起動
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // 画像のみに制限
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // 選択された画像を state に保存
    if (!pickerResult.canceled) {
      setSelectedImage(pickerResult);
    }
  };

  const openCameraAsync = async () => {
    // パーミッションを確認
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status !== 'granted') {
      alert('カメラへのアクセス許可が必要です');
      return;
    }

    // カメラを起動
    let pickerResult = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // 画像のみに制限
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // 撮影された画像を state に保存
    if (!pickerResult.canceled) {
      setSelectedImage(pickerResult);
    }
  };

  // Firebase Storageへのアップロード処理はここに実装 (後のステップ)
  const uploadImage = async () => {
    // TODO: Firebase Storage へのアップロード処理を実装
    console.log('uploadImage: ', selectedImage);
  };

  return (
    <View style={styles.container}>
      <Button title="カメラを起動" onPress={openCameraAsync} />
      <Button title="ライブラリから選択" onPress={openImagePickerAsync} />
      {selectedImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage.uri }} style={styles.image} />
          <Button title="アップロード" onPress={uploadImage} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});