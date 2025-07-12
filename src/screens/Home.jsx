import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing,
Platform
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Tts from "react-native-tts";

import { setSelectedLanguage } from "../store/languages/language.slice";
import { startConversationThunk } from "../store/conversation/conversation.thunk";
import { setClearAllMsg } from "../store/conversation/conversation.slice";
import TypingText from "../components/TypingText";

const languages = [
  { name: "English", value: "en-US", label: "Tap here to continue in English", bgColor: "bg-blue-100" },
  { name: "Arabic", value: "ar-SA", label: "اضغط هنا للمتابعة باللغة العربية", bgColor: "bg-yellow-100" },
  { name: "Hindi", value: "hi-IN", label: "हिंदी में आगे बढ़ने के लिए टैप करें", bgColor: "bg-orange-100" },
  { name: "Malayalam", value: "ml-IN", label: "മലയാളത്തിൽ തുടരാൻ ടാപ്പ് ചെയ്യുക", bgColor: "bg-green-100" },
  { name: "Filipino", value: "fil-PH", label: "I-tap ito para magpatuloy sa Filipino", bgColor: "bg-pink-100" },
  { name: "Urdu", value: "ur-PK", label: "اردو میں جاری رکھنے کے لیے یہاں ٹیپ کریں", bgColor: "bg-purple-100" },
];

const robotGreetings = {
  "en-US": "Hello! I am your AI assistant . How can I help you today? An option will appear — please speak your problem and submit it.",
  "ar-SA": "مرحبًا! أنا مساعدك الذكي . كيف يمكنني مساعدتك اليوم؟ سيظهر خيار على الشاشة — من فضلك تحدث عن مشكلتك واضغط على إرسال.",
  "hi-IN": "नमस्ते! मैं आपका एआई असिस्टेंट हूँ . मैं आपकी कैसे मदद कर सकता हूँ? आपकी स्क्रीन पर एक विकल्प दिखाई देगा — कृपया अपनी समस्या बोलें और सबमिट करें।",
  "ml-IN": "ഹായ്! ഞാൻ നിങ്ങളുടെ AI അസിസ്റ്റന്റാണ് . ഞാൻ എങ്ങനെ സഹായിക്കാമെന്ന് പറയൂ. ഇപ്പോൾ നിങ്ങളുടെ സ്‌ക്രീനിൽ ഒരു ഓപ്ഷൻ കാണിക്കും — ദയവായി നിങ്ങളുടെ പ്രശ്നം പറയുക, ശേഷം സമർപ്പിക്കുക.",
  "fil-PH": "Hello! Ako ang iyong AI assistant . Paano kita matutulungan ngayon? May lalabas na opsyon sa screen — sabihin mo lang ang problema mo at pindutin ang submit.",
  "ur-PK": "ہیلو! میں آپ کا اے آئی اسسٹنٹ ہوں . میں آج آپ کی کیسے مدد کر سکتا ہوں؟ اب آپ کی اسکرین پر ایک آپشن ظاہر ہوگا — براہ کرم اپنی مسئلہ بولیں اور سبمٹ کریں۔"
};



export default function Home() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [localLoading, setLocalLoading] = useState(false);
  const [selectedLangLoading, setSelectedLangLoading] = useState(null);
  const selectedLang = useSelector((s) => s.language.selectLanguage);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
     Tts.stop();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
   
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

const handleLanguageSelect = async (lang) => {
//  setSelectedLangLoading(lang);
 // dispatch(setClearAllMsg());
  dispatch(setSelectedLanguage(lang));
  navigation.navigate("MainFace");
 // setLocalLoading(true);

 // const greeting = robotGreetings[lang.value] || "Hi!";

  // try {
  //   await Tts.getInitStatus(); // Ensure TTS engine is ready
  //   await Tts.stop();
  //   await Tts.setDefaultLanguage(lang.value);
  //   await Tts.setDefaultRate(0.5);
  //   await Tts.speak(greeting);

  //   // Manually wait for estimated speech duration
  //   const wordCount = greeting.trim().split(/\s+/).length;
  //   const duration = Math.max(3000, wordCount * 400); // 400ms per word fallback

  //   setTimeout(async () => {
  //     try {
  //       const result = await dispatch(startConversationThunk()).unwrap();
  //       if (result?.conversation_id) {
  //         navigation.navigate("MainHelp");
  //       }
  //     } catch (err) {
  //       console.error("Failed to start conversation:", err);
  //     } finally {
  //       setLocalLoading(false);
  //       setSelectedLangLoading(null);
  //     }
  //   }, duration);
  // } catch (err) {
  //   console.error("TTS error:", err);
  //   setLocalLoading(false);
  //   setSelectedLangLoading(null);
  // }
};

  return (
    <View className="flex justify-center items-center w-full h-full bg-white relative">
      {/* ⏱️ Date-Time Box */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) }],
        }}
        className="absolute top-4 w-auto rounded-2xl bg-black shadow-lg py-4 px-6 z-10 border gap-4 border-green-400 flex-row items-center"
      >
        <Text className="text-white text-lg font-semibold text-center mr-4">
          📅 {currentTime.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
        <Text className="text-green-400 text-xl font-bold text-center tracking-widest">
          ⏰ {currentTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })} -{Platform.OS}
        </Text>

      </Animated.View>

      {/* 🤖 Robot Intro Overlay */}
      {localLoading && selectedLangLoading && (
        <View className="absolute top-0 left-0 w-full h-full bg-black/80 z-50 justify-center items-center px-6">
          <Icon name="robot-happy-outline" size={90} color="#10B981" />
          <TypingText
            text={robotGreetings[selectedLangLoading.value] || "Hi!"}
            className="text-white text-xl mt-6 text-center font-semibold"
          />
        </View>
      )}

      {/* 🌐 Language Grid */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: fadeAnim }],
        }}
        className="w-full flex flex-row flex-wrap justify-center gap-4 mt-24 px-4"
      >
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.value}
            disabled={localLoading}
            onPress={() => handleLanguageSelect(lang)}
            className={`w-[46%] rounded-2xl p-4 items-center shadow-xl ${lang.bgColor}`}
          >
            <Text className="text-lg font-semibold text-center text-gray-800">
              {lang.label}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
}
