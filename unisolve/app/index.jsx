import { useState, useEffect, useRef } from "react";
import { SafeAreaView, Text, ActivityIndicator, Animated, TextInput, TouchableOpacity, Pressable, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "../styles/IndexStyle";
import ModalView from "../components/modal/ModalView";
import SnackBar from "../components/Snackbar";
import { accountCheck } from "../utils/accountCheck";
import AsyncStorage from "@react-native-async-storage/async-storage";
import decodeJWT from "../utils/decodeJWT";
import _axios from "../api";
import { useTranslation } from "react-i18next";
import "../i18n";

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [certification, setCertification] = useState(false);
  const [sending, setSending] = useState(false);
  const [checkID, setCheckID] = useState(false);
  const [id, setID] = useState("");
  const [pw, setPW] = useState("");
  const [loginCheck, setLoginCheck] = useState("");
  const logoPosition = useRef(new Animated.Value(0)).current;
  const inputOpacity = useRef(new Animated.Value(0)).current;
  const pwOpacity = useRef(new Animated.Value(0)).current;
  const pwPosition = useRef(new Animated.Value(30)).current;
  const sendOpacity = useRef(new Animated.Value(0)).current;
  const sendPosition = useRef(new Animated.Value(0)).current;

  const snackBar = (message) => { setSnackbarMessage(message); setSnackbarVisible(true); };

  useEffect(() => {
    const checkCertification = async () => { // 토큰 및 인증 값 유효 여부 확인
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) { // 토큰 유실
          throw new Error("Not Login");
        }
        const decodedToken = decodeJWT(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) { // 토큰 만료
          await AsyncStorage.removeItem("token");
          throw new Error("Not Login");
        } else { // 토큰 유효
          setCertification(true);
          snackBar(`${t("Stage.success")} ${t("User.already")}`);
          setTimeout(() => { router.replace("/home"); }, 1500);
        }
      } catch (error) {
        setCertification(false);
        snackBar(`${t("Stage.warning")}${t("User.login_please")}`);
        Animated.sequence([
          Animated.timing(logoPosition, { toValue: -25, duration: 500, useNativeDriver: true }),
          Animated.timing(inputOpacity, { toValue: 1, duration: 250, useNativeDriver: true })
        ]).start();
      }
    };
    checkCertification();
  }, []);

  const handleSend = async () => {
    try {
      if (sending || id.length < 1) return;
      setSending(true);
      Animated.parallel([
        Animated.timing(sendPosition, { toValue: 100, duration: 500, useNativeDriver: true }), // 비행기가 서서히 사라짐
        Animated.timing(sendOpacity, { toValue: 0, duration: 500, useNativeDriver: true }) // 비행기가 오른쪽으로 이동
      ]).start();
      if (checkID) {
        snackBar(`${t("Stage.process")} ${t("User.login_process")}`);
        const response = await _axios.post("/auth/login", JSON.stringify({ user_id: id, password: pw })); // 로그인 프로세스
        const token = response.data.token;
        if (token) {
          await AsyncStorage.setItem("token", token); // 토큰 저장
          snackBar(`${t("Stage.success")} ${t("User.login_success")}`);
          setLoginCheck(true);
          setTimeout(() => { router.replace("/(app)/(tabs)/home"); }, 1000);
        } else {
          snackBar(`${t("Stage.failed")} ${t("User.login_failed")}`);
        }
        setSending(false);
      } else {
        const response = await accountCheck({ user_id: id }, snackBar, t, true);
        setCheckID(response);
        setSending(false);
        if (response) {
          Animated.parallel([
            Animated.timing(pwOpacity, { toValue: 1, duration: 500, useNativeDriver: true }), // 아이디가 유효하면, 비밀번호 입력란이 서서히 나타남
            Animated.timing(pwPosition, { toValue: 0, duration: 500, useNativeDriver: true }) // 아이디가 유효하면, 비밀번호 입력란 정위치
          ]).start();
        } else {
          snackBar(`${t("Stage.failed")} ${t("User.account_notfound")}`);
        }
      }
    } catch {
      setCheckID(false);
      setSending(false);
    } finally {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(sendOpacity, { toValue: 1, duration: 500, useNativeDriver: true }), // 비행기가 서서히 나타남
          Animated.timing(sendPosition, { toValue: 0, duration: 500, useNativeDriver: true }) // 비행기가 원래 위치로 이동함
        ]).start();
      }, 1000);
    }
  };

  const inputID = (text) => {
    setID(text);
    setCheckID(false);
    setPW("");
    if (text.length > 0) {
      if (sendOpacity._value > 0) return;
      Animated.parallel([
        Animated.timing(sendOpacity, { toValue: 1, duration: 250, useNativeDriver: true }), // 아이디 입력이 바뀌면, 비행기가 서서히 나타남
      ]).start();
    } else {
      if (sendOpacity._value < 1) return;
      Animated.parallel([
        Animated.timing(sendOpacity, { toValue: 0, duration: 250, useNativeDriver: true }) // 아이디 입력이 바뀌면, 비행기가 서서히 사라짐
      ]).start();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.container} onPress={()=>Keyboard.dismiss()}>
        <Animated.Image source={require("../assets/logo.png")} style={[styles.logo, { transform: [{ translateY: logoPosition }] }]} />
        {
          certification ?
          <ActivityIndicator size="large" color="white" /> :
          null
        }
        <Animated.View style={{ opacity: inputOpacity, flexDirection: "column", alignItems: "flex-start", }} >
          <TextInput
            style={styles.input}
            placeholder={t("User.id_please")}
            placeholderTextColor="#fff"
            value={id}
            onChangeText={(text) => { inputID(text); }}
            onSubmitEditing={handleSend}
            disabled={loginCheck}
          />
        </Animated.View>
        {
          checkID ?
          <Animated.View style={{ opacity: pwOpacity, transform: [{ translateY: pwPosition }], flexDirection: "row", alignItems: "center", marginTop: 10, }}>
            <TextInput
              style={styles.input}
              placeholder={t("User.password_please")}
              placeholderTextColor="#fff"
              value={pw}
              onChangeText={setPW}
              secureTextEntry={true}
              onSubmitEditing={handleSend}
              disabled={loginCheck}
            />
          </Animated.View> :
          null
        }
        <Animated.View style={{ opacity: inputOpacity, marginTop: 5 }}>
          <TouchableOpacity onPress={() => { setModalType("find"); setModalVisible(true); }} >
            <Text style={styles.text}>{t("User.account_forget")}</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={{ opacity: inputOpacity, marginTop: 15 }}>
          <TouchableOpacity onPress={() => { setModalType("register"); setModalVisible(true); }} >
            <Text style={[styles.text, { fontWeight: "bold" }]}> {t("User.account_regist")} </Text>
          </TouchableOpacity>
        </Animated.View>
        {
          !certification ?
          <Animated.View style={{ opacity: sendOpacity, transform: [{ translateX: sendPosition }], flexDirection: "row", alignItems: "center", }} >
            <TouchableOpacity style={styles.sendButton} onPress={handleSend} >
              <MaterialCommunityIcons name="send" size={24} color="white" />
            </TouchableOpacity>
          </Animated.View> :
          null
        }
        {
          modalVisible ?
          <ModalView type={modalType} visible={modalVisible} setVisible={setModalVisible} /> :
          null
        }
        <SnackBar visible={snackbarVisible} message={snackbarMessage} onDismiss={() => setSnackbarVisible(false)} />
      </Pressable>
    </SafeAreaView>
  );
}
