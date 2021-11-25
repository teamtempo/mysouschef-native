/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
 import SplashScreen from 'react-native-splash-screen';
 import React, { useEffect } from 'react';
 import { RecoilRoot } from 'recoil';
 import RecoilOutside from "recoil-outside"
 import { LogBox } from 'react-native';
 
 import Dashboard from './components/Dashboard';
 import Preview from './components/Preview';
 import CurrentStep from './components/CurrentStep';
 import DonePage from './components/CurrentStep Components/DonePage';
 import TimerAndTTS from './components/CurrentStep Components/TimerAndTTS';
 
 import { NavigationContainer } from '@react-navigation/native';
 import { createStackNavigator } from '@react-navigation/stack';
  
 const Stack = createStackNavigator();
 
 LogBox.ignoreAllLogs();

export default function App() {

  useEffect(() => {
    SplashScreen.hide();
  }, [])

  return (
    <RecoilRoot>
      <NavigationContainer>
    <RecoilOutside/>
        <Stack.Navigator>
          <Stack.Screen name="DashBoard" component={Dashboard} options={{ headerShown: false }} />
          <Stack.Screen name="Preview" component={Preview} options={{ headerShown: false }} />
          <Stack.Screen name="CurrentStep" component={CurrentStep} options={{ headerShown: false }} />
          <Stack.Screen name="DonePage" component={DonePage} options={{headerShown: false}} />
        </Stack.Navigator> 
      </NavigationContainer>
    </RecoilRoot>  
  );
}

