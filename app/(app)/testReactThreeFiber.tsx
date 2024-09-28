import React, { useRef, useState } from 'react';
import { View, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';
import { Canvas, useFrame, useThree } from '@react-three/fiber/native';
import * as THREE from 'three';

interface BoxProps {
  position: [number, number, number];
}

const Box: React.FC<BoxProps> = (props) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta;
      meshRef.current.rotation.y += delta;
    }
  });

  return (
    <mesh {...props} ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial attach="material-0" color="red" />
      <meshStandardMaterial attach="material-1" color="green" />
      <meshStandardMaterial attach="material-2" color="blue" />
      <meshStandardMaterial attach="material-3" color="yellow" />
      <meshStandardMaterial attach="material-4" color="purple" />
      <meshStandardMaterial attach="material-5" color="cyan" />
    </mesh>
  );
};

const CameraController: React.FC<{  rotationAngle: { theta: number, phi: number }}> = ({ rotationAngle }) => {
  const { camera } = useThree();
  const radius = 5;

  useFrame(() => {
    const { theta, phi } = rotationAngle;
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);
  });

  return null;
};

const TestReactThreeFiber: React.FC = () => {
  const [rotationAngle, setRotationAngle] = useState({ theta: 0, phi: Math.PI / 2 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const { dx, dy } = gestureState;
        const sensitivity = 0.001;
  
        setRotationAngle(prevAngle => ({
          theta: prevAngle.theta + dx * sensitivity,
          phi: Math.max(0.1, Math.min(Math.PI - 0.1, prevAngle.phi - dy * sensitivity))
        }));
      },
    })
  ).current;

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} intensity={Math.PI} />
        <Box position={[0, 0, 0]} />
        <CameraController rotationAngle={rotationAngle} />
        <gridHelper args={[20, 20, 'white', 'gray']} />
      </Canvas>
    </View>
  );
};

export default TestReactThreeFiber;