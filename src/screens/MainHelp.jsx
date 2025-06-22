import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'


export const MainHelp = () => {
    const navigation = useNavigation();
  return (
    <View>
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        className="flex justify-center items-center"
      > 
      <Text className="text-lg font-semibold text-center">Back</Text>
        
        </TouchableOpacity>
    </View>

  )
}
