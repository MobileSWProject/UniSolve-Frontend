import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Link, useRouter } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import PhoneInput from "../../components/auth/PhoneInput";
import OTPInput from "../../components/auth/OTPInput";
import styles from "../../styles/auth/LoginStyles";
import _axios from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const [go, setGo] = useState(false);
  const [goo, setGoo] = useState(false);
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");
  const [process, setProcess] = useState(false);
  const [otp, setOtp] = useState("");
  const [tempNumber, setTempNumber] = useState("0");
  const [tempNumberChecking, setTempNumberChecking] = useState("");

  // 아이디와 비밀번호 상태
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const sending = () => {
    if (process) return;
    setProcess(true);
    const temp = Math.floor(100000 + Math.random() * 900000);
    setTempNumber(temp);
    console.log(temp);
    setTimeout(() => {
      setGoo(true);
      setProcess(false);
    }, 3000);
  };

  const checking = async () => {
    if (process) return;
    setProcess(true);
    try {
      let data = JSON.stringify({
        user_id: userId, // 아이디를 JSON에 추가
        password: password, // 비밀번호를 JSON에 추가
      });
      const response = await _axios.post("/login", data);
      const token = response.data.token;
      if (!token) {
        setTempNumberChecking("인증에 실패하였습니다.");
        setProcess(false);
        return;
      }
      await AsyncStorage.setItem("token", token);
      setTempNumberChecking("인증에 성공하였습니다!\n자동으로 이동합니다.");
      setTimeout(() => {
        setProcess(false);
        router.replace("/(app)/(tabs)/home");
      }, 1500);
    } catch (error) {
      console.log(error);
      setTempNumberChecking("인증에 실패하였습니다.");
      setProcess(false);
      return;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Login</Text>
        {/* 아이디 입력 필드 */}
        <Text style={styles.label}>아이디</Text>
        <TextInput
          style={styles.input}
          placeholder="아이디를 입력하세요."
          value={userId}
          onChangeText={setUserId} // 상태 업데이트
        />

        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.input}
          placeholder="비밀번호를 입력하세요."
          secureTextEntry={true} // 비밀번호 보호
          value={password}
          onChangeText={setPassword} // 상태 업데이트
        />

        <FontAwesome5
          name="key"
          size={24}
          color="black"
        />

        {!go && (
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setGo(true)}
            >
              <Text style={styles.buttonText}>휴대폰 번호로 로그인</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.button, backgroundColor: "#e60054" }}
              onPress={checking}
            >
              <Text style={styles.buttonText}>개발용 fake 로그인</Text>
            </TouchableOpacity>
          </>
        )}

        {go && !goo && (
          <PhoneInput
            phone2={phone2}
            setPhone2={setPhone2}
            phone3={phone3}
            setPhone3={setPhone3}
          />
        )}

        {phone2.length + phone3.length >= 8 && !goo && (
          <TouchableOpacity
            style={styles.button}
            onPress={sending}
          >
            <Text style={styles.buttonText}>다음</Text>
            {process && (
              <ActivityIndicator
                size="small"
                color="#fff"
              />
            )}
          </TouchableOpacity>
        )}

        {goo && (
          <OTPInput
            otp={otp}
            setOtp={setOtp}
            checking={checking}
            process={process}
          />
        )}
        <Text>{tempNumberChecking}</Text>
      </View>
    </View>
  );
}
