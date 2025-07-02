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
import {
  continueConversationThunk,
  getConversationThunk,
} from '../store/conversation/conversation.thunk';
import TTS from 'react-native-tts'; // ← New
import { setLastConversationRes } from '../store/conversation/conversation.slice';
export default function PromptModel({ visible, onRequestClose }) {
  const dispatch = useDispatch();
  const locale = useSelector((s) => s.language.selectLanguage.value);
  const transcript = useSelector((s) => s.language.transcript);

  const [mode, setMode] = useState('voice');
  const [isRecording, setRec] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [localUpdateTime, setLocalUpdateTime] = useState(null);
  const cancelledRef = useRef(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
 useEffect(()=>{
  setLoading(false);
  setError(null)
  setMode('voice');
  setTranscript('');
  TTS.stop();
},[onRequestClose])
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
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.3, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    } catch (e) {
      setError(e.message);
    }
  }, [locale]);

  const stopRecording = useCallback(async () => {
    try {
      await Voice.stop();
    } catch (_) {}
    setRec(false);
  }, []);

  const handleSubmit = async () => {
    if (!transcript?.trim()) return;
    cancelledRef.current = false;
    setLoading(true);
    try {
      dispatch(continueConversationThunk({ message: transcript }));
      dispatch(setLastConversationRes(transcript)) 
      onRequestClose()
    } catch (err) {
      console.error('Submit error:', err);
    }
  };
const getDefaultPrompts = (locale) => {
  switch (locale) {
    case 'en-US':
      return [
        'I’m feeling unwell. Can you help?',
        'Where can I find the nearest restroom?',
        'I need help contacting a nurse.',
        'What time is my next appointment?',
        'Can you tell me about my medication?',
      ];
    case 'hi-IN':
      return [
        'मुझे ठीक नहीं लग रहा है। क्या आप मदद कर सकते हैं?',
        'नज़दीकी टॉयलेट कहाँ है?',
        'कृपया नर्स को बुलाएँ।',
        'मेरी अगली अपॉइंटमेंट कब है?',
        'कृपया मेरी दवा के बारे में बताएं।',
      ];
    case 'ar-SA':
      return [
        'أشعر أنني لست بخير، هل يمكنك المساعدة؟',
        'أين أقرب دورة مياه؟',
        'أحتاج إلى التحدث إلى الممرضة.',
        'متى موعدي القادم؟',
        'أخبرني عن دوائي من فضلك.',
      ];
    case 'ml-IN':
      return [
        'എനിക്ക് അസ്വസ്ഥതയാണ്. സഹായിക്കാമോ?',
        'സമീപത്തെ ടോയ്ലറ്റ് എവിടെയാണ്?',
        'ഒരു നഴ്‌സിനെ വിളിക്കണം.',
        'എന്റെ അടുത്ത അപ്പോയിന്റ്മെന്റ് എപ്പോഴാണ്?',
        'എന്റെ മരുന്നിനെക്കുറിച്ച് വിശദീകരിക്കാമോ?',
      ];
    case 'fil-PH':
      return [
        'Masama ang pakiramdam ko. Pwede mo ba akong tulungan?',
        'Nasaan ang pinakamalapit na CR?',
        'Kailangan kong makausap ang nurse.',
        'Anong oras ang appointment ko?',
        'Paki-explain ang gamot ko.',
      ];
    case 'ur-PK':
      return [
        'میری طبیعت ٹھیک نہیں ہے، کیا آپ مدد کر سکتے ہیں؟',
        'قریبی باتھ روم کہاں ہے؟',
        'مجھے نرس سے بات کرنی ہے۔',
        'میری اگلی اپوائنٹمنٹ کب ہے؟',
        'براہ کرم میری دوا کے بارے میں بتائیں۔',
      ];
    default:
      return [
        'I’m feeling unwell. Can you help?',
        'Where can I find the nearest restroom?',
        'I need help contacting a nurse.',
        'What time is my next appointment?',
        'Can you tell me about my medication?',
      ];
  }
};


  const handleStopAndSubmit = async () => {
    await stopRecording();
    if (transcript?.trim()) {
      await handleSubmit();
    } else {
      setLoading(false);
    }
  };

  const cancelAll = async () => {
    cancelledRef.current = true;
    setLoading(false);
    await stopRecording();
    dispatch(setTranscript(''));
    startRecording();
  };

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

        {mode === 'voice' ? (
          <View className="items-center px-4">
            <Text className="text-2xl font-medium mb-4 text-center">
              {isRecording ? 'Listening…' : loading ? 'Processing…' : 'Tap mic to speak'}
            </Text>
            <Text className="text-xl text-center mb-4">{transcript}</Text>
            {loading ? (
              <View className="items-center">
                <ActivityIndicator size="large" color="#10B981" /> 
                <TouchableOpacity
                  className="mt-4 bg-red-400 px-4 py-2 rounded-xl"
                  onPress={cancelAll}
                >
                  <Text className="text-white">Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : isRecording && transcript ? (<View className='flex items-center justify-center gap-4 flex-row'>
              <TouchableOpacity
                  className="mt-4 bg-red-400  px-6 py-3 rounded-xl"
                  onPress={cancelAll}
                >
                  <Text className="text-white">Cancel</Text>
                </TouchableOpacity>
              <TouchableOpacity
                className="bg-green-500 px-6 py-3 rounded-xl mt-4"
                onPress={handleStopAndSubmit}
              >
                <Text className="text-white text-base font-medium">Submit</Text>
              </TouchableOpacity>
              </View>
            ) : (
            
              !isRecording && !transcript ?(<TouchableOpacity
                 className="bg-emerald-500 p-5 rounded-full mt-2"
                 onPress={startRecording}
               >
                 <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                   <Icon name="microphone" size={28} color="#fff" />
                 </Animated.View>
               </TouchableOpacity>):(<></>)
            )}
          </View>
        ) : (
          <View className="px-2">
            <TextInput
              multiline
              placeholder="Type your message…"
              className="border border-gray-300 rounded-xl p-4 min-h-[100px] text-base"
              value={transcript}
              editable={!loading}
              onChangeText={(t) => dispatch(setTranscript(t))}
            />
            {loading ? (
              <View className="mt-4 items-center">
                <ActivityIndicator size="large" color="#10B981" />
                <TouchableOpacity
                  className="mt-4 bg-red-400 px-4 py-2 rounded-xl"
                  onPress={cancelAll}
                >
                  <Text className="text-white">Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                className="bg-emerald-500 py-3 px-4 rounded-xl mt-4"
                onPress={handleSubmit}
              >
                <Text className="text-white text-center font-medium">Submit</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        <View className="mt-4">
  <View className="flex flex-wrap flex-row gap-2">
    {getDefaultPrompts(locale).map((prompt, idx) => (
      <TouchableOpacity
        key={idx}
        className="bg-gray-100 border border-gray-300 rounded-xl px-3 py-2"
        onPress={() => dispatch(setTranscript(prompt))}
      >
        <Text className="text-sm text-gray-800">{prompt}</Text>
      </TouchableOpacity>
    ))}
  </View>
</View>

      </SafeAreaView>
    </Modal>
  );
}
