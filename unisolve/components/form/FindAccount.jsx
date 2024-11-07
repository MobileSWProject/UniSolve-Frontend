import { useState } from "react";
import { Text } from "react-native";
import SnackBar from "../Snackbar";
import Input from "./Input";
import InputProcess from "./InputProcess";
import _axios from "../../api";

import { useTranslation } from 'react-i18next';
import "../../i18n";

export default function FindAccount({ visible, setVisible }) {
  const { t } = useTranslation();

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [findName, setFindName] = useState("");
  const [findEmail, setFindEmail] = useState("");
  const [findID, setFindID] = useState("");
  const [findSending, setFindSending] = useState(false);

  const snackBar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const findAccount = async () => {
    try {
      if (findSending) return;
      let response;
      setFindSending(true);
      snackBar(`${t("Stage.process")}${t("User.search_account_process")}`);
      if (findID.length === 0)
        response = await _axios.post("/accounts/find_user_id", { name: findName, email: findEmail });
      else if (findID.length > 0)
        response = await _axios.post("/accounts/reset_password_request", { user_id: findID, username: findName, email: findEmail });
      if (response.data.isSent || response.data.foundpw) 
        snackBar(`${t("Stage.success")}${t("User.search_account_success")}`);
    } catch {
      snackBar(`${t("Stage.failed")}${t("User.search_account_failed")}`);
    } finally {
      setTimeout(() => {
        setVisible(false);
        setFindSending(false);
      }, 2000);
    }
  };

  return (
    <>
      <SnackBar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={() => setSnackbarVisible(false)}
      />
      <Text style={{ fontSize: 25, marginBottom: 5, fontWeight: "bold" }}>
        {t("User.search_account")}
      </Text>
      <Text style={{ fontSize: 12, marginBottom: 10 }}>
        {t("User.search_account_subtitle")}
      </Text>
      <Input
        title={t("User.name")}
        content={findName}
        onChangeText={setFindName}
        disabled={findSending}
      />
      <Input
        title={t("User.email")}
        content={findEmail}
        onChangeText={setFindEmail}
        disabled={findSending}
      />
      {
        findName && findEmail ?
        <Input
          title={`${t("User.id")}(${t("User.search_account_password_please")})`}
          placeholder={t("User.id_please")}
          content={findID}
          onChangeText={setFindID}
          disabled={findSending}
        /> :
        null
      }
      <InputProcess
        visible={visible}
        setVisible={setVisible}
        onPress={() => { findAccount(); }}
        content={findID ? t("User.search_account_password") : t("User.search_account_id")}
        cancel={findSending}
        disabled={findSending || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(findEmail) || !findName}
      />
    </>
  );
}