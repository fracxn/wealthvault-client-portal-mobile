import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Button } from '../components/UIKit';
import Routes from '../navigation/Routes';
import AsyncStorage from '@react-native-async-storage/async-storage';


const OnboardingScreen = ({ navigation }) => {
    const [currentScreen, setCurrentScreen] = useState(0);

    const screens = [
        {
            title: 'Monitor Performance',
            description: 'Track account growth and asset performance with clear, updated insights. Stay informed and confident in your financial journey.',
            image: require('../assets/onboarding1.png'),
        },
        {
            title: 'Personalised Experience',
            description: 'Customise your dashboard to align with your financial goals. WealthVault is designed for flexibility and speed.',
            image: require('../assets/onboarding2.png'),
        },
        {
            title: 'Stay Connected',
            description: 'Stay in sync with timely alerts on portfolio changes and real-time updates. Connect instantly with your advisor to keep your financial plan on track.',
            image: require('../assets/onboarding3.png'),
        },
    ];
    // Function to mark onboarding as complete
    const completeOnboarding = async () => {
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        navigation.reset({
            index: 0,
            routes: [{ name: Routes.AUTH_SIGN_IN }], // Navigate to the sign-in screen
        });
    };

    // Navigate to the next screen or complete onboarding
    const nextScreen = () => {
        if (currentScreen < screens.length - 1) {
            setCurrentScreen(currentScreen + 1);
        } else {
            completeOnboarding(); // Call completeOnboarding on the last screen
        }
    };

    // Skip onboarding and mark it as complete
    const skipScreen = () => {
        completeOnboarding();
    };



    return (
        <View style={styles.container}>
            <View style={styles.indicatorContainer}>
                {screens.map((screen, index) => (
                    <View
                        key={index}
                        style={[
                            styles.indicator,
                            currentScreen === index ? styles.activeIndicator : null,
                        ]}
                    />
                ))}
            </View>
            <Image source={screens[currentScreen].image} style={styles.image} />
            <View style={styles.onboardingContent}>
                <Text style={styles.title}>{screens[currentScreen].title}</Text>
                <Text style={styles.description}>{screens[currentScreen].description}</Text>

                {currentScreen != screens.length - 1 ? (
                    <View style={styles.buttonWrapper}>
                        <Button
                            dark
                            labelStyle={styles.skipText}
                            mode="text"
                            style={styles.skipButton}
                            onPress={skipScreen}
                        >
                            Skip
                        </Button>
                        <Button
                            mode="outlined"
                            labelStyle={styles.buttonLabel}
                            style={styles.button}
                            onPress={nextScreen}
                        >
                            Next
                        </Button>
                    </View>) :
                    (
                        <Button
                            mode="outlined"
                            labelStyle={styles.buttonLabel}
                            style={styles.button}
                            onPress={nextScreen}
                        >
                            Get Started
                        </Button>
                    )
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    skipButton: {
        color: '#57B2B5',
    },
    skipText: {
        fontSize: 14,
        color: '#57B2B5',
    },
    image: {
        width: '100%',
        height: '50%',
        resizeMode: 'contain',
        position: 'relative',
        left: -20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'left',
        marginVertical: 20,
        paddingHorizontal: 15,
    },
    description: {
        fontSize: 16,
        textAlign: 'left',
        color: '#666',
        marginBottom: 20,
        paddingHorizontal: 15,
    },
    indicatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 0,
        paddingHorizontal: 20,
    },
    indicator: {
        flex: 1, // Takes up the remaining width
        height: 6, // Reduced height to look more like a bar
        borderRadius: 5,
        backgroundColor: '#ccc',
        marginHorizontal: 3,
    },
    activeIndicator: {
        flex: 1, // Takes up the remaining width
        height: 6, // Reduced height to look more like a bar
        backgroundColor: '#57B2B5', // Main theme color for active indicator
        borderRadius: 3, // Slight rounding for the bar
    },
    onboardingContent: {
        width: '100%',
        padding: 16,
    },
    button: {
        marginVertical: 10,
        backgroundColor: '#57B2B5',
    },
    buttonLabel: {
        color: '#fff',
    },
    buttonWrapper: {
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
});

export default OnboardingScreen;
