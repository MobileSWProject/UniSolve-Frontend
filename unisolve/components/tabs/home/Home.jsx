import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Text, Image, TouchableOpacity } from "react-native";
import { styles } from "../../../styles/tabs/home/HomeStyle";
import { useTranslation } from 'react-i18next';
import "../../../i18n";

export default function Home({setType, setVisible}) {
  const router = useRouter();
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(convertDT("date"));
  const [currentTime, setCurrentTime] = useState(convertDT("time"));

  useEffect(() => {
    const interval = setInterval(() => { 
      setCurrentDate(convertDT("date"));
      setCurrentTime(convertDT("time"));
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  function convertDT(type) {
    const date = new Date();
    if (type == "date") {
      return `${Number(date.getMonth() + 1)}${t("DateTime.month")} ${date.getDate().toString().padStart(2, "0")}${t("DateTime.day")} ${t(`DateTime.week_${date.getDay().toString()}`)}`;
    } else if (type == "time") {
      return `${date.getHours().toString().padStart(2, "0")}${t("DateTime.hour")} ${date.getMinutes().toString().padStart(2, "0")}${t("DateTime.minute")} ${date.getSeconds().toString().padStart(2, "0")}${t("DateTime.second")}`;
    } else {
      return "";
    }
  }

  return (
    <>
      <Image source={require("../../../assets/logotypo.png")} style={styles.logotypo} resizeMode="contain" />
      <TouchableOpacity style={styles.alarmLink} onPress={() => { setType("notification"); setVisible(true); }}
      >
        <Image source={require("../../../assets/alarm.png")} style={styles.extralogo} />
      </TouchableOpacity>

      <Text style={styles.timeDate}>{currentDate}</Text>
      <Text style={styles.timeText}>{currentTime}</Text>

      <TouchableOpacity style={{alignItems: "center"}} onPress={() => {router.push(`community?log_click=True`);}} >
        <Image source={require("../../../assets/logo.png")} style={styles.logo} />
      </TouchableOpacity>

      <Text style={styles.timeDate}>{t("Function.main")}</Text>
    </>
  );
}