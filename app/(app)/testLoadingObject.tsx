import React, { useRef } from 'react';
import { View } from 'react-native';
import { GLView } from 'expo-gl';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Asset } from 'expo-asset';

const OBJModel = () => {
  const onContextCreate = async (gl: WebGLRenderingContext) => {
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
    camera.position.set(0, 1, 5);
    camera.lookAt(0, 0, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Load the OBJ model
    try {
      const [{ localUri }] = await Asset.loadAsync(require('../../assets/objects/Poimandres.obj'));
      const objLoader = new OBJLoader();
      console.log("object loaded");
      if (localUri) {
        objLoader.load(localUri, (object) => {
          scene.add(object);
        });
      }
    } catch (error) {
      console.log(error);
    }
    

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    animate();
  };

  return (
    <GLView
      style={{ flex: 1 }}
      onContextCreate={onContextCreate}
    />
  );
};

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <OBJModel />
    </View>
  );
}