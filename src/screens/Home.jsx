import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { setSelectedLanguage } from "../store/languages/language.slice";
import { startConversationThunk } from "../store/conversation/conversation.thunk";
import { setClearAllMsg } from "../store/conversation/conversation.slice";

const languages = [
  { name: "English", value: "en-US", label: "Tap here to continue in English", bgColor: "bg-blue-100" },
  { name: "Arabic", value: "ar-SA", label: "اضغط هنا للمتابعة باللغة العربية", bgColor: "bg-yellow-100" },
  { name: "Hindi", value: "hi-IN", label: "हिंदी में आगे बढ़ने के लिए टैप करें", bgColor: "bg-orange-100" },
  { name: "Malayalam", value: "ml-IN", label: "മലയാളത്തിൽ തുടരാൻ ടാപ്പ് ചെയ്യുക", bgColor: "bg-green-100" },
  { name: "Filipino", value: "fil-PH", label: "I-tap ito para magpatuloy sa Filipino", bgColor: "bg-pink-100" },
  { name: "Urdu", value: "ur-PK", label: "اردو میں جاری رکھنے کے لیے یہاں ٹیپ کریں", bgColor: "bg-purple-100" },
];

export default function Home() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [localLoading, setLocalLoading] = useState(false);
  const [selectedLangLoading, setSelectedLangLoading] = useState(null);
  const selectedLang = useSelector((s) => s.language.selectLanguage);

  const handleLanguageSelect = async (lang) => {
    setLocalLoading(true);
    setSelectedLangLoading(lang);
    try {
      dispatch(setSelectedLanguage(lang));
      dispatch(setClearAllMsg());
      const result = await dispatch(startConversationThunk()).unwrap();
      if (result?.conversation_id) {
        navigation.navigate("MainHelp");
      }
    } catch (err) {
      console.error("Conversation start failed:", err);
    } finally {
      setLocalLoading(false);
      setSelectedLangLoading(null);
    }
  };

  return (
    <View className="flex justify-center items-center w-full h-full bg-white px-4 relative">
      {/* 🔄 Fullscreen Transparent Loader Overlay */}
      {localLoading && selectedLangLoading && (
        <View className="absolute top-0 left-0 w-full h-full bg-black/40 z-50 justify-center items-center px-4">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="text-white text-lg mt-4 text-center font-semibold">
            Starting your experience in {selectedLangLoading.name}...
          </Text>
        </View>
      )}

      {/* 🟦 Language Buttons */}
      <View className="flex flex-row flex-wrap justify-between w-full mt-4">
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.value}
            disabled={localLoading}
            className={`w-[47%] rounded-xl p-4 mb-4 items-center shadow-md ${lang.bgColor}`}
            onPress={() => handleLanguageSelect(lang)}
          >
            <Text className="text-lg font-semibold text-center">{lang.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
