import { useState } from "react";
import React, { useEffect } from 'react';
import { Link, useRouter } from "expo-router";
import { Text, View, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { styles } from "../css/main";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function Login() {
  const [go, setGo] = useState(false);
  const [goo, setGoo] = useState(false);
  const [phone1, setPhone1] = useState('010');
  const [phone2, setPhone2] = useState('');
  const [phone3, setPhone3] = useState('');
  const [goto, setGoto] = useState(false);
  const [itda, setItda] = useState(false);
  const [otp, setOtp] = useState('');
  const [process, setProcess] = useState(false);
  const [tempNumber, setTempNumber] = useState('0');
  const [tempNumberChecking, setTempNumberChecking] = useState('');

  const router = useRouter();

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
  const handleChangeTextOTP = (text) => {
    if (/^[0-9]*$/.test(text)) {
      setOtp(text);
    }
  };
  const sending = () => { //인증 번호를 보내는 프로세스
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
  const checking = () => { //인증 번호를 확인하는 프로세스
    if (process) return;
    setProcess(true);
    setTimeout(() => {
      if (String(otp) === String(tempNumber)) {
        setTempNumberChecking("인증에 성공하였습니다!\n자동으로 이동합니다.");
        // good();
      } else {
        setTempNumberChecking("인증에 실패하였습니다.");
      }
      setProcess(false);
    }, 3000);
  };
  const good = () => {
    useEffect(() => {
      const timer = setTimeout(() => {
        router.push('/home');
      }, 3000);
      return () => clearTimeout(timer);
    }, [router]);
  }
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Login</Text>
        <FontAwesome5 name="key" size={24} color="black" />
        {!go ? <>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setGo(true)}
            color="#00E6D8"
          >
            <Text style={styles.buttonText}>휴대폰 번호로 로그인</Text>
          </TouchableOpacity>
        </> : null}
        {go && !goo ?
          (<>
            <Text>가입되어 있지 않은 계정은 회원가입이 진행되며, 이미 가입된 계정은 로그인이 진행됩니다.</Text>
            <Text>회원가입이 진행되면 서비스 이용약관 및 개인정보처리방침에 동의함으로 간주합니다.</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={phone1}
              />-
              <TextInput
                style={styles.input}
                onChangeText={handleChangeTextPhone2}
                value={phone2}
                disabled={goto}
              />-
              <TextInput
                style={styles.input}
                onChangeText={handleChangeTextPhone3}
                value={phone3}
                disabled={goto}
              />
            </View>
          </>) : null}
        {(phone2.length + phone3.length) >= 8 && !goo ?
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={() => sending()}
              color="#00E6D8"
            >
              <Text style={styles.buttonText}>다음</Text>
              {process ? <ActivityIndicator size="small" color="#fff" /> : null}
            </TouchableOpacity>
          </> : ""}
        {(phone2.length + phone3.length) >= 8 && goo ?        
          <>
            <Text>입력하신 휴대폰 번호로 인증번호를 발송하였습니다.</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                onChangeText={handleChangeTextOTP}
                value={otp}
                disabled={goto}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => checking()}
                color="#00E6D8"
              >
                <Text style={styles.buttonText}>인증하기</Text>
                {process ? <ActivityIndicator size="small" color="#fff" /> : null}
              </TouchableOpacity>
            </View></>
          : ""}
          {tempNumberChecking}
      </View>
    </View>
  );
}