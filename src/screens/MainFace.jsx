import React, { useEffect, useState, useRef } from 'react';
import { View, PermissionsAndroid, Platform, Text } from 'react-native';
import Voice from '@react-native-voice/voice';
import RobotFaceSpeaker from '../components/Face';
import { useDispatch, useSelector } from 'react-redux';
import { ConversationThunk } from '../store/conversation/conversation.thunk';

export default function MainVoiceOnly() {
  const [userMessage, setUserMessage] = useState('');
  const [responsiveMessage, setResponsiveMessage] = useState('');
  const [mood, setMood] = useState('frinedly');
  const [isTTSActive, setIsTTSActive] = useState(false);
  const selectedLang = useSelector((s) => s.language.selectLanguage.value);
  const dispatch = useDispatch();
  const isMountedRef = useRef(false);

  // Request mic permission on Android
  const requestMicPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // Start listening
  const startListening = async () => {
    try {
      await Voice.start(selectedLang);
    } catch (e) {
      console.log('Error starting voice recognition:', e);
    }
  };

  // Stop listening
  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.log('Error stopping voice recognition:', e);
    }
  };

  // Handle speech result
  const handleSpeechResults = async (event) => {
    const message = event.value?.[0];
    if (message) {
      await stopListening();
      setUserMessage(message);
      const res = await dispatch(ConversationThunk({ message }));
      const content = res?.payload?.content || '';
      setResponsiveMessage(content);
      setMood(res?.payload?.mood || 'frinedly')
      setIsTTSActive(true);
    }else{
      startListening()
    }
  };

  // Restart listening when TTS completes
  const handleTTSComplete = () => {
    setIsTTSActive(false);
    startListening();
  };

  // Init on mount
  useEffect(() => {
    isMountedRef.current = true;

    const initialize = async () => {
      const hasPermission = await requestMicPermission();
      if (hasPermission) {
        Voice.onSpeechResults = handleSpeechResults;
        await startListening();
      }
    };

    initialize();

    return () => {
      isMountedRef.current = false;
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <RobotFaceSpeaker
        text={responsiveMessage}
        languageCode={selectedLang}
        onTTSComplete={handleTTSComplete}
        isSpeaking={isTTSActive}
        mood={mood}
      />
    </View>
  );
}
