import React, { useRef, useState } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import WebView, { WebViewMessageEvent, WebViewNavigation } from "react-native-webview";

import Routes from "../navigation/routes";
import { useToast } from "react-native-toast-notifications";
import { baseReducer, useUser } from "../store";
import { RootStackScreenProps } from "../navigation/types";
import { formatLog } from "../lib/utils";

const Dashboard = ({
  navigation,
}: RootStackScreenProps<"Dashboard">) => {
  const { accessToken, expiryTime, refreshToken, method, setReset } =
    baseReducer.getState();
  const currentUser = useUser();
  const toast = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [webViewKey, setWebViewKey] = useState(0);

  const mobileState = {
    user: {
      auth: {
        accessToken,
        refreshToken,
        method,
        expiryTime: expiryTime,
      },
      currentUser: {
        ...currentUser,
      },
    },
  };

   const onRefresh = () => {
     setRefreshing(true);

     // Reload the WebView by updating its key
     setWebViewKey((prevKey) => prevKey + 1);

     // Simulate a delay for refresh (to mimic API behavior)
     setTimeout(() => {
       setRefreshing(false);
     }, 1000);
   };

//   console.log(mobileState);
  // const dashboardUrl = `http://10.0.2.2:3000`;
//   const dashboardUrl = `http://10.0.2.2:3000/dashboard?data=${encodeURIComponent(JSON.stringify(mobileState))}`;
//   const dashboardUrl = `http://10.0.2.2:3000/dashboard?refreshToken=${refreshToken}&method=${method}&accessToken=${accessToken}&expiresAt=${expiresAt}`;
  const dashboardUrl = `https://client-portal-staging.wealthvault.io/dashboard?data=${encodeURIComponent(
    JSON.stringify(mobileState)
  )}`;
  // const dashboardUrl = `https://client-portal-staging.wealthvault.io/dashboard?expiresAt=${expiresAt}&refreshToken=${refreshToken}&method=${method}&accessToken=${accessToken}}`;
  const webViewRef = useRef<WebView>(null);

  const handleMessage = (event: WebViewMessageEvent) => {
    const toastMessage = event.nativeEvent.data;

    // Show the toast message received from the WebView
    toast.show(toastMessage ?? "Request fail", {
      type: "danger",

      // duration: 4000,
      // offset: 30,
      // animationType: "slide-in | zoom-in",
    });
  };

  const navigateToLogin = () => {
    navigation.navigate(Routes.AUTH_SIGN_IN);
  };

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    const { url } = navState;
    // console.log("Navigated to:", url); // Debugging URL changes
      if (url.includes("/login")) {
        setReset()
      navigateToLogin();
      webViewRef.current?.stopLoading();
    }
  };

  const injectedJavaScript = `
    (function() {
      localStorage.getItem('persist:root', '${accessToken}');
      localStorage.setItem('token', '${accessToken}');
      document.cookie = "Authorization=Bearer ${accessToken}";
      console.log('Injected token:', localStorage.getItem('token'));
    })();
    true;
  `;

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1, paddingTop:40 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      >
      <WebView
        ref={webViewRef}
        source={{
          uri: dashboardUrl,
          // headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={["*"]}
        // injectedJavaScript={injectedJavaScript}
        onNavigationStateChange={handleNavigationStateChange}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator
            size="large"
            color="#3da4ab"
            style={styles.loading}
          />
        )}
        thirdPartyCookiesEnabled={true}
        onError={(syntheticEvent) => {
          console.log("WebView error:", syntheticEvent.nativeEvent);
          navigateToLogin();
        }}
        onMessage={handleMessage}
        // onHttpError={({ nativeEvent }) => {
        //   console.log('HTTP error:', nativeEvent);
        //   if (nativeEvent.statusCode === 401) {
        //     navigateToLogin();
        //   }
        // }}
        // onLoadEnd={()=>sendStateToWeb(webViewRef)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  loading: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
});

export default Dashboard;
