// src/navigation/MainNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import Routes from "../navigation/Routes";
import { RootStackParamList } from '../types';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import TwoFactorAuthScreen from '../screens/auth/TwoFactorAuthScreen';
import VerificationScreen from '../screens/auth/VerificationScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import Dashboard from '../screens/Dashboard';


const Stack = createStackNavigator<any>();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.SPLASH}
      screenOptions={{ headerShown: false }}
    >
          <Stack.Screen name={Routes.SPLASH} 
          component={SplashScreen} />
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
  );
};



export default MainNavigator;
