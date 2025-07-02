import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator ,Animated, StyleSheet} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import PromptModel from '../components/PromptModel';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TTS from 'react-native-tts';
import { getConversationThunk } from '../store/conversation/conversation.thunk';
import { setLastConversationRes } from '../store/conversation/conversation.slice';




const SkeletonBubble = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  const backgroundColor = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e5e7eb', '#d1d5db'], // Tailwind gray-200 to gray-300
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.bubble, { backgroundColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-center',
    margin: 8,
    maxWidth: '80%',

  },
  bubble: {
    height: 60,
    width: 140,
    borderRadius: 20,
  },
});

export const MainHelp = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const dispatch = useDispatch();
  const messages = useSelector((s) => s.conversation.data) || [];
  const locale = useSelector((s) => s.language.selectLanguage.value);
  const loading = useSelector((s) => s.conversation.loading);
  const lastConversationRes = useSelector((s) => s.conversation.lastConversationRes);
  const scrollRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Speak assistant response
  useEffect(() => {
    if (messages?.length > 0) {
      const last = messages[messages.length - 1];
      if (last?.role === 'assistant' && last?.content && last?.content !== lastConversationRes) {
        TTS.stop();
        TTS.setDefaultLanguage(locale)
          .then(() => TTS.speak(last.content))
          .catch((err) => console.warn('TTS error:', err));
        dispatch(setLastConversationRes(last.content));
      }
    }
  }, [messages]);
 
  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingTop: 64 }}
        ref={scrollRef}
        className="py-4 px-10"
      >
        {messages?.map((msg, index) => (
          <View
            key={index}
            className={`mb-4 max-w-[80%] px-4 py-3 rounded-2xl ${
              msg.role !== 'user' ? 'bg-gray-200 self-start' : 'bg-emerald-100 self-end'
            }`}
          >
            <Text className="text-base">{msg.content}</Text>
            <Text className="text-xs text-gray-500 mt-1">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        ))}

        {/* Show placeholder while waiting for response */}
        {loading && lastConversationRes && (
          <>
            <View className="mb-4 max-w-[80%] px-4 py-3 rounded-2xl bg-emerald-100 self-end">
              <Text className="text-base">{lastConversationRes}</Text>
            </View>
            <View className="mb-4 max-w-[80%] px-4 py-3 rounded-2xl bg-gray-200 self-start">
             <SkeletonBubble/>
            </View>
          </>
        )}
      </ScrollView>
        <TouchableOpacity
          className="absolute bottom-6 right-6 bg-emerald-600 p-4 rounded-full shadow-lg z-10"
          onPress={() => setModalVisible(true)}
        >
          <Icon name="microphone" size={28} color="#fff" />
        </TouchableOpacity>
      <PromptModel
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          TTS.stop();
        }}
      />
    </View>
  );
};
