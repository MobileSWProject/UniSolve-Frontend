import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { mainColor } from "../../constants/Colors";
import SnackBar from "../Snackbar";
import InputProcess from "./InputProcess";
import _axios from "../../api";
import SwitchBtn from "./Switch";
import { useTranslation } from "react-i18next";
import "../../i18n";

export default function Alert({ setVisible }) {
  const { t } = useTranslation();
  const [process, setProcess] = useState(false);
  const [type, setType] = useState({week: false, night: false, marketing: false});
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const snackBar = (message) => { setSnackbarMessage(message); setSnackbarVisible(true); };

  useEffect(() => {
    getAlert();
  }, []);

  const getAlert = async () => {
    if (process) return;
    try {
      setProcess(true);
      const response = await _axios.get("/app/alert");
      if (response.data.status === "success") {
        setProcess(false);
        return setType(response.data.data);
      }
      setProcess(false);
    } catch (error) {
      snackBar(`${t(`Stage.failed`)} [${error.response.status}] ${t(`Status.${error.response.status}`)}`);
      setProcess(false);
    }
  }

  const sendProcess = async () => {
    if (process) return;
    try {
      setProcess(true);
      snackBar(`${t("Stage.process")} ${t("Function.setting_go")}`);
      const response = await _axios.put("/app/alert", { type });
      if (response.data.status === "success") {
        snackBar(`${t("Stage.success")} ${t("Function.setting_success")}`);
        setTimeout(async () => { setVisible(false); setProcess(false); }, 2000);
      } else {
        snackBar(`${t("Stage.failed")} ${t("Function.setting_failed")}`);
        setProcess(false);
      }
    } catch (error) {
      snackBar(`${t(`Stage.failed`)} [${error.response.status}] ${t(`Status.${error.response.status}`)}`);
      setProcess(false);
    }
  };

  return (
    <>
      <SnackBar visible={snackbarVisible} message={snackbarMessage} onDismiss={() => setSnackbarVisible(false)} />
      <Text style={{ fontSize: 40, marginBottom: 10, textAlign: "center", fontWeight: "bold", color: mainColor, marginTop: 4 }}>{t("Menu.notification")}</Text>
      <View style={{ display: "flex", flexDirection: "row"}}>
        <View style={{marginRight: 5}}>
          <Text style={{fontSize: 20, fontWeight: "bold", color: type.week ? mainColor : "black"}}>{`${t("Function.alert_week")} ${t("Function.alert_check")}`}</Text>
          <Text style={{fontSize: 12, fontWeight: "bold", color: type.week ? mainColor : "black", alignItems: "center"}}>{"06:00 ~ 22:00"}</Text>
        </View>
        <SwitchBtn
          disabled={process}
          setValue={() => setType((prevType) => ({ ...prevType, week: !type.week }))}
          value={type.week}
        />
      </View>
      <View style={{ display: "flex", flexDirection: "row", marginTop: 20}}>
        <View style={{marginRight: 5}}>
          <Text style={{fontSize: 20, fontWeight: "bold", color: type.night ? mainColor : "black"}}>{`${t("Function.alert_night")} ${t("Function.alert_check")}`}</Text>
          <Text style={{fontSize: 12, fontWeight: "bold", color: type.night ? mainColor : "black", alignItems: "center"}}>{"22:00 ~ 06:00"}</Text>
        </View>
        <SwitchBtn
          disabled={process}
          setValue={() => setType((prevType) => ({ ...prevType, night: !type.night }))}
          value={type.night}
        />
      </View>
      <View style={{ display: "flex", flexDirection: "row", marginTop: 20}}>
      <View style={{marginRight: 5}}>
          <Text style={{fontSize: 20, fontWeight: "bold", color: type.marketing ? mainColor : "black"}}>{`${t("Function.alert_marketing")} ${t("Function.alert_check")}`}</Text>
        </View>
        <SwitchBtn
          disabled={process}
          setValue={() => setType((prevType) => ({ ...prevType, marketing: !type.marketing }))}
          value={type.marketing}
        />
      </View>
      <InputProcess
        setVisible={setVisible}
        onPress={() => { sendProcess(); }}
        content={t("Function.setting")}
        cancel={process}
        disabled={process}
      />
    </>
  );
}
