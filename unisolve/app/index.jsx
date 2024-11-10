import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Animated,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "../styles/IndexStyle";
import { accountCheck } from "../utils/accountCheck";
import AsyncStorage from "@react-native-async-storage/async-storage";
import decodeJWT from "../utils/decodeJWT";
import ModalView from "../components/modal/ModalView";
import SnackBar from "../components/Snackbar";
import _axios from "../api";

import { useTranslation } from "react-i18next";
import "../i18n";

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();

  const [certification, setCertification] = useState(false);
  const [sending, setSending] = useState(false);
  const [checkID, setCheckID] = useState(false);
  const [id, setID] = useState("");
  const [pw, setPW] = useState("");
  const [loginCheck, setLoginCheck] = useState("");

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");

  const logoPosition = useRef(new Animated.Value(0)).current;
  const inputOpacity = useRef(new Animated.Value(0)).current;
  const pwOpacity = useRef(new Animated.Value(0)).current;
  const pwPosition = useRef(new Animated.Value(30)).current;
  const sendOpacity = useRef(new Animated.Value(0)).current;
  const sendPosition = useRef(new Animated.Value(0)).current;

  const snackBar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  useEffect(() => {
    const checkCertification = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const decodedToken = decodeJWT(token);
        const currentTime = Math.floor(Date.now() / 1000);
        const isTokenExpired = decodedToken.exp < currentTime;

        if (isTokenExpired) await AsyncStorage.removeItem("token");
        else {
          setCertification(true);
          snackBar(`${t("Stage.success")}${t("User.already")}`);
          setTimeout(() => {
            router.replace("/home");
          }, 1500);
        }
      } catch (error) {
        setCertification(false);
        snackBar(`${t("Stage.warning")}${t("User.login_please")}`);
        Animated.sequence([
          Animated.timing(logoPosition, {
            toValue: -25,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(inputOpacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start();
      }
    };
    checkCertification();
  }, [logoPosition, inputOpacity]);

  const handleSend = async () => {
    try {
      if (sending || id.length < 1) return;
      setSending(true);
      Animated.parallel([
        Animated.timing(sendPosition, {
          toValue: 100,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(sendOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
      if (checkID) {
        snackBar(`${t("Stage.process")}${t("User.login_process")}`);
        const response = await _axios.post(
          "/auth/login",
          JSON.stringify({ user_id: id, password: pw })
        );
        const token = response.data.token;
        if (token) {
          await AsyncStorage.setItem("token", token);
          snackBar(`${t("Stage.success")}${t("User.login_success")}`);
          setLoginCheck(true);
          setTimeout(() => {
            router.replace("/(app)/(tabs)/home");
          }, 1000);
        } else {
          snackBar(`${t("Stage.failed")}${t("User.login_failed")}`);
        }
        setSending(false);
      } else {
        const response = await accountCheck({ user_id: id }, snackBar, t, true);
        setCheckID(response);
        setSending(false);
        if (response) {
          Animated.parallel([
            Animated.timing(pwOpacity, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(pwPosition, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ]).start();
        } else {
          snackBar(`${t("Stage.failed")}${t("User.account_notfound")}`);
        }
      }
    } catch {
      setCheckID(false);
      setSending(false);
    } finally {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(sendOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(sendPosition, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
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
        Animated.timing(sendOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      if (sendOpacity._value < 1) return;
      Animated.parallel([
        Animated.timing(sendOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  return (
    <View style={styles.container}>
      <SnackBar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={() => setSnackbarVisible(false)}
      />
      <Animated.Image
        source={require("../assets/logo.png")}
        style={[styles.logo, { transform: [{ translateY: logoPosition }] }]}
      />
      {certification ? (
        <ActivityIndicator
          size="large"
          color="white"
        />
      ) : (
        <></>
      )}
      <Animated.View
        style={{
          opacity: inputOpacity,
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <TextInput
          style={styles.input}
          placeholder={t("User.id_please")}
          placeholderTextColor="#fff"
          value={id}
          onChangeText={(text) => {
            inputID(text);
          }}
          onSubmitEditing={handleSend}
          disabled={loginCheck}
        />
      </Animated.View>
      {checkID ? (
        <Animated.View
          style={{
            opacity: pwOpacity,
            transform: [{ translateY: pwPosition }],
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
          }}
        >
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
        </Animated.View>
      ) : (
        <></>
      )}
      <Animated.View style={{ opacity: inputOpacity, marginTop: 5 }}>
        <TouchableOpacity
          onPress={() => {
            setModalType("find");
            setModalVisible(true);
          }}
        >
          <Text style={styles.text}>{t("User.account_forget")}</Text>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={{ opacity: inputOpacity, marginTop: 15 }}>
        <TouchableOpacity
          onPress={() => {
            setModalType("register");
            setModalVisible(true);
          }}
        >
          <Text style={[styles.text, { fontWeight: "bold" }]}>
            {t("User.account_regist")}
          </Text>
        </TouchableOpacity>
      </Animated.View>
      {!certification ? (
        <Animated.View
          style={{
            opacity: sendOpacity,
            transform: [{ translateX: sendPosition }],
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
          >
            <MaterialCommunityIcons
              name="send"
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <></>
      )}
      {modalVisible ? (
        <ModalView
          type={modalType}
          visible={modalVisible}
          setVisible={setModalVisible}
        />
      ) : null}
    </View>
  );
}
