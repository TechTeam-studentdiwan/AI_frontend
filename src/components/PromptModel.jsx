import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Modal,
  TouchableOpacity,
  TextInput,
  View,
  Text,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  Animated,
} from 'react-native';
import Voice from '@react-native-voice/voice';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { setTranscript } from '../store/languages/language.slice';
import { continueConversationThunk } from '../store/conversation/conversation.thunk';
import TTS from 'react-native-tts';
import { setLastConversationRes } from '../store/conversation/conversation.slice';

const WaveBar = ({ delay = 0 }) => {
  const heightAnim = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(heightAnim, {
          toValue: 40,
          duration: 300,
          delay,
          useNativeDriver: false,
        }),
        Animated.timing(heightAnim, {
          toValue: 10,
          duration: 300,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [heightAnim]);

  return (
    <Animated.View
      style={{
        width: 6,
        marginHorizontal: 4,
        backgroundColor: '#10B981',
        borderRadius: 3,
        height: heightAnim,
      }}
    />
  );
};

const ListeningAnimation = () => (
  <View className="flex-row items-end justify-center mt-6 h-[50px]">
    <WaveBar delay={0} />
    <WaveBar delay={100} />
    <WaveBar delay={200} />
    <WaveBar delay={100} />
    <WaveBar delay={0} />
  </View>
);

export default function PromptModel({ visible, onRequestClose }) {
  const dispatch = useDispatch();
  const locale = useSelector((s) => s.language.selectLanguage.value);
  const transcript = useSelector((s) => s.language.transcript);

  const [mode, setMode] = useState('voice');
  const [isRecording, setRec] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(false);
    setError(null);
    setMode('voice');
    setTranscript('');
    TTS.stop();
  }, [onRequestClose]);

  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const startRecording = useCallback(async () => {
    setError(null);
    dispatch(setTranscript(''));
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      setError('Microphone permission denied');
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
    try {
      await Voice.stop();
    } catch (_) { }
    setRec(false);
  }, []);

  const handleSubmit = async () => {
    if (!transcript?.trim()) return;
    setLoading(true);
    try {
      dispatch(continueConversationThunk({ message: transcript }));
      dispatch(setLastConversationRes(transcript));
      onRequestClose();
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  useEffect(() => {
    if (isRecording && transcript?.trim()) {
      stopRecording().then(() => {
        handleSubmit();
      });
    }
  }, [transcript, isRecording]);

  useEffect(() => {
    Voice.onSpeechResults = (e) => {
      const text = e.value?.[0] ?? '';
      dispatch(setTranscript(text));
    };

    Voice.onSpeechError = (e) => {
      setError(e.error.message);
      setRec(false);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [dispatch]);

  useEffect(() => {
    if (visible && mode === 'voice') {
      startRecording();
    } else {
      stopRecording();
    }
  }, [visible, mode]);

  const getDefaultPrompts = (locale) => {
    switch (locale) {
      case 'en-US':
        return [
          'Where is the emergency department?',
          'Where is the OPD?',
          'Where is the restroom?',
          'I lost my wallet.',
          'Where is the pharmacy?',
        ];
      case 'ar-SA':
        return [
          'أين قسم الطوارئ؟',
          'أين العيادات الخارجية؟',
          'أين دورة المياه؟',
          'لقد فقدت محفظتي.',
          'أين الصيدلية؟',
        ];
      case 'hi-IN':
        return [
          'आपातकालीन विभाग कहाँ है?',
          'ओपीडी कहाँ है?',
          'शौचालय कहाँ है?',
          'मेरा बटुआ खो गया है।',
          'फ़ार्मेसी कहाँ है?',
        ];
      case 'ml-IN':
        return [
          'എമർജൻസി വിഭാഗം എവിടെയാണ്?',
          'ഓപിഡി എവിടെയാണ്?',
          'ടോയ്‌ലെറ്റ് എവിടെയാണ്?',
          'എന്റെ പേഴ്സ് നഷ്ടപ്പെട്ടു.',
          'ഫാർമസി എവിടെയാണ്?',
        ];
      case 'fil-PH':
        return [
          'Nasaan ang emergency department?',
          'Nasaan ang OPD?',
          'Nasaan ang banyo?',
          'Nawala ko ang aking pitaka.',
          'Nasaan ang parmasya?',
        ];
      case 'ur-PK':
        return [
          'ایمرجنسی ڈیپارٹمنٹ کہاں ہے؟',
          'او پی ڈی کہاں ہے؟',
          'واش روم کہاں ہے؟',
          'میرا بٹوہ گم ہو گیا ہے۔',
          'فارمیسی کہاں ہے؟',
        ];
      default:
        return [
          'Where is the emergency department?',
          'Where is the OPD?',
          'Where is the restroom?',
          'I lost my wallet.',
          'Where is the pharmacy?',
        ];
    }
  };


  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onRequestClose}>
      <SafeAreaView className="flex-1 bg-white p-6">
        {!loading && (
          <TouchableOpacity className="absolute top-5 right-5 z-10" onPress={onRequestClose}>
            <Icon name="close-circle" size={32} color="#555" />
          </TouchableOpacity>
        )}

        {/* Mode Toggle */}
        <View className="flex-row justify-center mb-6 gap-4">
          <TouchableOpacity
            className={`px-6 py-3 rounded-2xl ${mode === 'voice' ? 'bg-emerald-300' : 'bg-gray-200'}`}
            disabled={loading}
            onPress={() => {
              setMode('voice');
              setError(null);
              dispatch(setTranscript(''));
            }}
          >
            <Icon name="microphone" size={20} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-6 py-3 rounded-2xl ${mode === 'keyword' ? 'bg-emerald-300' : 'bg-gray-200'}`}
            disabled={loading}
            onPress={() => {
              setMode('keyword');
              setError(null);
              dispatch(setTranscript(''));
            }}
          >
            <Icon name="keyboard" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Voice Mode */}
        {mode === 'voice' ? (
          <View className="items-center px-4 mt-6">
            {isRecording ? (
              <View className="items-center">
                <ListeningAnimation />
              </View>
            ) : (
              <TouchableOpacity
                className="bg-emerald-500 p-5 rounded-full mt-2"
                onPress={startRecording}
                disabled={loading}
              >
                <Icon name="microphone" size={28} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          // Keyword Mode
          <View className="px-2">
            <TextInput
              multiline
              placeholder="Type your message…"
              className="border border-gray-300 rounded-xl p-4 min-h-[100px] text-base"
              value={transcript}
              editable={!loading}
              onChangeText={(t) => dispatch(setTranscript(t))}
            />
            <TouchableOpacity
              className="bg-emerald-500 py-3 px-4 rounded-xl mt-4"
              onPress={handleSubmit}
              disabled={loading || !transcript?.trim()}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-center font-medium">Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Suggestions */}
        <View className="mt-6">
          <View className="flex flex-wrap flex-row gap-3 p-2">
            {getDefaultPrompts(locale).map((prompt, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => dispatch(setTranscript(prompt))}
                className="bg-white border border-gray-300 px-4 py-2 rounded-2xl shadow-sm active:scale-95 transition-all"
              >
                <Text className="text-gray-800 text-[13px] font-medium">{prompt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
