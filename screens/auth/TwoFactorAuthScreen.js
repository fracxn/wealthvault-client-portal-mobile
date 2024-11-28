import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { post_send_2fa } from "../../service/api";
import Routes from '../../navigation/Routes';



const TwoFactorAuthScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [selected, setSelected] = useState("SMS");

  const [loading, setLoading] = useState(false); // Loading state for spinner
  const { twoFaMethods, twoFaRecipient } = useSelector((state) => state.auth);

  // const dispatch = useDispatch();

  // Set the default tab based on available methods
  useEffect(() => {
    setLoading(false);

    if (twoFaMethods.includes("EMAIL")) {
      setSelectedTab("Email");
      // setSelected(method)
      console.log('twoFaMethods :>> ', twoFaMethods);
      setInputValue(twoFaRecipient.EMAIL || '');
    } else if (twoFaMethods.includes("PHONE")) {
      setSelectedTab("Phone");
      setInputValue(twoFaRecipient.PHONE || '');
    }
  }, [twoFaMethods, twoFaRecipient]);


  const handleSendCode = async () => {
    setLoading(true);
    const response = await post_send_2fa(twoFaMethods);
    console.log('response :>> ', response.data);
    setLoading(false);
    if (response) {
     
          navigation.navigate(Routes.AUTH_VERIFICATION);
      // resend(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Two-Factor Authentication (2FA)</Text>
      <Text style={styles.description}>
        For additional layer of security, we need you to set up 2FA. Please choose how you want to receive your verification code.
      </Text>

      {/* Tabs for Phone and Email */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'Phone' && styles.activeTab,
            !twoFaMethods.includes("PHONE") && styles.disabledTab, // Disable style for unavailable tab
          ]}
          onPress={() => {
            if (twoFaMethods.includes("PHONE")) {
              setSelectedTab('Phone');
              setInputValue(twoFaRecipient.PHONE || '');
            }
          }}
          disabled={!twoFaMethods.includes("PHONE")} // Disable touch if "Phone" is not available
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'Phone' && styles.activeTabText,
            !twoFaMethods.includes("PHONE") && styles.disabledTabText, // Style for disabled text
          ]}>
            Phone
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'Email' && styles.activeTab,
            !twoFaMethods.includes("EMAIL") && styles.disabledTab, // Disable style for unavailable tab
          ]}
          onPress={() => {
            if (twoFaMethods.includes("EMAIL")) {
              setSelectedTab('Email');
              setInputValue(twoFaRecipient.EMAIL || '');
            }
          }}
          disabled={!twoFaMethods.includes("EMAIL")} // Disable touch if "Email" is not available
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'Email' && styles.activeTabText,
            !twoFaMethods.includes("EMAIL") && styles.disabledTabText, // Style for disabled text
          ]}>
            Email
          </Text>
        </TouchableOpacity>
      </View>

      {/* Input Field */}
      <View style={styles.inputContainer}>
        <Feather name="mail" size={20} color="#ccc" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={`Enter ${selectedTab}`}
          value={inputValue}
          onChangeText={setInputValue}
          keyboardType={selectedTab === 'Phone' ? 'phone-pad' : 'email-address'}
        />
      </View>

      {/* Send Code Button */}
      <TouchableOpacity style={styles.sendButton} 
      onPress={handleSendCode} 
      disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" /> // Show spinner when loading
        ) : (
          <Text style={styles.sendButtonText}>Send Code</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#3da4ab',
    fontWeight: '600',
  },
  disabledTab: {
    backgroundColor: '#f0f0f0',
  },
  disabledTabText: {
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#3da4ab',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TwoFactorAuthScreen;
