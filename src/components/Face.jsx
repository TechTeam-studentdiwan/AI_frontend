import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Animated, Image, Text } from 'react-native';
import Tts from 'react-native-tts';
import m from '../assets/m.png';
import FrameAnimation from './Mouth';
import m1 from '../assets/m1.png';
import m2 from '../assets/m2.png';
import m3 from '../assets/m3.png';
import m4 from '../assets/m4.png';
const { width, height } = Dimensions.get('window');

const RobotFaceSpeaker = ({ text = '', languageCode, onTTSComplete = () => {},mood='frinedly' }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const eyeBlink = useRef(new Animated.Value(1)).current;
  const eyeAnimation = useRef(null);
const voiceLocaleMap = {
  "en-US": "en-us-x-urb-local",       // English (US)
  "ar-SA": "ar-sa-x-urb-local",       // Arabic (Saudi Arabia)
  "hi-IN": "hi-in-x-urb-local",       // Hindi (India)
  "ml-IN": "ml-in-x-urb-local",       // Malayalam (India)
  "fil-PH": "fil-ph-x-urb-local",     // Filipino (Philippines)
  "ur-PK": "ur-pk-x-urb-local"        // Urdu (Pakistan)
};

  useEffect(() => {
    startEyeBlink();
    const setupTTS = async () => {
      if (matched) {
        Tts.setDefaultLanguage(languageCode);
        Tts.setDefaultVoice(voiceLocaleMap.languageCode);
      } else {
        Tts.setDefaultLanguage(languageCode);
      }
      Tts.setDefaultRate(getRate(languageCode));
    };

    setupTTS();

    const onStart = () => {
      setIsSpeaking(true);
    };

    const onFinish = () => {
      setIsSpeaking(false);
      onTTSComplete();
    };

    Tts.addEventListener('tts-start', onStart);
    Tts.addEventListener('tts-finish', onFinish);

    Tts.speak(text);
  }, [text, languageCode]);

  const startEyeBlink = () => {
    eyeAnimation.current = Animated.loop(
      Animated.sequence([
        Animated.timing(eyeBlink, { toValue: 0.1, duration: 120, useNativeDriver: true }),
        Animated.timing(eyeBlink, { toValue: 1, duration: 120, useNativeDriver: true }),
        Animated.delay(1400),
      ])
    );
    eyeAnimation.current.start();
  };


  const getRate = (code) => {
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

  return (
    mood == "urgent"? <View style={styles.Econtainer}>
      <Animated.View style={[styles.Eeye, { left: 120, transform: [{ scaleY: eyeBlink }] }]} />
      <Animated.View style={[styles.Eeye, { right: 120, transform: [{ scaleY: eyeBlink }] }]} />
      {isSpeaking ?<FrameAnimation/>: <Image
        source={m1}
        style={styles.robotImage}
        resizeMode="contain"
      />}
    </View>:<View style={styles.container}>
      <Animated.View style={[styles.eye, { left: 120, transform: [{ scaleY: eyeBlink }] }]} />
      <Animated.View style={[styles.eye, { right: 120, transform: [{ scaleY: eyeBlink }] }]} />
      {isSpeaking ?<FrameAnimation/>: <Image
        source={m}
        style={styles.robotImage}
        resizeMode="contain"
      />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#192447',
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eye: {
    position: 'absolute',
    top: 100,
    width: 40,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 30,
  },
  Econtainer: {
    backgroundColor: '#643120ff',
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Eeye: {
    position: 'absolute',
    top: 100,
    width: 80,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 50,
  },
  robotImage: {
    width: 150,
    height: 150,
    marginTop: 80,
  },
});

export default RobotFaceSpeaker;
