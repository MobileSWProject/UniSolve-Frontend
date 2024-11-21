import { useState } from "react";
import { useRouter } from "expo-router";
import { Text } from "react-native";
import SnackBar from "../Snackbar";
import Input from "./Input";
import InputProcess from "./InputProcess";
import AsyncStorage from "@react-native-async-storage/async-storage";
import _axios from "../../api";
import { useTranslation } from 'react-i18next';
import "../../i18n";

export default function Delete({ visible, setVisible }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [deleting, setDeleting] = useState(false);
  const [password, setPassword] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const snackBar = (message) => { setSnackbarMessage(message); setSnackbarVisible(true); };

  const DeletedProcess = async () => {
    try {
      if (deleting || !password) {
        snackBar(`${t("Stage.failed")}${t("Function.empty_content")}`);
        return;
      }
      setDeleting(true);
      snackBar(`${t("Stage.process")}${t("User.delete_process")}`);
      const response = await _axios.delete("/accounts", { data: { password } })
      if (response.data.deleted === true) {
        snackBar(`${t("Stage.success")}${t("User.delete_success")}`);
        setTimeout(async () => {
          setVisible(false);
          await AsyncStorage.clear();
          router.replace("/");
          return;
        }, 2000);
      }
    } catch {
      snackBar(`${t("Stage.failed")}${t("User.delete_failed")}`);
      setTimeout(async () => {
        setDeleting(false);
        setVisible(false);
      }, 2000);
    }
  };

  return (
    <>
      <Text style={{ fontSize: 25, marginBottom: 5, fontWeight: "bold" }}>{t("User.delete")}</Text>
      <Text style={{ textAlign: "center", color: "#ff0000", fontWeight: "bold" }}>{t("User.delete_notice")}</Text>
      <Input
        title={t("User.current_password")}
        content={password}
        onChangeText={(text) => setPassword(text)}
        secure={true}
      />
      <InputProcess
        visible={visible}
        setVisible={setVisible}
        onPress={() => { DeletedProcess(); }}
        type="delete"
        content={t("User.delete_go")}
        cancel={deleting}
        disabled={deleting}
      />
      <SnackBar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={() => setSnackbarVisible(false)}
      />
    </>
  );
}