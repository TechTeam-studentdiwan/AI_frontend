import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import QuickHelp from '../screens/QuickHelp';
import { MainHelp } from '../screens/MainHelp';
import SelectLang from '../screens/SelectLang';
import { Provider } from 'react-redux';

import "../../global.css";
import LayoutWrapper from '../components/LayoutWrapper';
import { store } from '../store/store';
import RobotFaceSpeaker from '../components/Face';
import MainFace from '../screens/MainFace';


const Stack = createNativeStackNavigator();

const wrapWithLayout = (Component) => (props) => (
  <LayoutWrapper>
    <Component {...props} />
  </LayoutWrapper>
);

const RootNavigator = () => {
  return (
    <Provider store={store}>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="MainFace" component={MainFace} />
        <Stack.Screen name="QuickHelp" component={wrapWithLayout(QuickHelp)} />
        <Stack.Screen name="MainHelp" component={wrapWithLayout(MainHelp)} />
        <Stack.Screen name="SelectLang" component={wrapWithLayout(SelectLang)} />
      </Stack.Navigator>
    </Provider>
  );
};

export default RootNavigator;
