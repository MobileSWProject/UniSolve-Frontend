import { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { mainColor } from "../../constants/Colors";
import SnackBar from "../Snackbar";
import _axios from "../../api";

export default function FindAccount({ visible, setVisible }) {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [sending, setSending] = useState(false);

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
        setFindSending(false);
      } else if (findID.length > 0) {
        response = await _axios.post("/accounts/reset_password_request", {
          user_id: findID,
          username: findName,
          email: findEmail,
        });
        setFindSending(false);
      }
      if (response.data.isSent || response.data.foundpw) {
        snackBar(
          "✅ 해당 이메일로 계정 정보가 발송되었습니다!\n일치하지 않을 경우 발송되지 않습니다."
        );
      }
    } catch {
      setFindSending(false);
      snackBar(
        "❌ 계정 정보 찾기에 실패했습니다.\n다시 한번 확인 후 다시 시도해 주세요."
      );
    } finally {
      setVisible(false);
      setFindName("");
      setFindEmail("");
      setFindID("");
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
      <>
        <Text style={styles.textTo}>이름</Text>
        <TextInput
          style={styles.inputTo}
          placeholder="이름을 입력하세요."
          value={findName}
          onChangeText={setFindName}
        />
        <Text style={styles.textTo}>이메일</Text>
        <TextInput
          style={styles.inputTo}
          placeholder="이메일을 입력하세요."
          value={findEmail}
          onChangeText={setFindEmail}
        />
        {findName && findEmail ? (
          <>
            <Text style={styles.textTo}>아이디 (비밀번호를 찾을 경우)</Text>
            <TextInput
              style={styles.inputTo}
              placeholder="아이디를 입력하세요."
              value={findID}
              onChangeText={setFindID}
            />
          </>
        ) : (
          <></>
        )}
      </>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={[
            styles.buttonSmall,
            { backgroundColor: false ? "gray" : mainColor },
          ]}
          onPress={() => setVisible(false)}
        >
          <Text style={styles.buttonTextSmall}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={sending || findSending}
          style={[
            styles.buttonSmall,
            { backgroundColor: false ? "gray" : mainColor },
          ]}
          onPress={() => {
            findAccount();
          }}
        >
          <Text style={styles.buttonTextSmall}>
            {findID ? "비밀번호 찾기" : "아이디 찾기"}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: mainColor,
  },
  logo: {
    width: 250,
    height: 250,
  },
  input: {
    width: 250,
    height: 40,
    borderColor: "#fff",
    borderWidth: 3,
    borderRadius: 15,
    paddingHorizontal: 10,
    color: "#fff",
  },
  inputTo: {
    width: "100%",
    height: 40,
    borderColor: "#fff",
    borderWidth: 3,
    borderRadius: 15,
    paddingHorizontal: 10,
    color: "#fff",
    borderColor: "#000",
    color: "#000",
    marginTop: 5,
  },
  text: {
    fontSize: 12,
    color: "#fff",
  },
  textTo: {
    fontSize: 15,
    marginLeft: 20,
    marginBottom: -5,
    marginTop: 20,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  flatList: {
    width: "93%",
    maxHeight: 100,
    borderWidth: 3,
    borderColor: "black",
    borderTopWidth: 0,
  },
  sendButton: {
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: 350,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonSmall: {
    paddingHorizontal: 16,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    marginTop: 15,
    margin: 2,
  },
  buttonTextSmall: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  snackbarContainer: {
    position: "absolute",
    zIndex: 999,
    top: "10%",
    width: "20%",
  },
  snackbar: {
    borderRadius: 15,
  },
});
