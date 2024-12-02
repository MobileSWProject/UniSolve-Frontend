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
      setProcess(false);
      if (response.data.success) {
        snackBar(`${t("Stage.success")} ${t("Function.sent")}`);
      } else {
        snackBar(`${t("Stage.failed")} ${t("Function.sent_failed")}`);
      }
    } catch {
      snackBar(`${t("Stage.failed")} ${t("User.error")}`);
    } finally {
      setTimeout(async () => { setVisible(false); setProcess(false); }, 2000);
    }
  };

  return (
    <>
      <SnackBar visible={snackbarVisible} message={snackbarMessage} onDismiss={() => setSnackbarVisible(false)} />
      <Text style={{ fontSize: 40, marginBottom: 10, textAlign: "center", fontWeight: "bold", color: mainColor, marginTop: 4 }}>{t("Function.support")}</Text>
      <View style={{ alignContent: "center" }}>
        <TouchableOpacity
          style={{ backgroundColor: status === "good" ? "#666" : "" }}
          onPress={() => {
            if (status !== "good") {
              setStatus("good");
            } else {
              setStatus("");
            }
          }}>
          <FontAwesome name="thumbs-o-up" size={24} color={mainColor} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: status === "bad" ? "#666" : "" }}
          onPress={() => {
            if (status !== "bad") {
              setStatus("bad");
            } else {
              setStatus("");
            }
          }}>
          <FontAwesome name="thumbs-o-down" size={24} color={mainColor} />
        </TouchableOpacity>
      </View>
      <Input
        title={t("Function.content")}
        content={content}
        onChangeText={(text) => setContent(text)}
        buttonDisabled={process || !content || content.length <= 0}
        buttonOnPress={() => { setVisible(false); setProcess(false); }}
        disabled={process}
      />
      <InputProcess
        setVisible={setVisible}
        onPress={() => { sendProcess(); }}
        content={t("Function.regist")}
        cancel={process}
        disabled={process}
      />
    </>
  );
}
