import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { styles } from "../../styles/form/FormStyle";
import { styles as FlatStyles } from "../../styles/tabs/List/ListStyles";
import { accountCheck } from "../../utils/accountCheck";
import SnackBar from "../Snackbar";
import Input from "./Input";
import InputProcess from "./InputProcess";
import _axios from "../../api";
import { useTranslation } from "react-i18next";
import "../../i18n";

export default function Register({ visible, setVisible }) {
  const { t } = useTranslation();
  const [effect, setEffect] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [schoolData, setSchoolData] = useState([]);
  const [reID, setReID] = useState("");
  const [reIDCheck, setReIDCheck] = useState(false);
  const [reName, setReName] = useState("");
  const [reEmail, setReEmail] = useState("");
  const [rePw, setRePw] = useState("");
  const [reEmailCheck, setReEmailCheck] = useState(false);
  const [reEmailCheckTo, setReEmailCheckTo] = useState(false);
  const [reEmailTo, setReEmailTo] = useState("");
  const [rePwTo, setRePwTo] = useState("");
  const [reNickname, setReNickname] = useState("");
  const [reNicknameCheck, setReNicknameCheck] = useState(false);
  const [reSchool, setReSchool] = useState("");
  const [reProcess, setReProcess] = useState(false);
  const [reEmailProcess, setReEmailProcess] = useState(false);

  useEffect(() => {
    if (!effect) {
      getSchool();
      setEffect(true);
    }
  });

  const snackBar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const CheckProcessEmail = async () => {
    try {
      if (reEmailProcess) return;
      setReEmailProcess(true);
      const response = await accountCheck({ email: reEmail }, snackBar, t);
      if (response) {
        snackBar(`${t("Stage.process")}${t("User.email_number_process")}`);
        const responseTo = await _axios.post("/auth/send-code", { email: reEmail });
        setReEmailCheck(responseTo.data.isSent || false);
        setReEmailProcess(false);
        snackBar(`${t("Stage.success")}${t("User.email_number_success")}`);
      }
    } catch {
      setReEmailCheck(false);
      setReEmailProcess(false);
      snackBar(`${t("Stage.failed")}${t("User.email_number_failed")}`);
    }
  };

  const CheckProcessEmailTo = async () => {
    try {
      snackBar(`${t("Stage.process")}${t("User.email_number_check")}`);
      const response = await _axios.post("/auth/verify-code", { email: reEmail, code: reEmailTo });
      setReEmailCheckTo(response.data.isVerified || false);
    } catch {
      snackBar(`${t("Stage.failed")}${t("User.email_number_check_failed")}`);
      setReEmailCheckTo(false);
    }
  };

  const inputPW = (text) => {
    setRePw(text);
    setRePwTo("");
  };

  const confirmID = (type) => {
    const regEx = /^(?=.*[a-z])(?=.*[0-9])[a-z0-9]{4,}$/.test(reID);
    if (type === true) return regEx;
    return !regEx ?
      t("User.regular_check_failed") :
        reIDCheck ?
        t("User.confirm_please_success") :
        t("User.confirm_please");
  };

  const confirmPW = (type) => {
    const regEx = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W])[a-zA-Z0-9\W]{8,}$/.test(rePw);
    if (type === true) {
      return regEx && rePw === rePwTo;
    } else if (type === false) {
      return regEx;
    } else {
    return !regEx ?
      t("User.regular_check_failed") :
        rePw === rePwTo ?
        t("User.password_confirm_success") :
        t("User.password_confirm_failed");
    }
  };

  const confirmEmail = () => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(reEmail);
  };

  const inputReID = (text) => {
    setReID(text);
    setReIDCheck(false);
  };

  const inputReNickname = (text) => {
    setReNickname(text);
    setReNicknameCheck(false);
  };

  const inputEmail = (text) => {
    setReEmail(text);
    setReEmailTo("");
    setReEmailCheck(false);
    setReEmailCheckTo(false);
  };

  const registerProcess = async () => {
    if (reProcess) return;
    try {
      if (reID.length <= 0 || !reIDCheck || !confirmID(true) || reName.length <= 0 || reEmail.length <= 0 || !reEmailCheck || !reEmailCheckTo || !confirmPW(true) || rePw !== rePwTo || reNickname.length <= 0) {
        snackBar(`${t("Stage.failed")}${t("User.empty_content")}`);
        return;
      }
      setReProcess(true);
      snackBar(`${t("Stage.process")}${t("User.regist_process")}`);
      const response = await _axios.post("/auth/register", { user_id: reID, username: reName, email: reEmail, password: rePw, user_nickname: reNickname,school: reSchool });
      if (response.data.status === "success") {
        snackBar(`${t("Stage.success")}${t("User.regist_success")}`);
        setTimeout(() => { setVisible(false); setReProcess(false); }, 2000);
      }
    } catch {
      snackBar(`${t("Stage.failed")}${t("User.regist_failed")}`);
      setReProcess(false);
    }
  };

  const getSchool = () => {
    _axios.get("/universities").then((response) => { setSchoolData(response.data.universities); }); 
  };

  const searchSchool = () => {
    return schoolData && reSchool ?
      schoolData.filter((item) => item.univ_name.includes(reSchool)) :
      [];
  };

  return (
    <>
      <Text style={{ fontSize: 25, marginBottom: 5, fontWeight: "bold" }}>{t("User.regist")}</Text>
      <Input
        title={t("User.regist")}
        subTitle={confirmID()}
        subTitleConfirm={reIDCheck}
        content={reID}
        onChangeText={(text) => inputReID(text)}
        buttonDisabled={reIDCheck || !confirmID(true)}
        buttonOnPress={async () => { if (confirmID(true)) { setReIDCheck(await accountCheck({ user_id: reID }, snackBar, t)); }}}
      />
      <Input
        title={t("User.name")}
        content={reName}
        onChangeText={setReName}
      />
      <Input
        title={t("User.email")}
        subTitle=
        {
          reEmailCheck && reEmailCheckTo ?
          t("User.email_confirm_success") :
          t("User.email_confirm_failed")
        }
        subTitleConfirm={reEmailCheck && reEmailCheckTo}
        content={reEmail}
        onChangeText={(text) => inputEmail(text)}
        buttonDisabled={reEmailCheck || !confirmEmail()}
        buttonOnPress={() => { if (confirmEmail()) CheckProcessEmail(); }}
      />
      {
      reEmailCheck ?
        <Input
          title={t("User.email_number")}
          subTitle=
          {
            reEmailCheck && reEmailCheckTo ?
            t("User.email_confirm_success") :
            t("User.email_confirm_failed")
          }
          subTitleConfirm={reEmailCheck && reEmailCheckTo}
          content={reEmailTo}
          disabled={reEmailCheckTo}
          maxLength={8}
          onChangeText={(text) => setReEmailTo(text.replace(/[^0-9]/g, ""))}
          buttonDisabled={reEmailCheckTo || !confirmEmail(true)}
          buttonOnPress={() => { CheckProcessEmailTo(); }}
        /> :
        null
      }
      <Input
        title={t("User.password")}
        subTitle={confirmPW()}
        subTitleConfirm={confirmPW(true)}
        content={rePw}
        onChangeText={(text) => inputPW(text)}
        secure={true}
      />
      {
      confirmPW(false) ?
        <Input
          title={t("User.password_confirm")}
          placeholder={t("User.password_confirm_please")}
          subTitle={confirmPW()}
          subTitleConfirm={confirmPW(true)}
          content={rePwTo}
          onChangeText={setRePwTo}
          secure={true}
        /> :
        null
      }
      <Input
        title={t("User.nickname")}
        subTitle=
        {
          reNicknameCheck ?
          t("User.confirm_please_success") :
          t("User.confirm_please")
        }
        subTitleConfirm={reNicknameCheck}
        content={reNickname}
        onChangeText={(text) => inputReNickname(text)}
        buttonDisabled={reNicknameCheck || reNickname.length <= 0}
        buttonOnPress={async () => setReNicknameCheck( await accountCheck({ nickname: reNickname }, snackBar))}
      />
      <Input
        title={t("User.school")}
        placeholder={t("User.school_confirm")}
        content={reSchool}
        onChangeText={(text) => setReSchool(text)}
      />
      {
        searchSchool().length > 0 ?
        <View style={FlatStyles.flatList}>
          <FlatList
            style={{ margin: 5, marginRight: 0 }}
            data={searchSchool()}
            keyExtractor={(item) => item.univ_id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setReSchool(item.univ_name)}>
                <Text style={styles.item}>{item.univ_name}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.empty}></Text>}
          />
        </View> :
        null
      }
      <InputProcess
        visible={visible}
        setVisible={setVisible}
        onPress={() => { registerProcess(); }}
        content={t("User.regist")}
        cancel={reProcess}
        disabled={reProcess}
      />
      <SnackBar visible={snackbarVisible} message={snackbarMessage} onDismiss={() => setSnackbarVisible(false)} />
    </>
  );
}
