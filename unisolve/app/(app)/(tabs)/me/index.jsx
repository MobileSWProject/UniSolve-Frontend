import { useCallback, useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { ProgressBar } from "react-native-paper";
import { getExpToLevel, getLevel, getPercent,} from "../../../../utils/expUtils";
import LevelImage from "../../../../components/tabs/me/LevelImage"
import { styles } from "../../../../styles/tabs/me/MeStyle";
import { mainColor } from "../../../../constants/Colors";
import ModalView from "../../../../components/modal/ModalView";
import SnackBar from "../../../../components/Snackbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import _axios from "../../../../api";
import { useTranslation } from "react-i18next";
import "../../../../i18n";

export default function MePage() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState({});
  const [userProcess, setUserProcess] = useState(false);
  const [exp, setExp] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useFocusEffect( useCallback(() => { getUser(); }, []) );

  const snackBar = (message) => { setSnackbarMessage(message); setSnackbarVisible(true); };

  async function getUser() {
    if (userProcess) return;
    try {
      setUserProcess(true);
      const response = await _axios.get("/accounts/mine");
      if (!response.data.data.username) {
        await AsyncStorage.clear();
        router.replace("/");
        return;
      }
      setUser(response.data.data);
      setExp(response.data.data.exp || 0);
      setUserProcess(false);
    } catch {
      router.replace("/");
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
            <ProgressBar styleAttr="Horizontal" indeterminate={false} progress={getPercent(exp) / 100} color={mainColor} style={styles.progressBar} />
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
      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.buttonText}> {true ? t("Menu.darkmode") : t("Menu.lightmode")} </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          if (i18n.language === "ko") {
            i18n.changeLanguage("en");
            snackBar(`${t("Stage.success")} ${t("Menu.en")}${t("Function.convert")}`);
          } else {
            i18n.changeLanguage("ko");
            snackBar(`${t("Stage.success")} ${t("Menu.ko")}${t("Function.convert")}`);
          }
        }}
      >
        <Text style={styles.buttonText}>{`${t("Menu.lang")}(${t(i18n.language === "ko" ? "Menu.ko" : "Menu.en")})`}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.buttonText}>{t("Menu.notification")}</Text>
      </TouchableOpacity>

      <Text style={[styles.buttonText, { fontWeight: "bold", marginTop: 20 }]}>{t("Menu.use")}</Text>
      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.buttonText}>{t("Menu.version")}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.buttonText}>{t("Menu.support")}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.buttonText}>{t("Menu.notice")}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.buttonText}>{t("Menu.operation")}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}}>
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