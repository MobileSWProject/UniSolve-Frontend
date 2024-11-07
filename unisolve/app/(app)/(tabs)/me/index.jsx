import { useCallback, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { mainColor } from "../../../../constants/Colors";
import { ProgressBar } from "react-native-paper";
import { getExpToLevel, getPercent, getLevel } from "../../../../components/tabs/me/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalView from "../../../../components/modal/ModalView";
import SnackBar from "../../../../components/Snackbar";
import _axios from "../../../../api";

import { useTranslation } from 'react-i18next';
import "../../../../i18n";

export default function MePage() {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const [user, setUser] = useState({});
  const [userProcess, setUserProcess] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");

  const [exp, setExp] = useState("");

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useFocusEffect(
    useCallback(() => {
      getUser();
    }, [])
  );

  const snackBar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

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

  const images = [
    require(`../../../../assets/icons/lv0.png`),
    require(`../../../../assets/icons/lv1.png`),
    require(`../../../../assets/icons/lv2.png`),
    require(`../../../../assets/icons/lv3.png`),
    require(`../../../../assets/icons/lv4.png`),
    require(`../../../../assets/icons/lv5.png`),
    require(`../../../../assets/icons/lv6.png`),
    require(`../../../../assets/icons/lv7.png`),
    require(`../../../../assets/icons/lv8.png`),
    require(`../../../../assets/icons/lv9.png`),
  ]

  return (
    <View style={styles.container}>
      <SnackBar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={() => setSnackbarVisible(false)}
      />
      {/* 프로필 이미지 */}
      <View style={styles.profileContainer}>
        <Image
          source={images[getLevel(exp)]}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.nickname}>
            {user.username} | {user.user_nickname}
          </Text>
          <Text style={styles.phoneNumber}>
            {user.school || t("User.school")}
          </Text>
          <Text style={[styles.phoneNumber, { marginBottom: 15, fontSize: 18, fontWeight: "bold", color: "#fff" }]}>
            {getExpToLevel(getLevel(exp))}
          </Text>
          <View style={styles.experienceContainer}>
            {getPercent(exp) < 100 ?
              <Text style={[styles.experienceText, { color: getPercent(exp) <= 33 ? mainColor : "#000" }]}>{getPercent(exp)}%</Text> :
              <></>}
            <ProgressBar
              styleAttr="Horizontal"
              indeterminate={false}
              progress={getPercent(exp) / 100}
              color={mainColor}
              style={styles.progressBar}
            />
          </View>
        </View>
      </View>

      <Text style={[styles.buttonText, { fontWeight: "bold", marginTop: 20 }]}>{t("Menu.account")}</Text>
      <TouchableOpacity
        onPress={() => {
          setModalType("modify");
          setModalVisible(true);
        }}
      >
        <Text style={styles.buttonText}>{t("User.edit")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setModalType("sanction");
          setModalVisible(true);
        }}>
        <Text style={styles.buttonText}>{t("User.sanction")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setModalType("history");
          setModalVisible(true);
        }}
      >
        <Text style={styles.buttonText}>{t("Function.history")}</Text>
      </TouchableOpacity>
      <Text style={[styles.buttonText, { fontWeight: "bold", marginTop: 20 }]}>{t("Menu.settings")}</Text>
      <TouchableOpacity onPress={() => { }}>
        <Text style={styles.buttonText}>{true ? t("Menu.darkmode") : t("Menu.lightmode")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          if (i18n.language === "ko") {
            i18n.changeLanguage("en");
            snackBar(`${t("Stage.success")} ${t("Menu.en")}${t("Function.convert")}`);
          } else {
            i18n.changeLanguage("ko")
            snackBar(`${t("Stage.success")} ${t("Menu.ko")}${t("Function.convert")}`);
          }
        }}>
        <Text style={styles.buttonText}>{`${t("Menu.lang")}(${t(i18n.language === "ko" ? "Menu.ko" : "Menu.en")})`}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { }}>
        <Text style={styles.buttonText}>{t("Menu.notification")}</Text>
      </TouchableOpacity>
      <Text style={[styles.buttonText, { fontWeight: "bold", marginTop: 20 }]}>{t("Menu.use")}</Text>
      <TouchableOpacity onPress={() => { }}>
        <Text style={styles.buttonText}>{t("Menu.version")}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { }}>
        <Text style={styles.buttonText}>{t("Menu.support")}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { }}>
        <Text style={styles.buttonText}>{t("Menu.notice")}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { }}>
        <Text style={styles.buttonText}>{t("Menu.operation")}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { }}>
        <Text style={styles.buttonText}>{t("Menu.privacy")}</Text>
      </TouchableOpacity>
      <Text style={[styles.buttonText, { fontWeight: "bold", marginTop: 20 }]}>기타</Text>
      <TouchableOpacity
        onPress={() => {
          setModalType("delete");
          setModalVisible(true);
        }}
      >
        <Text style={styles.buttonText}>{t("User.delete")}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={async () => {
        await AsyncStorage.removeItem("token");
        router.replace("/");
      }}>
        <Text style={styles.buttonText}>{t("User.logout")}</Text>
      </TouchableOpacity>
      {modalVisible ? (
        <ModalView
          type={modalType}
          visible={modalVisible}
          setVisible={setModalVisible}
          userData={user}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mainColor,
    alignItems: "center",
    justifyContent: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
  },
  nickname: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  phoneNumber: {
    marginTop: 10,
    fontSize: 14,
    color: "#ccc",
  },
  buttonText: {
    fontSize: 16,
    marginBottom: 4,
    color: "#fff",
  },
  experienceContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  experienceText: {
    color: mainColor,
    position: "absolute",
    zIndex: 1,
  },
  progressBar: {
    borderWidth: 0.5,
    borderColor: "#fff",
    width: 150,
    height: 15,
  },
});
