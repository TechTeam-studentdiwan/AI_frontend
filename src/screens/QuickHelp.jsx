
import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, View } from 'react-native'

const QuickHelp= () => {
     const navigation = useNavigation();
  return (
   <View>
    <TouchableOpacity  onPress={()=>{navigation.navigate("Home")}}>
      <Text>Back</Text>
    </TouchableOpacity>
    <Text>Quick Page</Text>
   </View>
  );
};

export default QuickHelp;
