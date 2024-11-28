import React, { useEffect, useState, useRef } from "react";
import { View, Text,Image, TextInput, TouchableOpacity, StyleSheet, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import Indicator from "../components/Indicator";

// import "../assets"
import ClientPortalLg from '../assets/logo.svg';
import Routes from '../navigation/Routes';

import { NavigationProps } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen: React.FC<NavigationProps> = ({ navigation }) => {
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //       // navigation.navigate(Routes.HOME);
    //       navigation.reset({
    //         index: 0,
    //         routes: [{ name: Routes.ONBOARDING }],
    //       });
    //     }, 1000); // 2-second delay
    
    //     return () => clearTimeout(timer);
    //   }, [navigation]);

    useEffect(() => {
      const checkOnboardingStatus = async () => {
        const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
        
        const timer = setTimeout(() => {
          if (hasSeenOnboarding) {
            // Navigate to home screen if onboarding has already been completed
            navigation.reset({
              index: 0,
              routes: [{ name: Routes.AUTH_SIGN_IN }],
            });
          } else {
            // Show onboarding screen if the user is launching the app for the first time
            navigation.reset({
              index: 0,
              routes: [{ name: Routes.ONBOARDING }],
            });
          }
        }, 1000); // Delay to simulate splash screen
  
        return () => clearTimeout(timer);
      };
  
      checkOnboardingStatus();
    }, [navigation]);
      
    
    return (
      <View style={styles.container}>
        {/* <Image source={require('../assets/Logo.png')} style={styles.logo} /> */}
        <ClientPortalLg width={200} height={200} />
        {/* <Text style={styles.title}>Client Portal</Text> */}
        {/* <Indicator total={6} active={0} /> */}
        {/* <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Start')}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    logo: {
        width: 'auto',
        // height: 100,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
    },
    description: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
        textAlign: 'center',
        paddingHorizontal: 24,
    },
    image: {
        width: '80%',
        height: 200,
        resizeMode: 'contain',
    },

    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
    },
 
});


  export default SplashScreen;