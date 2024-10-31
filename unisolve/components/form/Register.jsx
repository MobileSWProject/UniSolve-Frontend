import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { styles } from "../../styles/form/FormStyle"
import { styles as FlatStyles } from "../../styles/tabs/List/ListStyles";
import SnackBar from "../Snackbar";
import Input from "./Input";
import InputProcess from "./InputProcess";
import _axios from "../../api";

export default function Register({ visible, setVisible }) {
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

  const CheckProcess = async (value, type) => {
    try {
      snackBar("〽️ 잠시만 기다려주세요...");
      const response = await _axios.post("/accounts/existuser", value);
      const result = response.data.isNotExist || false;
      if (type) return result === false ? true : false;
      else {
        if (!result) snackBar("❌ 잘못 입력했거나 이미 사용 중입니다.");
        if (value.user_id) setReIDCheck(result);
        else if (value.email) return result;
        else if (value.nickname) setReNicknameCheck(result);
      }
    } catch {
      snackBar("❌ 문제가 발생했습니다!");
      if (type) return false;
      if (value.user_id) setReIDCheck(false);
      if (value.email) return false;
      if (value.nickname) setReNicknameCheck(false);
    }
  };

  const snackBar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const CheckProcessEmail = async () => {
    try {
      if (reEmailProcess) return;
      setReEmailProcess(true);
      const response = await CheckProcess({ email: reEmail });
      if (response) {
        snackBar("〽️ 인증번호를 발송하고 있습니다...");
        const responseTo = await _axios.post("/auth/send-code", {
          email: reEmail,
        });
        setReEmailCheck(responseTo.data.isSent || false);
        setReEmailProcess(false);
        snackBar("✅ 인증번호를 발송했습니다!");
      }
    } catch {
      setReEmailCheck(false);
      setReEmailProcess(false);
      snackBar("❌ 인증번호를 발송하지 못했습니다.");
    }
  };

  const CheckProcessEmailTo = async () => {
    try {
      snackBar("〽️ 인증번호를 확인하고 있습니다...");
      const response = await _axios.post("/auth/verify-code", {
        email: reEmail,
        code: reEmailTo,
      });
      setReEmailCheckTo(response.data.isVerified || false);
    } catch {
      snackBar("❌ 인증번호가 잘못 입력되었습니다.");
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
    return !regEx ? "규칙이 잘못됨" : reIDCheck ? "확인 완료" : "중복 확인 필요" };

  const confirmPW = (type) => {
    const regEx = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W])[a-zA-Z0-9\W]{8,}$/.test(rePw);
    if (type === true) return regEx && rePw === rePwTo;
    else if (type === false) return regEx;
    return !regEx ? "규칙이 잘못됨" : rePw === rePwTo ? "일치함" : "일치하지 않음";
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
      if (
        reID.length <= 0 ||
        !reIDCheck ||
        !confirmID(true) ||
        reName.length <= 0 ||
        reEmail.length <= 0 ||
        !reEmailCheck ||
        !reEmailCheckTo ||
        !confirmPW(true) ||
        rePw !== rePwTo ||
        reNickname.length <= 0
      ) {
        snackBar("❌ 정보가 누락되었거나 확인되지 않은 항목이 있습니다.");
        return;
      }
      setReProcess(true);
      snackBar("〽️ 회원 가입 처리 중입니다...");
      const response = await _axios.post("/auth/register", {
        user_id: reID,
        username: reName,
        email: reEmail,
        password: rePw,
        user_nickname: reNickname,
        school: reSchool,
      });
      if (response.data.status === "success") {
        snackBar("✅ 회원 가입이 완료되었습니다!\n로그인이 필요합니다.");
        setTimeout(() => {
          setVisible(false);
          setReProcess(false);
        }, 2000);
      }
    } catch {
      snackBar("❌ 회원 가입에 실패했습니다.\n잠시 후 다시 시도해 주세요.");
      setReProcess(false);
    }
  };

  const getSchool = () => {
    _axios.get("/universities").then((response) => {
      setSchoolData(response.data.universities);
    });
  };

  const searchSchool = () => {
    return schoolData && reSchool ? schoolData.filter((item) => item.univ_name.includes(reSchool)) : [];
  };

  return (
    <>
      <SnackBar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={() => setSnackbarVisible(false)}
      />
      <Text style={{ fontSize: 25, marginBottom: 5, fontWeight: "bold" }}>
        회원가입
      </Text>
      <Input
        title="아이디"
        subTitle={confirmID()}
        subTitleConfirm={reIDCheck}
        content={reID}
        onChangeText={(text) => inputReID(text)}
        buttonDisabled={reIDCheck || !confirmID(true)}
        buttonOnPress={() => { if (confirmID(true)) CheckProcess({ user_id: reID }); }}
      />
      <Input 
        title="이름"
        content={reName}
        onChangeText={setReName}
      />
      <Input
        title="이메일"
        subTitle={reEmailCheck && reEmailCheckTo ? "인증 완료" : "인증 필요"}
        subTitleConfirm={reEmailCheck && reEmailCheckTo}
        content={reEmail}
        onChangeText={(text) => inputEmail(text)}
        buttonDisabled={reEmailCheck || !confirmEmail()}
        buttonOnPress={() => { if (confirmEmail()) CheckProcessEmail(); }}
      />
      {
        reEmailCheck ?
        <Input
          title="인증번호"
          subTitle={reEmailCheck && reEmailCheckTo ? "인증 완료" : "인증 필요"}
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
        title="비밀번호"
        subTitle={confirmPW()}
        subTitleConfirm={confirmPW(true)}
        content={rePw}
        onChangeText={(text) => inputPW(text)}
        secure={true}
      />
      {
        confirmPW(false) ?
        <Input
          title="비밀번호 확인"
          placeholder="비밀번호를 다시 한번 입력하세요."
          subTitle={confirmPW()}
          subTitleConfirm={confirmPW(true)}
          content={rePwTo}
          onChangeText={setRePwTo}
          secure={true}
        /> :
        null
      }
      <Input
        title="닉네임"
        subTitle={reNicknameCheck ? "확인 완료" : "중복 확인 필요"}
        subTitleConfirm={reNicknameCheck}
        content={reNickname}
        onChangeText={(text) => inputReNickname(text)}
        buttonDisabled={reNicknameCheck || reNickname.length <= 0}
        buttonOnPress={() => CheckProcess({ nickname: reNickname })}
      />
      <Input
        title="소속"
        placeholder="본인의 소속을 입력 후 선택하세요."
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
        content="회원가입"
        cancel={reProcess}
        disabled={reProcess}
      />
    </>
  );
}