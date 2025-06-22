// src/screens/Home.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { setSelectedLanguage } from "../store/languages/language.slice";


const languages = [
  {
    name: "English",
    value: "en",
    label: "Tap here to continue in English",
    bgColor: "bg-blue-100",
  },
  {
    name: "Arabic",
    value: "ar",
    label: "اضغط هنا للمتابعة باللغة العربية",
    bgColor: "bg-yellow-100",
  },
  {
    name: "Hindi",
    value: "hi",
    label: "हिंदी में आगे बढ़ने के लिए टैप करें",
    bgColor: "bg-orange-100",
  },
  {
    name: "Malayalam",
    value: "ml",
    label: "മലയാളത്തിൽ തുടരാൻ ടാപ്പ് ചെയ്യുക",
    bgColor: "bg-green-100",
  },
  {
    name: "Filipino",
    value: "tl",
    label: "I-tap ito para magpatuloy sa Filipino",
    bgColor: "bg-pink-100",
  },
  {
    name: "Urdu",
    value: "ur",
    label: "اردو میں جاری رکھنے کے لیے یہاں ٹیپ کریں",
    bgColor: "bg-purple-100",
  },
];

export default function Home() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleLanguageSelect = (lang) => {
    dispatch(setSelectedLanguage(lang));
    navigation.navigate('MainHelp')
    // navigation.navigate("NextScreen");
  };

  return (
    <View className="flex justify-center items-center w-full  h-full ">
    <View className="flex flex-row flex-wrap justify-between items-center w-full  h-full  p-4 mt-20 ">
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.value}
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
