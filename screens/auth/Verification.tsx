import React, { useState, useEffect, useRef } from 'react';

// import { post_verify_login_2fa, auth } from "../../service/api";
import Routes from '../../navigation/routes';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator
}
  from 'react-native';
import { baseReducer, useSetAuth, useSetUser } from '../../store';
import useMutate from '../../hooks/useMutation';
import endpoints from '../../api/endpoints';
import { ApiResponseError, User } from '../../types';
import { RootStackScreenProps } from '../../navigation/types';
import { formatLog } from '../../lib/utils';
import { Button } from '../../components/Button';
import { useToast } from 'react-native-toast-notifications';

type VerificationResp = {
  status: "success";
  message: "User's data successfully fetched";
  actionRequired: null;
  data: {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    method: string;
  };
};
type AuthResp = {
  data: User;
};

type Payload = {
      type:string[];
      token: string
}

const VerificationScreen = ({
  navigation,
}: RootStackScreenProps<"auth_verification">) => {
  const [verificationCode, setVerificationCode] = useState(Array(6).fill(""));
  const [error, setError] = useState(false);
  const [timer, setTimer] = useState(145); // 2:25 in seconds
  const { twoFaMethods, twoFaRecipient } = baseReducer.getState();
  const [loading, setLoading] = useState(false); // Loading state for spinner
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const setAuth = useSetAuth();
    const setUser = useSetUser();
    const toast = useToast()
  const { mutateAsync, isPending , } = useMutate<VerificationResp, Payload>({
    type: "post",
    url: endpoints.post_verify_login_2fa,
  });
  const { mutateAsync: mutateAuth, isPending: isPendingAuth } = useMutate<
    AuthResp,
    null
  >({
    type: "get",
    url: endpoints.get_auth,
  });
  // Timer countdown for resend option
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerificationCodeChange = (value: string, index: number) => {
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    console.log("newCode :>> ", newCode);

    // Automatically move to the next input if not the last one and value is filled
    // if (value && index < 5) {
    //   const nextInput = `input${index + 1}`;
    //   this[nextInput]?.focus();
    // }
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (
      e.nativeEvent.key === "Backspace" &&
      verificationCode[index] === "" &&
      index > 0
    ) {
      // If the input is empty and backspace is pressed, move to the previous input
      inputRefs.current[index - 1]?.focus();

      // Clear the previous input when backspace is pressed
      const newCode = [...verificationCode];
      newCode[index - 1] = "";
      setVerificationCode(newCode);
    }
  };

  const handleSubmit = () => {
    const code = verificationCode.join("");
    if (code !== "123456") {
      setError(true);
    } else {
      setError(false);
      Alert.alert("Verification Successful");
      // Navigate to the next screen
    }
  };

  const handleLogin = async () => {
    const code = verificationCode.join(""); // Convert the verificationCode array to a single string
      setLoading(true);
      
      try {
          
          const response = await mutateAsync({ token:code, type: twoFaMethods });
          if (response) {
            let data = response?.data?.data;
            formatLog(response?.data)
          //   console.log("data method :>> ", data);
      
            setAuth({
              accessToken: data?.accessToken,
              expiryTime: data?.expiresAt,
              refreshToken: data?.refreshToken,
              method: data?.method,
            });
      
            const authResponse = await mutateAuth(null);
            if (authResponse) {
              const authData = authResponse?.data?.data;
              console.log("authResponse :>> ", authData);
              setUser(authData);
              navigation.navigate(Routes.DASHBOARD);
              // handleLoginSuccessful(authResponse);
              return response;
            } 
         
          } 
       } catch (error) {
            const err = error as ApiResponseError;
                toast.show(err?.response?.data?.message ?? "Request failed", {
                  type: "danger",
                });
      }



  };

  const handleResendCode = () => {
    setTimer(145); // Reset timer
    setVerificationCode(Array(6).fill(""));
    setError(false);
    Alert.alert("Verification code resent");
  };

  const formattedTime = `${Math.floor(timer / 60)}:${
    timer % 60 < 10 ? `0${timer % 60}` : timer % 60
  }`;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Verification sent</Text>
        <Text style={styles.description}>
          We have sent a verification code to
          {`${twoFaRecipient?.EMAIL ?? twoFaRecipient?.PHONE}`}. Please enter it
          below. If this isn't your email you can change it{" "}
          <Text style={styles.link}>here</Text>.
        </Text>
        {/* Code Input Fields without box */}
        <View style={styles.codeContainer}>
          {verificationCode?.map((digit, index) => (
            <TextInput
              key={index}
              style={[styles.inputUnderline, error && styles.inputError]}
              keyboardType="numeric"
              maxLength={1}
              onChangeText={(value) =>
                handleVerificationCodeChange(value, index)
              }
              onKeyPress={(e) => handleKeyPress(e, index)}
              value={digit}
              // ref={(ref) => (this[`input${index}`] = ref)}
              ref={(ref) => (inputRefs.current[index] = ref)}
            />
          ))}
        </View>
        {error && (
          <Text style={styles.errorText}>
            The verification code you entered is invalid, check the code and try
            again.
          </Text>
        )}

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>Enter 6-digit code</Text>
          {timer > 0 ? (
            <Text style={styles.timerText}>{formattedTime}</Text>
          ) : (
            <TouchableOpacity onPress={handleResendCode}>
              <Text style={styles.resendText}>Resend</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Proceed Button */}

        <Button label="Proceed"
                  isLoading={isPending || isPendingAuth}
                  className="mb-4 w-full"
                  labelClasses='font-bold'
        onPress={handleLogin}
        disabled={isPending || isPendingAuth}
              />
        

        {/* <TouchableOpacity
          style={styles.button}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" /> // Show spinner when loading
          ) : (
            <Text style={styles.buttonText}>Proceed</Text>
          )}
        </TouchableOpacity> */}

        {/* Choose Different Method */}
        <TouchableOpacity style={styles.chooseMethodButton}>
          <Text style={styles.chooseMethodText}>Choose a different method</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  link: {
    color: '#3da4ab',
    textDecorationLine: 'underline',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  inputUnderline: {
    width: 40,
    height: 50,
    fontSize: 20,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#333',
  },
  inputError: {
    borderBottomColor: 'red',
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  timerText: {
    color: '#666',
  },
  resendText: {
    color: '#3da4ab',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#3da4ab',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chooseMethodButton: {
    marginTop: 8,
  },
  chooseMethodText: {
    color: '#3da4ab',
    textDecorationLine: 'underline',
  },
});

export default VerificationScreen;
