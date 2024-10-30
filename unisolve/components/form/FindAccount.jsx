import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../../styles/form/FormStyle";
import { mainColor } from "../../constants/Colors";
import SnackBar from "../Snackbar";
import Input from "./Input";
import _axios from "../../api";

export default function FindAccount({ visible, setVisible }) {
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
    if (findSending) return;
    let response;
    setFindSending(true);
    try {
      if (findID.length === 0) {
        response = await _axios.post("/accounts/find_user_id", {
          name: findName,
          email: findEmail,
        });
      } else if (findID.length > 0) {
        response = await _axios.post("/accounts/reset_password_request", {
          user_id: findID,
          username: findName,
          email: findEmail,
        });
      }
      if (response.data.isSent || response.data.foundpw) 
        snackBar("✅ 해당 이메일로 계정 정보가 발송되었습니다!\n일치하지 않을 경우 발송되지 않습니다.");
    } catch {
      snackBar("❌ 계정 정보 찾기에 실패했습니다.\n다시 한번 확인 후 다시 시도해 주세요.");
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
        계정 정보 찾기
      </Text>
      <Text style={{ fontSize: 12, marginBottom: 10 }}>
        비밀번호 찾기는 모든 정보를 입력해야 표시됩니다.
      </Text>
      <Input
        title="이름"
        content={findName}
        onChangeText={setFindName}
        disabled={findSending}
      />
      <Input
        title="이메일"
        content={findEmail}
        onChangeText={setFindEmail}
        disabled={findSending}
      />
      {
        findName && findEmail ?
        <Input
          title="아이디 (비밀번호를 찾을 경우)"
          placeholder="아이디를 입력하세요."
          content={findID}
          onChangeText={setFindID}
          disabled={findSending}
        /> :
        null
      }
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={[styles.buttonSmall,{ backgroundColor: findSending ? "gray" : mainColor }]}
          onPress={() => setVisible(false)}
          disabled={findSending}
        >
          <Text style={styles.buttonTextSmall}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={ findSending || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(findEmail) || !findName }
          style={[styles.buttonSmall, { backgroundColor: findSending || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(findEmail) || !findName ? "gray" : mainColor }]}
          onPress={() => { findAccount(); }}
        >
          <Text style={styles.buttonTextSmall}>
            {findID ? "비밀번호 찾기" : "아이디 찾기"}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}