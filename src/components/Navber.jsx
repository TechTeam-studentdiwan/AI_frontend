import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedLanguage } from "../store/languages/language.slice";

const languages = [
 { name: "English", value: "en", label: "English" },
  { name: "Arabic", value: "ar", label: "العربية" },
  { name: "Hindi", value: "hi", label: "हिन्दी" },
  { name: "Malayalam", value: "ml", label: "മലയാളം" },
  { name: "Filipino", value: "tl", label: "Filipino" },
  { name: "Urdu", value: "ur", label: "اردو" }
];

export default function CommonNavbar() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  const {selectLanguage} = useSelector((store)=>store.language)

  // Hide navbar on Home screen
  if (route.name === "Home") return null;

  const handleLanguageChange = (lang) => {
    dispatch(setSelectedLanguage(lang));
  };

  return (
    <View className="flex-row justify-around items-center bg-white px-4 py-3 shadow-md w-full">
      {/* ─── Left Side: Navigation Buttons ─────────────────────── */}
      <View className="flex-row items-start w-[55%] gap-2">
        <TouchableOpacity
          className="bg-gray-600 px-3 py-1 rounded-md"
          onPress={() => navigation.navigate("Home")}
        >
          <Text className="text-white text-sm">Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-600 px-3 py-1 rounded-md"
          onPress={() => navigation.navigate("QuickHelp")}
        >
          <Text className="text-white text-sm">Quick Help</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-red-600 px-3 py-1 rounded-md"
          onPress={() => navigation.navigate("Emergency")}
        >
          <Text className="text-white text-sm">Emergency</Text>
        </TouchableOpacity>
      </View>

  
        <View className="flex-row  items-end  w-[45%] gap-2">
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.value}
              onPress={() => handleLanguageChange(lang)}
              className={`border border-gray-300 rounded-md px-2 py-1   ${selectLanguage?.value == lang.value ? "bg-blue-500 ": ""}`}
            >
              <Text className={`text-xs ${selectLanguage?.value == lang.value ? "text-white ": ""}`}>{lang.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
    </View>
  );
}
