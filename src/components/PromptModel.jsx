import React, { useState, useEffect, useCallback } from 'react';
import { Modal, TouchableOpacity, TextInput, View, Text,PermissionsAndroid, Platform } from 'react-native';
import Voice from '@react-native-voice/voice';
import { useDispatch, useSelector } from 'react-redux';         // icon set
import { setTranscript } from '../store/languages/language.slice';

export default function PromptModel({ visible, onRequestClose }) {
  /* ---------- Redux state ---------- */
  const dispatch = useDispatch();
  const locale   = useSelector(s => s.language.selectLanguage.value) || 'en-US';
  const transcript = useSelector(s => s.language.transcript);

  /* ---------- Local state ---------- */
  const [mode, setMode]           = useState('voice');     // 'voice' | 'keyword'
  const [isRecording, setRec]     = useState(false);
  const [error, setError]         = useState(null);

  /* ---------- Voice helpers ---------- */
 const startRecording = useCallback(async () => {
  setError(null);

  const hasPermission = await requestMicrophonePermission();
  if (!hasPermission) {
    setError('Microphone permission denied');
    return;
  }

  if (!Voice || typeof Voice.start !== 'function') {
    setError('Voice module not loaded');
    return;
  }

  try {
    await Voice.start(locale);
    setRec(true);
  } catch (e) {
    setError(e.message);
  }
}, [locale]);



  const stopRecording = useCallback(async () => {
    try { await Voice.stop(); } finally { setRec(false); }
  }, []);
     const requestMicrophonePermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};
useEffect(()=>{
   requestMicrophonePermission() 
},[])

  /* ---------- Wire up Voice events ---------- */
  useEffect(() => {
 
    Voice.onSpeechResults = e => {
      const text = e.value?.[0] ?? '';
      dispatch(setTranscript(text));
    };
    Voice.onSpeechError = e => {
      setError(e.error.message);
      setRec(false);
    };
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [dispatch]);

  /* ---------- Auto-start when modal opens in voice mode ---------- */
  useEffect(() => {
    if (visible && mode === 'voice') {
      startRecording();
    } else {
      stopRecording();
    }
  }, [visible, mode, startRecording, stopRecording]);

  /* ---------- UI ---------- */
  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onRequestClose}>
      <View className="flex-1 bg-white px-6 py-10">

        {/* Mode switcher */}
        <View className="flex-row self-center space-x-4 mb-6">
          <TouchableOpacity
            className={`flex-row items-center px-4 py-2 rounded-xl ${mode === 'voice' ? 'bg-emerald-100' : 'bg-gray-100'}`}
            onPress={() => setMode('voice')}
          >
          {/* <Mic size={18} /> */}
            <Text className="ml-2 font-medium">Voice</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-row items-center px-4 py-2 rounded-xl ${mode === 'keyword' ? 'bg-emerald-100' : 'bg-gray-100'}`}
            onPress={() => { stopRecording(); setMode('keyword'); }}
          >
            {/* <Keyboard size={18} /> */}
            <Text className="ml-2 font-medium">Keyword</Text>
          </TouchableOpacity>
        </View>

        {/* Body */}
        {mode === 'voice' ? (
          <>
            <Text className="text-center text-base">
              {isRecording ? 'Listening…' : 'Press mic to speak'}
            </Text>

            <Text className="text-xl text-center mt-3">{transcript}</Text>

            {error && <Text className="text-red-600 mt-2 text-center">{error}</Text>}

            <TouchableOpacity
              className="self-center mt-8 bg-emerald-500 p-4 rounded-full"
              onPress={isRecording ? stopRecording : startRecording}
            >
              {/* <Icon name="mic" size={30} color="#900" /> */}
            </TouchableOpacity>
          </>
        ) : (
          <TextInput
            multiline
            placeholder="Type your keyword…"
            className="border border-gray-300 rounded-xl p-4 min-h-[120px]"
            value={transcript}
            onChangeText={t => dispatch(setTranscript(t))}
          />
        )}
      </View>
    </Modal>
  );
}
