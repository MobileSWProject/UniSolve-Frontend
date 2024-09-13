import React from "react";
import { View, TextInput, Text } from "react-native";
import { StyleSheet } from "react-native";

export default function PhoneInput({ phone2, setPhone2, phone3, setPhone3 }) {
  const handleChangeTextPhone2 = (text) => {
    if (/^[0-9]{1,4}$/.test(text)) {
      setPhone2(text);
    }
  };

  const handleChangeTextPhone3 = (text) => {
    if (/^[0-9]{1,4}$/.test(text)) {
      setPhone3(text);
    }
  };

  return (
    <View>
      <Text>
        가입되어 있지 않은 계정은 회원가입이 진행되며, 이미 가입된 계정은
        로그인이 진행됩니다.
      </Text>
      <Text>
        회원가입이 진행되면 서비스 이용약관 및 개인정보처리방침에 동의함으로
        간주합니다.
      </Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value="010"
          editable={false}
        />
        <Text>-</Text>
        <TextInput
          style={styles.input}
          onChangeText={handleChangeTextPhone2}
          value={phone2}
        />
        <Text>-</Text>
        <TextInput
          style={styles.input}
          onChangeText={handleChangeTextPhone3}
          value={phone3}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    marginRight: 5,
    textAlign: "center",
    width: 80,
  },
});
