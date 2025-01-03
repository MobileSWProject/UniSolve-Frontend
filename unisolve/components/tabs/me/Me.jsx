import { useCallback, useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, Platform } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { ProgressBar } from "react-native-paper";
import { getExpToLevel, getLevel, getPercent } from "../../../utils/expUtils";
import LevelImage from "../../../components/tabs/me/LevelImage"
import { styles } from "../../../styles/tabs/me/MeStyle";
import { mainColor } from "../../../constants/Colors";
import ModalView from "../../../components/modal/ModalView";
import SnackBar from "../../../components/Snackbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Application from 'expo-application';
import _axios from "../../../api";
import { useTranslation } from "react-i18next";
import "../../../i18n";

export default function Me() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState({});
  const [process, setProcess] = useState(false);
  const [exp, setExp] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useFocusEffect( useCallback(() => { getUser(); }, []) );

  const snackBar = (message) => { setSnackbarMessage(message); setSnackbarVisible(true); };

  async function getUser() {
    if (process) return;
    try {
      setProcess(true);
      const response = await _axios.get("/accounts/mine");
      if (!response.data.data.username) {
        await AsyncStorage.clear();
        router.replace("/");
        return;
      }
      setUser(response.data.data);
      setExp(response.data.data.exp || 0);
      setProcess(false);
    } catch {
      await AsyncStorage.clear();
      router.replace("/");
    }
  }

  async function language() {
    if (process) return;
    setProcess(true);
    if (i18n.language === "ko") {
      try { await _axios.put(`/app/language?lang=${"en"}`); } catch {}
      i18n.changeLanguage("en");
      snackBar(`${t("Stage.success")} ${t("Menu.en")}${t("Function.convert")}`);
    } else if (i18n.language === "en") {
      try { await _axios.put(`/app/language?lang=${"ja"}`); } catch {}
      i18n.changeLanguage("ja");
      snackBar(`${t("Stage.success")} ${t("Menu.ja")}${t("Function.convert")}`);
    } else if (i18n.language === "ja") {
      try { await _axios.put(`/app/language?lang=${"zh"}`); } catch {}
      i18n.changeLanguage("zh");
      snackBar(`${t("Stage.success")} ${t("Menu.zh")}${t("Function.convert")}`);
    } else {
      try { await _axios.put(`/app/language?lang=${"ko"}`); } catch {}
      i18n.changeLanguage("ko");
      snackBar(`${t("Stage.success")} ${t("Menu.ko")}${t("Function.convert")}`);
    }
    setProcess(false);
  }

  async function getVersion() {
    if (process) return;
    try {
      if (Platform.OS === "web") {
        return snackBar(`${t("Stage.failed")} ${t("Function.version_web")}`);
      }
      setProcess(true);
      snackBar(`${t("Stage.process")}${t("Function.version_check")}`);
      const response = await _axios.get(`/app/version?platform=${Platform.OS}`);
      if (response) {
        if (response.data.data.version !== Application.nativeApplicationVersion) {
          snackBar(`${t("Stage.success")} ${t("Function.version_go")} (${response.data.data.version ?? "0"})`);
        } else {
          snackBar(`${t("Stage.success")} ${t("Function.version_release")} (${response.data.data.version ?? "0"})`);
        }
      }
      setProcess(false);
    } catch {
      setProcess(false);  
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => { setModalType("exp"); setModalVisible(true); }}>
          <LevelImage exp={exp} size={120} />
        </TouchableOpacity>
        <View>
          <Text style={styles.nickname}> {user.username} | {user.user_nickname} </Text>
          <Text style={styles.phoneNumber}> {user.school || t("User.school")} </Text>
          <Text style={[ styles.phoneNumber, { marginBottom: 15, fontSize: 18, fontWeight: "bold", color: "#fff" } ]}> {getExpToLevel(t, getLevel(exp))} </Text>
          <View style={styles.experienceContainer}>
            {
              getPercent(exp) < 100 ? 
              <Text style={[ styles.experienceText, { color: getPercent(exp) <= 33 ? mainColor : "#000" } ]}> {getPercent(exp)}% </Text> :
              null
            }
            <ProgressBar styleAttr="Horizontal" indeterminate={false} progress={Number((getPercent(exp) / 100).toFixed(1))} color={mainColor} style={styles.progressBar} />
          </View>
        </View>
      </View>

      <Text style={[styles.buttonText, { fontWeight: "bold", marginTop: 20 }]}> {t("Menu.account")} </Text>
      <TouchableOpacity onPress={() => { setModalType("modify"); setModalVisible(true); }} >
        <Text style={styles.buttonText}>{t("User.edit")}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { setModalType("sanction"); setModalVisible(true); }} >
        <Text style={styles.buttonText}>{t("User.sanction")}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { setModalType("history"); setModalVisible(true); }} >
        <Text style={styles.buttonText}>{t("Function.history")}</Text>
      </TouchableOpacity>

      <Text style={[styles.buttonText, { fontWeight: "bold", marginTop: 20 }]}> {t("Menu.settings")} </Text>
      <TouchableOpacity
        onPress={() => { language(); }}
      >
        <Text style={styles.buttonText}>{`${t("Menu.lang")}(${t(i18n.language === "ko" ? "Menu.en" : i18n.language === "en" ? "Menu.ja" : i18n.language === "ja" ? "Menu.zh" : "Menu.ko")})`}</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => {
          setModalType("alert");
          setModalVisible(true);
        }}>
        <Text style={styles.buttonText}>{t("Menu.notification")}</Text>
      </TouchableOpacity>

      <Text style={[styles.buttonText, { fontWeight: "bold", marginTop: 20 }]}>{t("Menu.use")}</Text>
      <TouchableOpacity onPress={() => { getVersion(); }}>
        <Text style={styles.buttonText}>{t("Menu.version")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setModalType("support");
          setModalVisible(true);
        }}
      >
        <Text style={styles.buttonText}>{t("Menu.support")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setModalType("terms");
          setModalVisible(true);
        }}
      >
        <Text style={styles.buttonText}>{t("Menu.terms")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setModalType("privacy");
          setModalVisible(true);
        }}
      >
        <Text style={styles.buttonText}>{t("Menu.privacy")}</Text>
      </TouchableOpacity>

      <Text style={[styles.buttonText, { fontWeight: "bold", marginTop: 20 }]}>{t("Menu.etc")}</Text>
      <TouchableOpacity onPress={() => { setModalType("delete"); setModalVisible(true); }}>
        <Text style={styles.buttonText}>{t("User.delete")}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={async () => { await AsyncStorage.removeItem("token"); router.replace("/"); }}>
        <Text style={styles.buttonText}>{t("User.logout")}</Text>
      </TouchableOpacity>
      
      <ModalView type={modalType} visible={modalVisible} setVisible={setModalVisible} userData={user}/>
      <SnackBar visible={snackbarVisible} message={snackbarMessage} onDismiss={() => setSnackbarVisible(false)}/>
    </SafeAreaView>
  );
}