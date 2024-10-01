import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Link, useRouter } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import PhoneInput from "../../components/auth/PhoneInput";
import OTPInput from "../../components/auth/OTPInput";
import styles from "../../styles/auth/LoginStyles";
import _axios from '../../api';

export default function Login() {
  const [go, setGo] = useState(false);
  const [goo, setGoo] = useState(false);
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");
  const [process, setProcess] = useState(false);
  const [otp, setOtp] = useState("");
  const [tempNumber, setTempNumber] = useState("0");
  const [tempNumberChecking, setTempNumberChecking] = useState("");

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

  const checking = () => {
    if (process) return;
    setProcess(true);
    setTimeout(async () => {
      try {
        let data = JSON.stringify({
          "user_id": "", // 비밀번호 입력
          "password": "", // 비밀번호 입력
        });
        const response = await _axios.post('/login', data);
        const token = response.data.token;
        if (!token) {
          setTempNumberChecking("인증에 실패하였습니다.");
          setProcess(false);
          return;
        }
        localStorage.setItem('token', token);
        setTempNumberChecking("인증에 성공하였습니다!\n자동으로 이동합니다.");
        setTimeout(() => {
          setProcess(false);
          router.push("/(app)/(tabs)/home");
        }, 3000);
      } catch (error) {
        console.log(error)
        setTempNumberChecking("인증에 실패하였습니다.");
        setProcess(false);
        return;
      }
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Login</Text>
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
              onPress={() => router.replace("/(app)/(tabs)/home")}
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
