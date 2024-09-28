import React, { Suspense } from 'react';
import { View } from 'react-native';
import { Canvas, useLoader } from '@react-three/fiber/native';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Asset } from 'expo-asset';
import { useFrame } from '@react-three/fiber/native';

const Model = () => {

  //const asset = Asset.fromModule(require('../../assets/objects/test.glb')).uri
  //console.log(asset);
  
  const gltf = useLoader(
    GLTFLoader,
    Asset.fromModule(require('../../assets/objects/test.glb')).uri
  );

  useFrame((state, delta) => {
    // You can add animations here if needed
    if (gltf.scene) {
      gltf.scene.rotation.y += delta * 0.5;
    }
  });

  return <primitive object={gltf.scene} position={[0, 0, 0]} />;
};

const Scene = () => {
  return (
    <Canvas camera={{ position: [0, 1, 5], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
    </Canvas>
  );
};

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <Scene />
    </View>
  );
}