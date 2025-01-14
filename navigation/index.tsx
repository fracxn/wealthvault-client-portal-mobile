import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import * as Notifications from "expo-notifications";
// import { useEffect, useRef } from "react";
import { StackScreens } from "./stack";

// const Stack = createNativeStackNavigator();

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

export const ScreenNavigation = () => {
  //   const notificationListener = useRef<Notifications.Subscription>();
  //   const { registerForPushNotificationsAsync } = usePushNotification();

  return <StackScreens />;
};
