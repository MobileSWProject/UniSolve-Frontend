import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { mainColor } from "../../../../constants/Colors";
import ModalView from "../../../../components/modal/ModalView";
import _axios from "../../../../api";

import { useTranslation } from 'react-i18next';
import "../../../../i18n";

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();
  
  const [currentDate, setCurrentDate] = useState(convertDate());
  const [currentTime, setCurrentTime] = useState(convertTime());

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(convertDate());
      setCurrentTime(convertTime());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  function convertDate() {
    const date = new Date();
    return `${Number(date.getMonth() + 1)}${t("DateTime.month")} ${date
      .getDate()
      .toString()
      .padStart(2, "0")}${t("DateTime.day")} ${t(`DateTime.week_${date.getDay().toString()}`)}`;
  }
  function convertTime() {
    const date = new Date();
    return `${date.getHours().toString().padStart(2, "0")}${t("DateTime.hour")} ${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}${t("DateTime.minute")} ${date.getSeconds().toString().padStart(2, "0")}${t("DateTime.second")}`;
  }

  return (
    <SafeAreaView style={[styles.container, { marginTop: StatusBar.currentHeight }]}>
      <StatusBar backgroundColor={mainColor} barStyle="white-content" />
      <Text style={styles.timeDate}>{currentDate}</Text>
      <Text style={styles.timeText}>{currentTime}</Text>

      {/* 로고 페이지 */}
      <TouchableOpacity
        onPress={() => {router.push(`community?log_click=${true}`);}}
      >
        <Image
          source={require("../../../../assets/logo.png")}
          style={styles.logo}
        />
      </TouchableOpacity>

      <Text style={styles.timeDate}>{t("Function.main")}</Text>

      <ModalView
        type={modalType}
        visible={modalVisible}
        setVisible={setModalVisible}
      />

      <Image
        source={require("../../../../assets/logotypo.png")}
        style={styles.logotypo}
        resizeMode="contain"
      />

      {/* 알림 아이콘 */}
      <TouchableOpacity
        style={styles.alarmLink}
        onPress={() => {
          setModalType("notification");
          setModalVisible(true);
        }}
      >
        <Image
          source={require("../../../../assets/alarm.png")}
          style={styles.extralogo}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: mainColor,
  },
  welcomeText: {
    //환영합니다
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  timeDate: {
    //실시간
    fontSize: 40,
    marginBottom: 10,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  timeText: {
    //실시간
    fontSize: 50,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  logo: {
    //로고 이미지
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  logotypo: {
    //로고 이미지
    position: "absolute",
    width: 155,
    height: 45,
    top: 0,
    left: 5,
  },
  box: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  extralogo: {
    //알림 이미지
    top: 0,
    width: 40,
    height: 40,
  },
  expLink: {
    //경험치 링크 사진
    position: "absolute",
    top: 200,
    left: 60,
  },
  alarmLink: {
    // 알림 링크 사진
    position: "absolute",
    top: 15,
    right: 10,
  },
  profileLink: {
    // 알림 링크 사진
    position: "absolute",
    top: 15,
    right: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  buttonSmall: {
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 35,
    marginTop: 20,
    marginBottom: 10,
  },
  buttonTextSmall: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 20,
  },
  modalView: {
    maxWidth: "86%",
    maxHeight: "76%",
    aspectRatio: 5 / 7,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
