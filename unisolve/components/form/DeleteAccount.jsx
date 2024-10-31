import { useState } from "react";
import { useRouter } from "expo-router";
import { Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SnackBar from "../Snackbar";
import Input from "./Input";
import InputProcess from "./InputProcess";
import _axios from "../../api";

export default function Delete({ visible, setVisible }) {
  const router = useRouter();

  const [deleting, setDeleting] = useState(false);
  const [password, setPassword] = useState("");

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const snackBar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const DeletedProcess = async () => {
    try {
      if (deleting || !password) {
        snackBar("❌ 일부 정보가 누락되었거나 확인되지 않은 항목이 있습니다.");
        return;
      }  
      setDeleting(true);
      snackBar("〽️ 계정 탈퇴 처리 중입니다...");
      const response = await _axios.delete("/accounts", { data: { password } })
      if (response.data.deleted === true) {
        snackBar("✅ 회원 계정 탈퇴 처리가 완료되었습니다!");
        setTimeout(async () => {
          setVisible(false);
          await AsyncStorage.clear();
          router.replace("/");
          return;
        }, 2000);
      }
    } catch {
      snackBar("❌ 회원 계정 탈퇴에 실패하였습니다.");
      setTimeout(async () => {
        setDeleting(false);
        setVisible(false);
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
        회원 계정 탈퇴
      </Text>
      <Text style={{ textAlign: "center", color: "#ff0000", fontWeight: "bold" }}>
        정말로 해당 계정을 탈퇴 처리하시겠습니까?{"\n"}이 작업은 되돌릴 수 없습니다.
      </Text>
      <Input
        title="현재 비밀번호"
        content={password}
        onChangeText={(text) => setPassword(text)}
        secure={true}
      />
      <InputProcess
        visible={visible}
        setVisible={setVisible}
        onPress={() => { DeletedProcess(); }}
        type="delete"
        content="탈퇴하기"
        cancel={deleting}
        disabled={deleting}
      />
    </>
  );
}