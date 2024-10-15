import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import styles from "../../styles/auth/LoginStyles";
import { mainColor } from "../../constants/Colors";
import _axios from "../../api";

export default function Login() {
  const [id, setID] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [process, setProcess] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [resetPasswordCall, setResetPasswordCall] = useState(false);
  const [sentResult, setSentResule] = useState(false);

  const router = useRouter();

  const findID = async () => {
    setProcess(true);
    await _axios.post('/find_user_id', { name: name, email: email }).then((response) => {
      setProcess(false);
      if (response.data.isSent) {
        setSentResule(true);
        setResultMessage("해당 이메일로 계정 정보가 발송되었습니다!\n일치하지 않을 경우 발송되지 않습니다.")
      }
    })
  };

  const findPW = async () => {
    if (!resetPasswordCall) return;
    setProcess(true);
    await _axios.post('/reset_password_request', { user_id: id, username: name, email: email }).then((response) => {
      setProcess(false);
      if (response.data.foundpw) {
        setSentResule(true);
        setResultMessage("해당 이메일로 계정 정보가 발송되었습니다!\n일치하지 않을 경우 발송되지 않습니다.")
      }
    })
  };

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>아이디/비밀번호 찾기</Text>
        <FontAwesome5
          name="key"
          size={24}
          color="black"
        />
        <View>
          <View style={styles.inputRow}>
            <Text>이름</Text>
            <TextInput
              style={styles.input}
              onChangeText={setName}
              value={name}
              placeholder="이름"
            />
            <Text>이메일</Text>
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              placeholder="이메일"
            />
          </View>
          { resetPasswordCall ? 
              <>
              <Text>{"비밀번호 찾기를 위해서는 아이디를 입력해야 합니다.\n입력 후 비밀번호 찾기 버튼을 한번 더 눌러주세요."}</Text>
              <TextInput
                style={styles.input}
                onChangeText={setID}
                value={id}
                placeholder="아이디 입력"
              />
              </>:<></>
            }
        </View>

        {name.length > 1 && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) && (
          <>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: sentResult ? "gray" : mainColor }]}
              onPress={() => {findID()}}
              disabled={sentResult}
            >
              <Text style={styles.buttonText}>아이디 찾기</Text>
              {process && (
                <ActivityIndicator
                  size="small"
                  color="#fff"
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: sentResult ? "gray" : mainColor }]}
              onPress={() => {
                if (resetPasswordCall) findPW();
                else setResetPasswordCall(true); }}
              disabled={sentResult}
            >
              <Text style={styles.buttonText}>비밀번호 찾기</Text>
              {process && (
                <ActivityIndicator
                  size="small"
                  color="#fff"
                />
              )}
            </TouchableOpacity>
            <Text>{resultMessage}</Text>
          </>
        )}
      </View>
    </View>
  );
}

