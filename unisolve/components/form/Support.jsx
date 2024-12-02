import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { mainColor } from "../../constants/Colors";
import SnackBar from "../Snackbar";
import Input from "./Input";
import InputProcess from "./InputProcess";
import _axios from "../../api";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTranslation } from "react-i18next";
import "../../i18n";

export default function Support({ setVisible }) {
  const { t } = useTranslation();
  const [process, setProcess] = useState(false);
  const [status, setStatus] = useState("");
  const [content, setContent] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const snackBar = (message) => { setSnackbarMessage(message); setSnackbarVisible(true); };

  const sendProcess = async () => {
    if (process || !content || content.length <= 0) {
      snackBar(`${t("Stage.failed")} ${t("User.empty_content")}`);
      return;
    }
    try {
      setProcess(true);
      snackBar(`${t("Stage.process")} ${t("Function.sending")}`);
      const response = await _axios.put("/app/support", { status, content });
      if (response.data.status === "success") {
        snackBar(`${t("Stage.success")} ${t("Function.sent")}`);
        setTimeout(async () => { setVisible(false); setProcess(false); }, 2000);
      } else {
        snackBar(`${t("Stage.failed")} ${t("Function.sent_failed")}`);
        setProcess(false);
      }
    } catch {
      snackBar(`${t("Stage.failed")} ${t("User.error")}`);
      setProcess(false);
    }
  };

  return (
    <>
      <SnackBar visible={snackbarVisible} message={snackbarMessage} onDismiss={() => setSnackbarVisible(false)} />
      <Text style={{ fontSize: 40, marginBottom: 10, textAlign: "center", fontWeight: "bold", color: mainColor, marginTop: 4 }}>{t("Function.support")}</Text>
      <View style={{ display: "flex", flexDirection: "row" }}>
        <View style={{ alignItems: "center", marginRight: 30 }}>
          <TouchableOpacity
            style={{ backgroundColor: status === "good" ? "#DDD" : "white", borderRadius: 50, padding: 10 }}
            onPress={() => {
              if (status !== "good") {
                setStatus("good");
              } else {
                setStatus("");
              }
            }}>
            <FontAwesome name="thumbs-o-up" size={42} color={mainColor} />
            </TouchableOpacity>
            <Text>{t("Function.support_good")}</Text>
          </View>
          <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={{ backgroundColor: status === "bad" ? "#DDD" : "white", borderRadius: 50, padding: 10 }}
            onPress={() => {
              if (status !== "bad") {
                setStatus("bad");
              } else {
                setStatus("");
              }
            }}>
            <FontAwesome name="thumbs-o-down" size={42} color={mainColor} />
            </TouchableOpacity>
            <Text>{t("Function.support_bad")}</Text>
          </View>
      </View>
      <Input
        title={t("Function.content")}
        content={content}
        onChangeText={(text) => setContent(text)}
        disabled={process}
      />
      <InputProcess
        setVisible={setVisible}
        onPress={() => { sendProcess(); }}
        content={t("Function.regist")}
        cancel={process}
        disabled={process || !content || content.length <= 0}
      />
    </>
  );
}
