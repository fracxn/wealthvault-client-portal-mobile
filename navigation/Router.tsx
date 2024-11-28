import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  Platform, BackHandler,
  SafeAreaView, View,
  ActivityIndicator, StyleSheet,
  useColorScheme,
  Text
} from "react-native";
import { navigationRef } from './rootNavigationRef';
import MainNavigator from './MainNavigator';

const Router = (): JSX.Element => {
  const routeNameRef = useRef<string>();


  return (
    <NavigationContainer
      ref={navigationRef as any}
      onStateChange={async () => {
        const rootState = (navigationRef?.current as any)?.getRootState();
        let route = rootState.routes[rootState.index];

        // while (route.state) {
        //   route = route.state.routes[route.state.index];
        // }

        // const previousRouteName = routeNameRef.current;
        // const currentRouteName = route.name;

        // if (previousRouteName !== currentRouteName) {
        //   // Log screen view here
        // }

        // // Save the current route name for later comparison
        // routeNameRef.current = route.name;
      }}
    >
      <MainNavigator/>
    </NavigationContainer>
  );
};

export default Router;
