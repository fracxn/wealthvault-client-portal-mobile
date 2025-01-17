import { StyleSheet, Text, View } from "react-native";
import React, { useRef } from "react";
import { TextInput } from "react-native";

interface OtpInput {
  setVerificationCode: (e: string[]) => void;
  verificationCode: string[];
  error?: any;
}

const OtpInput = (props: OtpInput) => {
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleVerificationCodeChange = (value: string, index: number) => {
    const newCode = [...props.verificationCode];
    newCode[index] = value;
    props.setVerificationCode(newCode);
    // console.log("newCode :>> ", newCode);

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
      props.verificationCode[index] === "" &&
      index > 0
    ) {
      // If the input is empty and backspace is pressed, move to the previous input
      inputRefs.current[index - 1]?.focus();

      // Clear the previous input when backspace is pressed
      const newCode = [...props.verificationCode];
      newCode[index - 1] = "";
      props.setVerificationCode(newCode);
    }
  };

  return (
    <View>
      <View style={styles.codeContainer}>
        {props.verificationCode?.map((digit, index) => (
          <TextInput
            key={index}
            style={[styles.inputUnderline, props?.error && styles.inputError]}
            keyboardType="numeric"
            maxLength={1}
            onChangeText={(value) => handleVerificationCodeChange(value, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            value={digit}
            // ref={(ref) => (this[`input${index}`] = ref)}
            ref={(ref) => (inputRefs.current[index] = ref)}
          />
        ))}
      </View>
       {props?.error && (
                <Text style={styles.errorText}>
                  The verification code you entered is invalid, check the code and try
                  again.
                </Text>
              )}
    </View>
  );
};

export default OtpInput;

const styles = StyleSheet.create({
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 16,
    textAlign: 'center',
  },

});
