import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import m1 from '../assets/m1.png';
import m2 from '../assets/m2.png';
import m3 from '../assets/m3.png';
import m4 from '../assets/m4.png';
const FrameAnimation = () => {
    
      const frames = [m1, m2, m3, m4];
  const [frameIndex, setFrameIndex] = useState(0);
  const frameIndexRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
      // Start animation loop
      intervalRef.current = setInterval(() => {
        frameIndexRef.current = (frameIndexRef.current + 1) % frames.length;
        setFrameIndex(frameIndexRef.current);
      },350);
    
  }, []);

  if (frames.length === 0) return null;

  return (
    <Image
      source={frames[frameIndex]}
      style={styles.robotImage}
      resizeMode="contain"
    />
  );
};
const styles = StyleSheet.create({

  robotImage: {
    width: 150,
    height: 150,
    marginTop: 80,
  },
});

export default FrameAnimation;
