import { useState } from "react";
import { Text } from "react-native";
import SnackBar from "../Snackbar";
import Input from "./Input";
import InputProcess from "./InputProcess";
import _axios from "../../api";

import { useTranslation } from 'react-i18next';
import "../../i18n";

export default function Modify({ visible, setVisible, userData }) {
  const { t } = useTranslation(); 
  const [user, setUser] = useState(userData);

  const [editing, setEditing] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [email, setEmail] = useState(userData.email);
  const [emailConfirm, setEmailConfirm] = useState("");
  const [emailCheck, setEmailCheck] = useState(true);
  const [emailChecks, setEmailChecks] = useState(true);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [subPassword, setSubPassword] = useState("");
  const [nickname, setNickname] = useState(userData.user_nickname);
  const [nicknameCheck, setNicknameCheck] = useState(true);

  const [emailProcess, setEmailProcess] = useState(false);
  const [emailProcessTo, setEmailProcessTo] = useState(false);

  const snackBar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const CheckProcess = async (value) => {
    try {
      snackBar(`${t("Stage.process")}${t("Function.waiting")}`);
      const response = await _axios.post("/accounts/existuser", value);
      snackBar(`${t("Stage.success")}${t("User.confirm_success")}`);
      const result = response.data.isNotExist || false;
      if (!result) snackBar(`${t("Stage.failed")}${t("User.confirm_failed")}`);
      if (value.user_id) setReIDCheck(result);
      else if (value.email) return result;
      else if (value.nickname) setNicknameCheck(result);
    } catch {
      snackBar(`${t("Stage.failed")}${t("User.error")}`);
      if (type) return false;
      if (value.email) return false;
      if (value.nickname) setNicknameCheck(false);
    }
  };

  const EditProcess = async () => {
    if (editing || password.length <= 0 || !emailChecks || (newPassword.length > 0 && newPassword !== subPassword) || nickname.length <= 0) {
      snackBar(`${t("Stage.failed")}${t("Function.empty_content")}`);
      return;
    }
    try {
      setEditing(true);
      snackBar(`${t("Stage.process")}${t("Function.edit_account_process")}`);
      const response = await _axios.put("/accounts", {
        current_password: password,
        email: email,
        new_password: newPassword,
        user_nickname: nickname,
      })
      if (response.data.updated === true) snackBar(`${t("Stage.success")}${t("Function.edit_account_success")}`);
      else snackBar(`${t("Stage.failed")}${t("Function.edit_account_failed")}`);
    } catch {
      snackBar(`${t("Stage.failed")}${t("User.error")}`);
    } finally {
      setTimeout(async () => {
        setVisible(false);
        setEditing(false);
      }, 2000);
    }
  };

  const inputNickname = (text) => {
    setNickname(text);
    if (user.user_nickname === text) setNicknameCheck(true);
    else setNicknameCheck(false);
  };

  const CheckProcessEmail = async () => {
    try {
      if (emailProcess) return;
      setEmailProcess(true);
      const response = await CheckProcess({ email: email });
      snackBar(`${t("Stage.process")}${t("User.email_number_process")}`);
      if (response) {
        const responseTo = await _axios.post("/auth/send-code", { email: email });
        setEmailCheck(responseTo.data.isSent || false);
        snackBar(`${t("Stage.success")}${t("User.email_number_success")}`);
      }
      setEmailProcess(false);
    } catch {
      setEmailCheck(false);
      snackBar(`${t("Stage.failed")}${t("User.email_number_failed")}`);
      setEmailProcess(false);
    }
  };

  const CheckProcessEmailTo = async () => {
    try {
      if (emailProcessTo) return;
      snackBar(`${t("Stage.process")}${t("User.email_number_check")}`);
      setEmailProcessTo(true);
      const response = await _axios.post("/auth/verify-code", { email: email, code: emailConfirm });
      snackBar(`${t("Stage.success")}${t("User.email_number_check_success")}`);
      setEmailChecks(response.data.isVerified || false);
      setEmailProcessTo(false);
    } catch {
      snackBar(`${t("Stage.failed")}${t("User.email_number_check_failed")}`);
      setEmailChecks(false);
      setEmailProcessTo(false);
    }
  };

  const confirmEmail = () => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const confirmPW = (type) => {
    const regEx = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W])[a-zA-Z0-9\W]{8,}$/.test(
      newPassword
    );
    if (type === true) return regEx && newPassword === subPassword;
    else if (type === false) return regEx;
    return !regEx ? t("User.regular_check_failed") : newPassword === subPassword ? t("User.password_confirm_success") : t("User.password_confirm_failed");
  };

  const inputPW = (text) => {
    setNewPassword(text);
    setSubPassword("");
  };

  const inputEmail = (text) => {
    setEmail(text);
    if (user.email === text) {
      setEmailCheck(true);
      setEmailChecks(true);
    }
    else {
      setEmailCheck(false);
      setEmailChecks(false);
    }
    setEmailConfirm("");
  };

  return (
    <>
      <SnackBar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={() => setSnackbarVisible(false)}
      />
      <Text style={{ fontSize: 25, marginBottom: 5, fontWeight: "bold" }}>
        {t("User.edit")}
      </Text>
      <Input
        title={t("User.email")}
        subTitle={emailCheck && emailChecks ? t("User.email_confirm_success") : t("User.email_confirm_failed")}
        subTitleConfirm={emailCheck && emailChecks}
        content={email}
        onChangeText={(text) => inputEmail(text)}
        buttonDisabled={emailCheck || !confirmEmail(true) || emailProcess}
        buttonOnPress={() => { if (confirmEmail(true)) CheckProcessEmail(); }}
        disabled={editing}
      />
      {
        !(user.email === email) && emailCheck ?
          <Input
            title={t("User.email_number")}
            subTitle={emailCheck && emailChecks ? t("User.email_confirm_success") : t("User.email_confirm_failed")}
            subTitleConfirm={emailCheck && emailChecks}
            content={emailConfirm}
            maxLength={8}
            disabled={emailChecks || editing}
            onChangeText={(text) => setEmailConfirm(text.replace(/[^0-9]/g, ""))}
            buttonDisabled={emailChecks || !confirmEmail(true)}
            buttonOnPress={() => { CheckProcessEmailTo(); }}
          />
          : null
      }
      <Input
        title={t("User.passowrd")}
        placeholder={t("User.password_modify_please")}
        subTitle={confirmPW()}
        subTitleConfirm={confirmPW(true)}
        content={newPassword}
        onChangeText={(text) => inputPW(text)}
        secure={true}
        disabled={editing}
      />
      {confirmPW(false) ?
        <Input
          title={t("User.password_confirm")}
          placeholder={t("User.password_modify_confirm_please")}
          subTitle={confirmPW()}
          subTitleConfirm={confirmPW(true)}
          content={subPassword}
          onChangeText={setSubPassword}
          secure={true}
          disabled={editing}
        />
        : null}
      <Input
        title={t("User.nickname")}
        subTitle={nicknameCheck ? t("User.confirm_please_success") : t("User.confirm_please")}
        subTitleConfirm={nicknameCheck}
        content={nickname}
        onChangeText={(text) => inputNickname(text)}
        buttonDisabled={nicknameCheck || nickname.length <= 0}
        buttonOnPress={() => CheckProcess({ nickname: nickname })}
        disabled={editing}
      />
      <Input
        title={t("User.current_password")}
        content={password}
        onChangeText={(text) => setPassword(text)}
        secure={true}
        disabled={editing}
      />
      <InputProcess
        visible={visible}
        setVisible={setVisible}
        onPress={() => { EditProcess(); }}
        content={t("User.edit_go")}
        cancel={editing}
        disabled={editing}
      />
    </>
  );
}