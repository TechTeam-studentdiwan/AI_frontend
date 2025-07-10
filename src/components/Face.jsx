import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Image } from 'react-native';
import Tts from 'react-native-tts';

import m from '../assects/m.png';
import m1 from '../assects/m1.png';
import m2 from '../assects/m2.png';
import m3 from '../assects/m3.png';
import m4 from '../assects/m4.png';

const { width, height } = Dimensions.get('window');

const RobotFaceSpeaker = ({
  text = "how are you i am fine",
  languageCode,
  onTTSComplete,
  stopListening
}) => {
  const [eyeBlink] = useState(new Animated.Value(1));
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);

  const eyeAnimation = useRef(null);
  const frameInterval = useRef(null);
  const imageScale = useRef(new Animated.Value(1)).current;

  const frameImages = [m3, m1, m4, m2];

  useEffect(() => {
    const setupVoice = async () => {
      const voices = await Tts.voices();
      const bestVoice = voices.find(v => v.language === languageCode && !v.notInstalled);
      if (bestVoice) {
        Tts.setDefaultLanguage(bestVoice.language);
        Tts.setDefaultVoice(bestVoice.id);
      } else {
        Tts.setDefaultLanguage(languageCode);
      }
    };

    setupVoice();
    Tts.setDefaultRate(getRateByLanguage(languageCode));
    Tts.setDucking(true);

    Tts.addEventListener('tts-start', handleStart);
    Tts.addEventListener('tts-finish', handleFinish);

    Tts.speak(text);

    return () => {
    //  Tts.removeEventListener('tts-start', handleStart);
    //  Tts.removeEventListener('tts-finish', handleFinish);
      clearInterval(frameInterval.current);
    };
  }, [text, languageCode]);

  const handleStart = () => {
    setIsSpeaking(true);
    animateEyes();

    frameInterval.current = setInterval(() => {
      animateImageZoom();
      setTimeout(() => {
        setFrameIndex(prev => (prev + 1) % frameImages.length);
      }, 250);
    }, 500);
  };

  const handleFinish = () => {
    onTTSComplete();
    setIsSpeaking(false);
    clearInterval(frameInterval.current);
    setFrameIndex(0);
    resetAnimations();
  };

  const animateImageZoom = () => {
    Animated.sequence([
      Animated.timing(imageScale, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(imageScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getRateByLanguage = (code) => {
    switch (code) {
      case 'en-US': return 0.5;
      case 'ar-SA': return 0.4;
      case 'hi-IN': return 0.45;
      case 'ur-PK': return 0.5;
      case 'ml-IN': return 0.6;
      case 'fil-PH': return 0.55;
      default: return 0.5;
    }
  };

  const animateEyes = () => {
    eyeAnimation.current = Animated.loop(
      Animated.sequence([
        Animated.timing(eyeBlink, { toValue: 0.1, duration: 200, useNativeDriver: true }),
        Animated.timing(eyeBlink, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.delay(400)
      ])
    );
    eyeAnimation.current.start();
  };

  const resetAnimations = () => {
    if (eyeAnimation.current) eyeAnimation.current.stop();
    eyeBlink.setValue(1);
    imageScale.setValue(1);
  };

  return (
    <View style={styles.container}>
      {/* Eyes */}
      <Animated.View style={[styles.eye, { top: 80, left: 150, transform: [{ scaleY: eyeBlink }] }]} />
      <Animated.View style={[styles.eye, { top: 80, right: 150, transform: [{ scaleY: eyeBlink }] }]} />

      {/* Robot Face */}
      <Animated.Image
        source={isSpeaking ? frameImages[frameIndex] : m}
        style={{
          width: 150,
          height: 150,
          resizeMode: 'contain',
          marginTop: 100,
          transform: [{ scale: imageScale }],
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#192447',
    width: width,
    height: height,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  eye: {
    position: 'absolute',
    width: 40,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 30,
    elevation: 10,
  },
});

export default RobotFaceSpeaker;
