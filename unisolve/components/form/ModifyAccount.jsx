import { useState } from "react";
import { Text } from "react-native";
import SnackBar from "../Snackbar";
import Input from "./Input";
import InputProcess from "./InputProcess";
import _axios from "../../api";

export default function Modify({ visible, setVisible, userData }) {
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
      snackBar("〽️ 잠시만 기다려주세요...");
      const response = await _axios.post("/accounts/existuser", value);
      snackBar("✅ 확인되었습니다!");
      const result = response.data.isNotExist || false;
      if (!result) snackBar("❌ 잘못 입력했거나 이미 사용 중입니다.");
      if (value.user_id) setReIDCheck(result);
      else if (value.email) return result;
      else if (value.nickname) setNicknameCheck(result);
    } catch {
      snackBar("❌ 문제가 발생했습니다!");
      if (type) return false;
      if (value.email) return false;
      if (value.nickname) setNicknameCheck(false);
    }
  };

  const EditProcess = async () => {
    if (editing || password.length <= 0 || !emailChecks || (newPassword.length > 0 && newPassword !== subPassword) || nickname.length <= 0) {
      snackBar("❌ 일부 정보가 누락되었거나 확인되지 않은 항목이 있습니다.");
      return;
    }
    try {
      setEditing(true);
      snackBar("〽️ 정보를 수정하고 있습니다...");
      const response = await _axios.put("/accounts", {
        current_password: password,
        email: email,
        new_password: newPassword,
        user_nickname: nickname,
      })
      if (response.data.updated === true) snackBar("✅ 계정 정보를 수정했습니다!");
      else snackBar("❌ 계정 정보를 수정하지 못했습니다.");
    } catch {
      snackBar("❌ 문제가 발생했습니다!");
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
      snackBar("〽️ 인증 번호를 발송하고 있습니다...");
      if (response) {
        const responseTo = await _axios.post("/auth/send-code", { email: email });
        setEmailCheck(responseTo.data.isSent || false);
        snackBar("✅ 인증 번호를 발송했습니다!");
      }
      setEmailProcess(false);
    } catch {
      setEmailCheck(false);
      snackBar("❌ 인증 번호를 발송하지 못했습니다.");
      setEmailProcess(false);
    }
  };

  const CheckProcessEmailTo = async () => {
    try {
      if (emailProcessTo) return;
      snackBar("〽️ 인증 번호를 확인하고 있습니다...");
      setEmailProcessTo(true);
      const response = await _axios.post("/auth/verify-code", { email: email, code: emailConfirm });
      snackBar("✅ 인증 번호가 확인되었습니다!");
      setEmailChecks(response.data.isVerified || false);
      setEmailProcessTo(false);
    } catch {
      snackBar("❌ 인증 번호가 잘못 입력되었습니다.");
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
    return !regEx ? "규칙이 잘못됨" : newPassword === subPassword ? "일치함" : "일치하지 않음";
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
        계정 정보 수정
      </Text>
      <Input
        title="이메일"
        subTitle={emailCheck && emailChecks ? "인증 완료" : "인증 필요"}
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
            title="인증번호"
            subTitle={emailCheck && emailChecks ? "인증 완료" : "인증 필요"}
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
        title="비밀번호"
        placeholder="변경할 비밀번호를 입력하세요."
        subTitle={confirmPW()}
        subTitleConfirm={confirmPW(true)}
        content={newPassword}
        onChangeText={(text) => inputPW(text)}
        secure={true}
        disabled={editing}
      />
      {confirmPW(false) ?
        <Input
          title="비밀번호 확인"
          placeholder="변경할 비밀번호를 다시 한번 입력하세요."
          subTitle={confirmPW()}
          subTitleConfirm={confirmPW(true)}
          content={subPassword}
          onChangeText={setSubPassword}
          secure={true}
          disabled={editing}
        />
        : null}
      <Input
        title="닉네임"
        subTitle={nicknameCheck ? "확인 완료" : "중복 확인 필요"}
        subTitleConfirm={nicknameCheck}
        content={nickname}
        onChangeText={(text) => inputNickname(text)}
        buttonDisabled={nicknameCheck || nickname.length <= 0}
        buttonOnPress={() => CheckProcess({ nickname: nickname })}
        disabled={editing}
      />
      <Input
        title="현재 비밀번호"
        content={password}
        onChangeText={(text) => setPassword(text)}
        secure={true}
        disabled={editing}
      />
      <InputProcess
        visible={visible}
        setVisible={setVisible}
        onPress={() => { EditProcess(); }}
        content="수정하기"
        cancel={editing}
        disabled={editing}
      />
    </>
  );
}