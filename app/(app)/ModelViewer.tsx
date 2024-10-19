import React, { useState, useEffect, Suspense } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei/native';
import { fetchFile } from '@/utils/firebase/fetchStorage';

// Model component
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

// Main ModelViewer component
export default function ModelViewer() {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const modelPath: string = "gs://oheya-3937b.appspot.com/objects/test.glb"

  useEffect(() => {
    async function loadModel() {
      try {
        const url = await fetchFile(modelPath);
        setModelUrl(url);
      } catch (error) {
        console.error('Error loading model:', error);
      }
    }
    loadModel();
  }, [modelPath]);

  if (!modelUrl) {
    return <View style={styles.loadingContainer}><Text>Loading model...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Canvas>
        <Suspense fallback={null}>
          <OrbitControls />
          <Environment preset="sunset" background />
          <Model url={modelUrl} />
        </Suspense>
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

