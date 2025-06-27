import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { View,Text } from "react-native";
import PromptModel from "../components/PromptModel";


export const MainHelp = () => {
  const [modalVisible, setModalVisible] = useState(true); // auto-open

  return (
    <View className="flex-1">
      {/* launcher (top-left) */}
      <TouchableOpacity
        className="absolute top-4 left-4 z-10 p-2 rounded-full bg-white shadow"
        onPress={() => setModalVisible(true)}
      >
        <Text>Menu</Text>
      </TouchableOpacity>

      {/* …other screen content… */}

      <PromptModel
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      />
    </View>
  );
};
