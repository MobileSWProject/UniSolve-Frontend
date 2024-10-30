import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { mainColor } from "../../constants/Colors";
import _axios from "../../api";
import SnackBar from "../Snackbar";

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

  useEffect(() => {
    if (!effect) {
      getSchool();
      setEffect(true);
    }
  });

  const CheckProcess = async (value, type) => {
    try {
      const response = await _axios.post("/accounts/existuser", value);
      const result = response.data.isNotExist || false;
      if (type) {
        return result === false ? true : false;
      } else {
        if (!result) {
          snackBar("❌ 잘못 입력했거나 이미 사용 중입니다.");
        }
        if (value.user_id) {
          setReIDCheck(result);
        } else if (value.email) {
          return result;
        } else if (value.nickname) {
          setReNicknameCheck(result);
        }
      }
    } catch {
      snackBar("❌ 문제가 발생했습니다!");
      if (type) {
        return false;
      }
      if (value.user_id) {
        setReIDCheck(false);
      }
      if (value.email) {
        return false;
      }
      if (value.nickname) {
        setReNicknameCheck(false);
      }
    }
  };

  const snackBar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const CheckProcessEmail = async () => {
    try {
      const response = await CheckProcess({ email: reEmail });
      if (response) {
        const responseTo = await _axios.post("/auth/send-code", {
          email: reEmail,
        });
        setReEmailCheck(responseTo.data.isSent || false);

        snackBar("✅ 인증번호를 발송했습니다!");
      }
    } catch {
      setReEmailCheck(false);

      snackBar("❌ 인증번호를 발송하지 못했습니다.");
    }
  };

  const CheckProcessEmailTo = async () => {
    try {
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
    return !regEx
      ? "규칙이 잘못됨"
      : reIDCheck
      ? "확인 완료"
      : "중복 확인 필요";
  };

  const confirmPW = (type) => {
    const regEx = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W])[a-zA-Z0-9\W]{8,}$/.test(
      rePw
    );
    if (type === true) return regEx && rePw === rePwTo;
    else if (type === false) return regEx;
    return !regEx
      ? "규칙이 잘못됨"
      : rePw === rePwTo
      ? "일치함"
      : "일치하지 않음";
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
        }, 1000);
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
    return schoolData && reSchool
      ? schoolData.filter((item) => item.univ_name.includes(reSchool))
      : [];
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
      <Text style={styles.textTo}>
        아이디
        <Text
          style={[
            styles.textTo,
            { fontSize: 12, color: reIDCheck ? "blue" : "red" },
          ]}
        >
          ({confirmID()})
        </Text>
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TextInput
          style={[styles.inputTo, { flex: 1, marginRight: 1 }]}
          placeholder="사용할 아이디를 입력하세요."
          value={reID}
          onChangeText={(text) => inputReID(text)}
        />
        <TouchableOpacity
          disabled={reIDCheck || !confirmID(true)}
          style={[
            styles.buttonSmall,
            {
              backgroundColor:
                reIDCheck || !confirmID(true) ? "gray" : mainColor,
            },
          ]}
          onPress={() => {
            if (confirmID(true)) CheckProcess({ user_id: reID });
          }}
        >
          <Text style={styles.buttonTextSmall}>확인</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.textTo}>이름</Text>
      <TextInput
        style={styles.inputTo}
        placeholder="이름을 입력하세요."
        value={reName}
        onChangeText={setReName}
      />
      <Text style={styles.textTo}>
        이메일
        <Text
          style={[
            styles.textTo,
            {
              fontSize: 12,
              color: reEmailCheck && reEmailCheckTo ? "blue" : "red",
            },
          ]}
        >
          ({reEmailCheck && reEmailCheckTo ? "인증 완료" : "인증 필요"})
        </Text>
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: reEmailCheck ? "100%" : "",
        }}
      >
        <TextInput
          style={styles.inputTo}
          placeholder="이메일을 입력하세요."
          value={reEmail}
          onChangeText={(text) => inputEmail(text)}
        />
        {!reEmailCheck ? (
          <TouchableOpacity
            disabled={reEmailCheck || !confirmEmail(true)}
            style={[
              styles.buttonSmall,
              {
                backgroundColor:
                  reEmailCheckTo || !confirmEmail(true) ? "gray" : mainColor,
              },
            ]}
            onPress={() => {
              if (confirmEmail(true)) CheckProcessEmail();
            }}
          >
            <Text style={styles.buttonTextSmall}>확인</Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
      {reEmailCheck ? (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            style={styles.inputTo}
            placeholder="인증번호를 입력하세요."
            value={reEmailTo}
            maxLength={8}
            disabled={reEmailCheckTo}
            onChangeText={(text) => setReEmailTo(text.replace(/[^0-9]/g, ""))}
          />
          <TouchableOpacity
            disabled={reEmailCheckTo || !confirmEmail(true)}
            style={[
              styles.buttonSmall,
              {
                backgroundColor: reEmailCheckTo ? "gray" : mainColor,
              },
            ]}
            onPress={() => {
              CheckProcessEmailTo();
            }}
          >
            <Text style={styles.buttonTextSmall}>확인</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <></>
      )}
      <Text style={styles.textTo}>
        비밀번호
        <Text
          style={[
            styles.textTo,
            { fontSize: 12, color: confirmPW(true) ? "blue" : "red" },
          ]}
        >
          ({confirmPW()})
        </Text>
      </Text>
      <TextInput
        style={styles.inputTo}
        placeholder="사용할 비밀번호를 입력하세요."
        value={rePw}
        onChangeText={(text) => inputPW(text)}
        secureTextEntry={true}
      />
      {confirmPW(false) ? (
        <>
          <Text style={styles.textTo}>
            비밀번호 확인
            <Text
              style={[
                styles.textTo,
                {
                  fontSize: 12,
                  color: confirmPW(true) ? "blue" : "red",
                },
              ]}
            >
              ({confirmPW()})
            </Text>
          </Text>
          <TextInput
            style={styles.inputTo}
            placeholder="비밀번호를 다시 한번 입력하세요."
            value={rePwTo}
            onChangeText={setRePwTo}
            secureTextEntry={true}
          />
        </>
      ) : (
        <></>
      )}
      <Text style={styles.textTo}>
        닉네임
        <Text
          style={[
            styles.textTo,
            { fontSize: 12, color: reNicknameCheck ? "blue" : "red" },
          ]}
        >
          ({reNicknameCheck ? "확인 완료" : "중복 확인 필요"})
        </Text>
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          style={[styles.inputTo, { flex: 1, marginRight: 1 }]}
          placeholder="닉네임을 입력하세요."
          value={reNickname}
          onChangeText={(text) => inputReNickname(text)}
        />
        <TouchableOpacity
          disabled={reNicknameCheck || reNickname.length <= 0}
          style={[
            styles.buttonSmall,
            {
              backgroundColor:
                reNicknameCheck || reNickname.length <= 0 ? "gray" : mainColor,
            },
          ]}
          onPress={() => CheckProcess({ nickname: reNickname })}
        >
          <Text style={styles.buttonTextSmall}>확인</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.textTo}>소속</Text>
      <TextInput
        style={styles.inputTo}
        placeholder="본인의 소속을 입력 후 선택하세요."
        value={reSchool}
        onChangeText={(text) => setReSchool(text)}
      />
      {searchSchool().length > 0 ? (
        <View style={styles.flatList}>
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
        </View>
      ) : (
        <></>
      )}
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
          disabled={reProcess}
          style={[
            styles.buttonSmall,
            { backgroundColor: reProcess ? "gray" : mainColor },
          ]}
          onPress={() => {
            registerProcess();
          }}
        >
          <Text style={styles.buttonTextSmall}>회원가입</Text>
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
});
