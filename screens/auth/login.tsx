import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import ClientPortalLg from "../../assets/ClientPortalLg";
import Routes from "../../navigation/routes";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ApiResponseError, User } from "../../types";
import useMutate from "../../hooks/useMutation";
import endpoints from "../../api/endpoints";
import { RootStackScreenProps } from "../../navigation/types";
import {
  useCredentials,
  useSetAuth,
  useSetCredentials,
  useSetTwoFa,
} from "../../store";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";

import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { formatLog } from "../../lib/utils";
import { Controller, useForm } from "react-hook-form";
import { useToast } from "react-native-toast-notifications";


const schema = yup.object({
  email: yup.string().email().trim().lowercase().required(),
  password: yup.string().required(),
});

type LoginResponse = {
  status: string;
  message: string;
  actionRequired: null;
  data: {
    twoFaRequired: true;
    methods: string[];
    recipient: {
      EMAIL: string;
      PHONE: string;
    };
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    method: string;
  };
};
type LoginFormData = yup.InferType<typeof schema>;

const SignInScreen = ({ navigation }: RootStackScreenProps<"SignIn">) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const savedCredentials = useCredentials();
  const setCredentials = useSetCredentials();
  const setTwoFa = useSetTwoFa();
  const setAuth = useSetAuth();
  const [checked, setChecked] = useState(() =>
    savedCredentials ? true : false
  );
  const toast = useToast();
  const { mutateAsync, isPending, error } = useMutate<
    LoginResponse,
    LoginFormData
  >({
    type: "post",
    url: endpoints.post_login,
  });

  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: { ...savedCredentials },
    resolver: yupResolver(schema),
  });

  formatLog(error?.response?.data);
//   console.log(error, "error");



  const handleSignIn = async (values: LoginFormData) => {
    try {
      const response = await mutateAsync(values);

      //   formatLog(response?.data);

      if (response) {
        const data = response?.data;
        // Check if two-factor authentication is required
        if (data?.data?.twoFaRequired) {
          setTwoFa({
            methods: data?.data?.methods,
            recipient: data?.data?.recipient,
            twoFaRequired: data?.data?.twoFaRequired,
          });
          if (checked)
           { setCredentials({ email: values?.email, password: values?.password });}
          navigation.navigate(Routes.TWOFACTORAUTHSCREEN); // Navigate to the 2FA screen
          return;
        }

        // Check for accessToken in the response
        if (checked)
         { setCredentials({ email: values?.email, password: values?.password });}
        setAuth({
          accessToken: data?.data?.accessToken,
          expiryTime: data?.data?.expiresAt,
          refreshToken: data.data?.refreshToken,
          method: data.data?.method,
        });
        navigation.navigate(Routes.DASHBOARD);
        return;
      }
    } catch (error) {
      const err = error as ApiResponseError;
      toast.show(err?.response?.data?.message ?? "Request failed", {
        type: "danger",
      });
    }
  };

  return (
    <View className="pt-12 bg-primay flex-1 px-5">
      <View className="mt-10">
        {/* Logo Placeholder */}
        <ClientPortalLg width={200} height={50} />
      </View>
      {/* <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.logo} /> */}

      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>
        Enter your login details to access your account
      </Text>

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <Input
            onChangeText={onChange}
            value={value}
            placeholder="Enter your email"
            keyboardType="email-address"
            className="mb-3 "
            inputClasses="py-3 pl-10"
           
            prefixIcon={<Ionicons name="mail" size={18} color="#666" />}
          />
        )}
        name="email"
      />
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <Input
            onChangeText={onChange}
            value={value}
            placeholder="Enter Password"
            inputClasses="py-3 pl-10"
            secureTextEntry={!isPasswordVisible}
            className="mb-3  "
            prefixIcon={<Entypo name="lock" size={18} color="#666" />}
            suffixIcon={
              <Feather
                name={isPasswordVisible ? "eye" : "eye-off"}
                size={18}
                color="#666"
              />
            }
            onPress={() => setIsPasswordVisible((prev) => !prev)}
          />
        )}
        name="password"
      />

      <View className="justify-between flex-row mb-5 mt-5">
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => setChecked(!checked)}
            style={styles.checkbox}
          >
            <View
              style={[
                styles.checkboxInner,
                checked && styles.checkboxChecked,
              ]}
            />
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Remember me</Text>
        </View>
        <TouchableOpacity className="ml-1">
          <Text style={styles.forgotPassword}>Forgot Password</Text>
        </TouchableOpacity>
      </View>

      <Button
        className="rounded-2xl font-bold"
        labelClasses="font-bold"
        isLoading={isPending}
        label="Sign In"
        onPress={handleSubmit(handleSignIn)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 0,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  showPasswordButton: {
    padding: 5,
  },
  checkboxContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxInner: {
    width: 12,
    height: 12,
  },
  checkboxChecked: {
    backgroundColor: "#3da4ab",
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  forgotPassword: {
    marginLeft: "auto",
    color: "#3da4ab",
    textDecorationLine: "underline",
  },
  // signInButton: {
  //   width: '100%',
  //   backgroundColor: '#3da4ab',
  //   paddingVertical: 10,
  //   borderRadius: 8,
  //   alignItems: 'center',

  // },

  signInButton: {
    backgroundColor: "#3da4ab",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignInScreen;
