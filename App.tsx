
import "./global.css";
import {
  useFonts,
  Inter_100Thin,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
// import * as Updates from "expo-updates";
import { useCallback, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ToastProvider } from "react-native-toast-notifications";
import * as Notifications from "expo-notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { usePushNotification } from "@hooks/usePushNotification";
import { NavigationContainer } from "@react-navigation/native";
import { useProviderBuilder } from "./hooks/ProviderBuilder";
import { ScreenNavigation } from "./navigation";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import { useSetReset } from "./store";
// import { ToastProvider } from './components/Toast';

const queryClient = new QueryClient();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
  });

  const reset = useSetReset()

// reset()

  // useEffect(() => {
  //   async function onFetchUpdateAsync() {
  //     try {
  //       const update = await Updates.checkForUpdateAsync();

  //       if (update.isAvailable) {
  //         await Updates.fetchUpdateAsync();
  //         await Updates.reloadAsync();
  //       }
  //     } catch (error) {
  //       // You can also add an alert() to see the error message in case of an error when fetching updates.
  //       // alert(`Error fetching latest Expo update: ${error}`);
  //     }
  //   }

  //   onFetchUpdateAsync();
  // }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const Providers = useProviderBuilder([
    [NavigationContainer, { onReady: onLayoutRootView }],
    [SafeAreaProvider, {}],
    [QueryClientProvider, { client: queryClient }],
    [
      ToastProvider,
      {
        placement: "top",
        successColor: "#7ED957",
        dangerColor: "#DE350B",
        warningIcon: <Entypo name="warning" color="white" size={24} />,
        dangerIcon: (
          <MaterialIcons name="error-outline" color="white" size={24} />
        ),
        successIcon: <AntDesign name="checkcircleo" color="white" size={24} />,
      },
    ],
  ]);

  return (
    <Providers>
      <ScreenNavigation />
    </Providers>
  );
}
