import React, { useState, useEffect } from "react";

import {
  View,
  Text,
//   TextInput,
//   TouchableOpacity,
  StyleSheet,
} from "react-native";

// import Routes from "../../navigation/routes";
import { RootStackScreenProps } from "../../navigation/types";
// import { baseReducer } from "../../store";
import useMutate from "../../hooks/useMutation";
import endpoints from "../../api/endpoints";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { ApiResponseError } from "../../types";
import { useToast } from "react-native-toast-notifications";
import ToggleVisibility from "../../lib/ToggleVisibilty";
// import OtpInput from "../../components/OtpInput";

type SendAuthResp = {
  status: "success";
  message: "A token has been sent to hisesss@yopmail.com";
  actionRequired: null;
  data: {};
};

type Payload = {
  email: string;
};

const ForgotPassword = ({
  navigation,
}: RootStackScreenProps<"Two_factor_auth_screen">) => {
  const [verificationCode, setVerificationCode] = useState(Array(6).fill(""));
  const [email, setEmail] = useState("");

  const toast = useToast();
  const [currentScreen, setCurrentScreen] = useState(0);
  const { mutateAsync, isPending, error } = useMutate<SendAuthResp, Payload>({
    type: "post",
    url: endpoints.post_PasswordReset,
  });
  // const dispatch = useDispatch();

  // Set the default tab based on available methods

  const handleSendCode = async () => {
    try {
      const response = await mutateAsync({ email: email.toLowerCase() });
      //   console.log("response :>> ", response.data);

      

      if (response) {
          setCurrentScreen(1);
          toast.show(response?.data?.message ?? "Email sent successfully", {
            type: "success",
          });
        
      }
    } catch (error) {
      const err = error as ApiResponseError;
      toast.show(err?.response?.data?.message ?? "Request failed", {
        type: "danger",
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.indicatorContainer}>
        {Array.from({ length: 2 }).map((screen, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentScreen === index ? styles.activeIndicator : null,
            ]}
          />
        ))}
      </View>
      <ToggleVisibility isVisible={currentScreen === 0}>
        <Text style={styles.title}>Forgot Password </Text>
        <Text style={styles.description}>Having trouble signing in?</Text>
        <Text className="text-sm mb-10 ">
          Enter your account email address and will send you a verification code
          to reset password
        </Text>

        <Input
          placeholder={`JohnDoe@gmail.com`}
          value={email}
          onChangeText={setEmail}
          keyboardType={"email-address"}
          prefixIcon={<Ionicons name="mail" size={20} color="#666" />}
          className=" mb-8"
          inputClasses="py-4 pl-10"
          prefixClasses="!top-4"
        />

        <Button
          onPress={handleSendCode}
          disabled={!email || isPending}
          label="Send Code"
          isLoading={isPending}
        />
      </ToggleVisibility>

      <ToggleVisibility isVisible={currentScreen === 1}>
        <View className="mt-10 items-center justify-center">

        <Text style={styles.title}>Verification sent </Text>
        <Text
          style={styles.description}
          >{`We have sent a verification email to ${email}    `}</Text>

        {/* <OtpInput
          verificationCode={verificationCode}
          setVerificationCode={(e) => setVerificationCode(e)}
          /> */}
        <Button
          onPress={handleSendCode}
          className="mt-8"
          //   disabled={!email || isPending}
          label="Login"
        
        />
        </View>
      </ToggleVisibility>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#f5f5f5",
    // justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    // textAlign: "center",
    marginBottom: 20,
    marginTop: 40,
  },
  description: {
    fontSize: 14,
    color: "#666",
    // textAlign: "center",
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#3da4ab",
    fontWeight: "600",
  },
  disabledTab: {
    backgroundColor: "#f0f0f0",
  },
  disabledTabText: {
    color: "#999",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
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
    color: "#333",
  },
  sendButton: {
    backgroundColor: "#3da4ab",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  indicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 0,
    paddingHorizontal: 0,
  },
  indicator: {
    flex: 1, // Takes up the remaining width
    height: 6, // Reduced height to look more like a bar
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 3,
  },
  activeIndicator: {
    flex: 1, // Takes up the remaining width
    height: 6, // Reduced height to look more like a bar
    backgroundColor: "#57B2B5", // Main theme color for active indicator
    borderRadius: 3, // Slight rounding for the bar
  },
});

export default ForgotPassword;
