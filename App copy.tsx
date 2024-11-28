import React, { useEffect, useState, useRef } from "react";
import { Platform, BackHandler, SafeAreaView, View, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import NetInfo from "@react-native-community/netinfo";

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/auth/LoginScreen";
import Routes from "./navigation/Routes";
import OnboardingScreen from "./screens/OnboardingScreen";
import VerificationScreen from "./screens/auth/VerificationScreen";
import { Provider } from 'react-redux';

import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store'; // Adjust the path to your store file
import TwoFactorAuthScreen from "./screens/auth/TwoFactorAuthScreen";
import Dashboard from "./screens/Dashboard";



const Stack = createStackNavigator();


export default function App() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);

  // JavaScript to be injected into the WebView
  const injectedJavaScript = `
    (function() {
      var meta = document.createElement('meta'); 
      meta.name = 'viewport'; 
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'; 
      document.getElementsByTagName('head')[0].appendChild(meta);

      var style = document.createElement('style');
      style.type = 'text/css';
      style.appendChild(document.createTextNode('::-webkit-scrollbar { display: none; }'));
      document.head.appendChild(style);
    })();
    true;
  `;

  useEffect(() => {
    const backAction = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove();
  }, [canGoBack]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
      if (!state.isConnected) {
        alert("No internet connection");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    // <SafeAreaView style={{ flex: 1, marginTop: Constants.statusBarHeight }}>
    //   {loading && <ActivityIndicator size="large" color="#0000ff" />}
    //   {isConnected && (
    //     <WebView
    //       ref={webViewRef}
    //       source={{ uri: "https://client-portal-staging.wealthvault.io" }}
    //       style={{ flex: 1 }}
    //       injectedJavaScript={injectedJavaScript}
    //       onLoad={() => setLoading(false)}
    //       onNavigationStateChange={navState => setCanGoBack(navState.canGoBack)}
    //       scalesPageToFit={false} // Disable automatic scaling (deprecated in some cases, so remove if causes issues)
    //       scrollEnabled={true} // Enable scrolling
    //       overScrollMode="never" // Disable overscroll effect (only works on Android)
    //       bounces={false} // Prevent bouncing effect on iOS
    //     />
    //   )}
    // </SafeAreaView>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name={Routes.ONBOARDING} component={OnboardingScreen} />
            <Stack.Screen name={Routes.TWOFACTORAUTHSCREEN} component={TwoFactorAuthScreen} />
            <Stack.Screen
              name={Routes.AUTH_VERIFICATION}
              component={VerificationScreen}
            />
            <Stack.Screen
              name={Routes.AUTH_SIGN_IN}
              component={LoginScreen} />
            <Stack.Screen
              name={Routes.DASHBOARD}
              component={Dashboard} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
