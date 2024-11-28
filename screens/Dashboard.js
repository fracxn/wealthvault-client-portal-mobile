import React, { useRef } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { useSelector } from 'react-redux';
import Routes from '../navigation/Routes';

const Dashboard = ({ navigation }) => {
  const { accessToken } = useSelector((state) => state.auth);
  const dashboardUrl = 'https://client-portal-staging.wealthvault.io/dashboard';
  const webViewRef = useRef(null);

  const navigateToLogin = () => {
    navigation.navigate(Routes.AUTH_SIGN_IN);
  };

  const handleNavigationStateChange = (navState) => {
    const { url } = navState;
    console.log('Navigated to:', url); // Debugging URL changes
    if (url.includes('/login')) {
      navigateToLogin();
      webViewRef.current.stopLoading();
    }
  };

  const injectedJavaScript = `
    (function() {
      localStorage.setItem('token', '${accessToken}');
      document.cookie = "Authorization=Bearer ${accessToken}";
      console.log('Injected token:', localStorage.getItem('token'));
    })();
    true;
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{
          uri: dashboardUrl,
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={['*']}
        injectedJavaScript={injectedJavaScript}
        onNavigationStateChange={handleNavigationStateChange}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator size="large" color="#3da4ab" style={styles.loading} />
        )}
        thirdPartyCookiesEnabled={true}
        onError={(syntheticEvent) => {
          console.log('WebView error:', syntheticEvent.nativeEvent);
          navigateToLogin();
        }}
        onHttpError={({ nativeEvent }) => {
          console.log('HTTP error:', nativeEvent);
          if (nativeEvent.statusCode === 401) {
            navigateToLogin();
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
});

export default Dashboard;
