import React, { useEffect } from "react";
import { View } from "react-native";
import { useNavigationState } from "@react-navigation/native";
import CommonNavbar from "./Navber";
import TTS from 'react-native-tts'; 
const LayoutWrapper = ({ children }) => {
  const currentRouteName = useNavigationState((state) => {
    const route = state.routes[state.index];
    return route.name;
  });

  const showNavbar = currentRouteName !== "Home";
  useEffect(()=>{
    if(currentRouteName  != "MainHelp"){
      TTS.stop();   
    }
  },[])
  return (
    <View className="flex-1 bg-white">
      {showNavbar && <CommonNavbar />}
      <View className="flex-1">{children}</View>
    </View>
  );
};

export default LayoutWrapper;
