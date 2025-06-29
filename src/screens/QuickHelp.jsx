import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // can be any icon family

const helpOptions = [
  {
    id: "1",
    title: "Emergency Support",
    subtitle: "Call our 24/7 emergency desk",
    icon: "phone-in-talk",
    bgColor: "#EF4444", // red
  },
  {
    id: "2",
    title: "Ambulance Request",
    subtitle: "Get ambulance to your location",
    icon: "ambulance",
    bgColor: "#3B82F6", // blue
  },
  {
    id: "3",
    title: "Talk to a Doctor",
    subtitle: "Consult with a specialist",
    icon: "stethoscope",
    bgColor: "#10B981", // green
  },
];

const QuickHelp = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{ color: "#2563EB", fontSize: 16, marginBottom: 16 }}>
          ← Back
        </Text>
      </TouchableOpacity>
      {/* Help Cards */}
      <FlatList
        data={helpOptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => console.log("Selected:", item.title)}
            style={{
              backgroundColor: item.bgColor,
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                padding: 10,
                borderRadius: 30,
                marginRight: 16,
              }}
            >
              <Icon name={item.icon} size={24} color="#fff" />
            </View>
            <View>
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                {item.title}
              </Text>
              <Text style={{ color: "#fff", fontSize: 13 }}>{item.subtitle}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default QuickHelp;
