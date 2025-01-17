import React, { useState, useEffect, useRef } from "react";

// import { post_verify_login_2fa, auth } from "../../service/api";
import Routes from "../../navigation/routes";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { baseReducer, useSetAuth, useSetUser } from "../../store";
import useMutate from "../../hooks/useMutation";
import endpoints from "../../api/endpoints";
import { ApiResponseError, User } from "../../types";
import { RootStackScreenProps } from "../../navigation/types";
import { formatLog } from "../../lib/utils";
import { Button } from "../../components/Button";
import { useToast } from "react-native-toast-notifications";
import OtpInput from "../../components/OtpInput";

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
  message: string;
};

type Payload = {
  type: string[];
  token: string;
};
type ResendPayload = {
  type: string[];
};

const VerificationScreen = ({
  navigation,
}: RootStackScreenProps<"auth_verification">) => {
  const [verificationCode, setVerificationCode] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(145); // 2:25 in seconds
  const { twoFaMethods, twoFaRecipient } = baseReducer.getState();

  const setAuth = useSetAuth();
  const setUser = useSetUser();
  const toast = useToast();
  const { mutateAsync, isPending, error } = useMutate<VerificationResp, Payload>({
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
  const { mutateAsync: mutateResend, isPending: isResending } = useMutate<
    AuthResp,
    ResendPayload
  >({
    type: "post",
    url: endpoints.post_send_2fa,
  });
  // Timer countdown for resend option
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleResendCode = async () => {
    try {
      const response = await mutateResend({ type: twoFaMethods });
      //   console.log("response :>> ", response.data);

      if (response?.data?.message) {
        toast.show("Verification code sent", {
          type: "success",
        });
      }
    } catch (error) {
      const err = error as ApiResponseError;
      formatLog(err?.response);
      toast.show(err?.response?.data?.message ?? "Request failed", {
        type: "danger",
      });
    }
  };

  const handleLogin = async () => {
    const code = verificationCode.join(""); // Convert the verificationCode array to a single string
  

    try {
      const response = await mutateAsync({ token: code, type: twoFaMethods });
      if (response) {
        let data = response?.data?.data;
        formatLog(response?.data);
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
          //   console.log("authResponse :>> ", authData);
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

  // const handleResendCode = () => {
  //   setTimer(145); // Reset timer
  //   setVerificationCode(Array(6).fill(""));
  //   setError(false);
  //   Alert.alert("Verification code resent");
  // };

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
          <Text
            onPress={() => navigation.navigate(Routes.AUTH_SIGN_IN)}
            style={styles.link}
          >
            here
          </Text>
          .
        </Text>

        <OtpInput
          verificationCode={verificationCode}
          setVerificationCode={(e) => setVerificationCode(e)}
         error={error?.response?.data?.message}
        />

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>Enter 6-digit code</Text>
          {timer > 0 ? (
            <Text style={styles.timerText}>{formattedTime}</Text>
          ) : (
            <TouchableOpacity onPress={handleResendCode}>
              {isResending ? (
                <ActivityIndicator color="#3da4ab" size={12} />
              ) : (
                <Text style={styles.resendText}>Resend</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Proceed Button */}

        <Button
          label="Proceed"
          isLoading={isPending || isPendingAuth}
          className="mb-4 mt-5 w-full"
          labelClasses="font-bold"
          onPress={handleLogin}
          disabled={isPending || isPendingAuth}
        />

        {/* Choose Different Method */}
        <TouchableOpacity style={styles.chooseMethodButton}>
          <Text style={styles.chooseMethodText}>Choose a different method</Text>
        </TouchableOpacity>
        <TouchableOpacity  style={[styles.chooseMethodButton, {marginTop:60}]} onPress={()=> navigation.navigate(Routes.AUTH_SIGN_IN)}>
          <Text style={styles.chooseMethodText}>Go back</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "80%",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  link: {
    color: "#3da4ab",
    textDecorationLine: "underline",
    lineHeight: 16,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
  },
  inputUnderline: {
    width: 40,
    height: 50,
    fontSize: 20,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    color: "#333",
  },
  inputError: {
    borderBottomColor: "red",
  },
  timerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
  },
  timerText: {
    color: "#666",
  },
  resendText: {
    color: "#3da4ab",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 16,
    textAlign: "center",
  },
  button: {
    width: "100%",
    backgroundColor: "#3da4ab",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  chooseMethodButton: {
    marginTop: 8,
  },
  chooseMethodText: {
    color: "#3da4ab",
    textDecorationLine: "underline",
  },
});

export default VerificationScreen;
