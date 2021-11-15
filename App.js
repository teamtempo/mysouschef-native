/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
 import React, {useEffect, useState} from 'react';
 import { RecoilRoot } from 'recoil';
 
 import Dashboard from './components/Dashboard';
 import Preview from './components/Preview';
 import CurrentStep from './components/CurrentStep';
 
 import { NavigationContainer } from '@react-navigation/native';
 import { createStackNavigator } from '@react-navigation/stack';
 
 import { StyleSheet, Text, View } from "react-native";
 
 const Stack = createStackNavigator();
 
 export default function App() {
 
   return (
     <RecoilRoot>
       <NavigationContainer>
         <Stack.Navigator>
           <Stack.Screen name="DashBoard" component={Dashboard} options={{ headerShown: false }} />
           <Stack.Screen name="Preview" component={Preview} options={{ headerShown: false }} />
           <Stack.Screen name="CurrentStep" component={CurrentStep} options={{ headerShown: false }} />
         </Stack.Navigator>
       </NavigationContainer>
     </RecoilRoot>  
   );
 }