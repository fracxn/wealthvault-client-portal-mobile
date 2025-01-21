import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import Routes from "../../navigation/routes";
import { RootStackScreenProps } from "../../navigation/types";
import { baseReducer } from "../../store";
import useMutate from "../../hooks/useMutation";
import endpoints from "../../api/endpoints";
import {  Ionicons } from "@expo/vector-icons";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { ApiResponseError } from "../../types";
import { useToast } from "react-native-toast-notifications";

type SendAuthResp = {
  status: "success";
  message: "A token has been sent to hisesss@yopmail.com";
  actionRequired: null;
  data: {};
};

type Payload = {
  type: string[];
};

const TwoFactorAuthScreen = ({
  navigation,
}: RootStackScreenProps<"Two_factor_auth_screen">) => {
  const [selectedTab, setSelectedTab] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState("SMS");
  const toast = useToast();

  const { twoFaMethods, twoFaRecipient } = baseReducer.getState();
  const { mutateAsync, isPending, error } = useMutate<SendAuthResp, Payload>({
    type: "post",
    url: endpoints.post_send_2fa,
  });
  // const dispatch = useDispatch();

  // Set the default tab based on available methods
  useEffect(() => {
    if (twoFaMethods.includes("EMAIL")) {
      setSelectedTab("Email");
      // setSelected(method)
    //   console.log("twoFaMethods :>> ", twoFaMethods);
      setInputValue(twoFaRecipient?.EMAIL || "");
    } else if (twoFaMethods.includes("PHONE")) {
      setSelectedTab("Phone");
      setInputValue(twoFaRecipient?.PHONE || "");
    }
  }, [twoFaMethods, twoFaRecipient]);

  const handleSendCode = async () => {
    try {
      const response = await mutateAsync({ type: twoFaMethods });
    //   console.log("response :>> ", response.data);

      if (response) {
        navigation.navigate(Routes.AUTH_VERIFICATION);
        // resend(false);
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
      <Text style={styles.title}>Two-Factor Authentication (2FA)</Text>
      <Text style={styles.description}>
        For additional layer of security, we need you to set up 2FA. Please
        choose how you want to receive your verification code.
      </Text>

      {/* Tabs for Phone and Email */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === "Phone" && styles.activeTab,
            !twoFaMethods.includes("PHONE") && styles.disabledTab, // Disable style for unavailable tab
          ]}
          onPress={() => {
            if (twoFaMethods.includes("PHONE")) {
              setSelectedTab("Phone");
              setInputValue(twoFaRecipient?.PHONE || "");
            }
          }}
          disabled={!twoFaMethods.includes("PHONE")} // Disable touch if "Phone" is not available
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Phone" && styles.activeTabText,
              !twoFaMethods.includes("PHONE") && styles.disabledTabText, // Style for disabled text
            ]}
          >
            Phone
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === "Email" && styles.activeTab,
            !twoFaMethods.includes("EMAIL") && styles.disabledTab, // Disable style for unavailable tab
          ]}
          onPress={() => {
            if (twoFaMethods.includes("EMAIL")) {
              setSelectedTab("Email");
              setInputValue(twoFaRecipient?.EMAIL ?? "");
            }
          }}
          disabled={!twoFaMethods.includes("EMAIL")} // Disable touch if "Email" is not available
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Email" && styles.activeTabText,
              !twoFaMethods.includes("EMAIL") && styles.disabledTabText, // Style for disabled text
            ]}
          >
            Email
          </Text>
        </TouchableOpacity>
      </View>

      {/* Input Field */}
      {/* <View style={styles.inputContainer}> */}
      <Input
        placeholder={`Enter ${selectedTab}`}
        value={inputValue}
        onChangeText={setInputValue}
        keyboardType={selectedTab === "Phone" ? "phone-pad" : "email-address"}
        //   prefixIcon={<Entypo name="lock" size={18} color="#666" />}
        prefixIcon={<Ionicons name="mail" size={20} color="#666" />}
        className="mb-3 "
        inputClasses="py-4 pl-10"
        prefixClasses="!top-4"
      />
      {/* <TextInput
          style={styles.input}
        /> */}
      {/* </View> */}

      {/* Send Code Button */}
      <Button
        onPress={handleSendCode}
        disabled={isPending}
        label="Send Code"
        isLoading={isPending}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
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
});

export default TwoFactorAuthScreen;
