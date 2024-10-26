import * as React from "react";
import { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Dimensions } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage,auth } from '../../firebaseConfig'; 

const fetchImageUrls = async () => {
  const userId = auth.currentUser?.uid;
  const imageUrls: string[] = [];
  const imagesRef = ref(storage, `images/${userId}`); 

  try {
    const listResult = await listAll(imagesRef);
    for (const item of listResult.items) {
      const url = await getDownloadURL(item);
      imageUrls.push(url);
    }
  } catch (error) {
    console.error('Error fetching image URLs: ', error);
  }

  return imageUrls;
};

const DisplayMedia = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchUrls = async () => {
      const urls = await fetchImageUrls();
      setImageUrls(urls);
    };

    fetchUrls();
  }, []);

  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item }} style={styles.image} />
      {/* 必要に応じて、画像の下に説明や名前などを追加 */}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlashList
        data={imageUrls}
        renderItem={renderItem}
        estimatedItemSize={100} 
        keyExtractor={(item) => item} // URL を key として使用
      />
    </View>
  );
};


const styles = StyleSheet.create({
  // ... (既存のスタイル)
  itemContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('window').width - 40, // 画面幅に合わせて調整
    height: 100, // 画像の高さに合わせて調整
  },
});

export default DisplayMedia;