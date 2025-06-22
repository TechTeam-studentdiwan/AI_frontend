import React from "react";
import { View } from "react-native";
import { useNavigationState } from "@react-navigation/native";
import CommonNavbar from "./Navber";

const LayoutWrapper = ({ children }) => {
  const currentRouteName = useNavigationState((state) => {
    const route = state.routes[state.index];
    return route.name;
  });

  const showNavbar = currentRouteName !== "Home";

  return (
    <View className="flex-1 bg-white">
      {showNavbar && <CommonNavbar />}
      <View className="flex-1">{children}</View>
    </View>
  );
};

export default LayoutWrapper;
