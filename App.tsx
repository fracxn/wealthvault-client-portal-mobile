
import 'react-native-gesture-handler';

import React, { useEffect, useState, useRef } from "react";
import { NavigationContainer } from '@react-navigation/native';
import {
  Platform, BackHandler,
  SafeAreaView, View,
  ActivityIndicator, StyleSheet,
  useColorScheme,
  Text
} from "react-native";
import { DefaultTheme as PaperDefaultTheme, Provider as PaperProvider } from 'react-native-paper';


import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';

import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store'; // Adjust the path to your store file
// import Constants from "expo-constants";
// import NetInfo from "@react-native-community/netinfo";

import Router from './navigation/Router';
import colors from "./theme/colors";
import MainNavigator from "./navigation/MainNavigator";
import Routes from "./navigation/Routes";
import SplashScreen from "./screens/SplashScreen";
import OnboardingScreen from "./screens/OnboardingScreen";

const Stack = createStackNavigator();



const App: React.FC<any> = ({ navigation }) => {
  const theme = {
    ...PaperDefaultTheme,
    dark: false,
    colors: {
      ...PaperDefaultTheme.colors,
      primary: colors.Primary.REGULAR,
    },
  };



  const isDarkMode = useColorScheme() === 'dark';



  return (
    <PaperProvider theme={theme}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}> 
        <Router />
      </PersistGate>
    </Provider>
    </PaperProvider>
  );
}
// <SafeAreaView style={backgroundStyle}>
//   <StatusBar
//     barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//     backgroundColor={backgroundStyle.backgroundColor}
//   />


// </SafeAreaView>

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
