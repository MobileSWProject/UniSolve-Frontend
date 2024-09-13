import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { StyleSheet } from "react-native";
import { mainColor } from "../../constants/Colors";

export default function OTPInput({ otp, setOtp, checking, process }) {
  const handleChangeTextOTP = (text) => {
    if (/^[0-9]*$/.test(text)) {
      setOtp(text);
    }
  };

  return (
    <View style={styles.inputRow}>
      <Text>입력하신 휴대폰 번호로 인증번호를 발송하였습니다.</Text>
      <TextInput
        style={styles.input}
        onChangeText={handleChangeTextOTP}
        value={otp}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={checking}
      >
        <Text style={styles.buttonText}>인증하기</Text>
        {process && (
          <ActivityIndicator
            size="small"
            color="#fff"
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    alignItems: "center",
    marginTop: 10,
    gap: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    marginRight: 5,
    textAlign: "center",
    width: 100,
  },
  button: {
    backgroundColor: mainColor,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
