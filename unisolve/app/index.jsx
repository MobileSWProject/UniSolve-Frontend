import { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Animated,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Snackbar } from "react-native-paper";
import { mainColor } from "../constants/Colors";
import { useRouter } from "expo-router";
import _axios from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import decodeJWT from "../utils/decodeJWT";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Home() {
  const router = useRouter();
  const [certification, setCertification] = useState(false);
  const [sending, setSending] = useState(false);
  const [checkID, setCheckID] = useState(false);
  const [id, setID] = useState("");
  const [pw, setPW] = useState("");
  const [loginCheck, setLoginCheck] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [findName, setFindName] = useState("");
  const [findEmail, setFindEmail] = useState("");
  const [findID, setFindID] = useState("");
  const [findSending, setFindSending] = useState(false);

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

  const logoPosition = useRef(new Animated.Value(0)).current;
  const inputOpacity = useRef(new Animated.Value(0)).current;
  const pwOpacity = useRef(new Animated.Value(0)).current;
  const pwPosition = useRef(new Animated.Value(30)).current;
  const sendOpacity = useRef(new Animated.Value(0)).current;
  const sendPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const checkCertification = async () => {
      let certification = false;
      try {
        const token = await AsyncStorage.getItem("token");
        const decodedToken = decodeJWT(token);
        certification = decodedToken?.user_id ? true : false;
        setCertification(certification);
      } catch (error) {}
      if (certification) {
        setSnackbarVisible(true);
        setSnackbarMessage(
          "✅ 로그인 정보가 존재합니다!\n메인으로 이동하고 있습니다..."
        );
        const timer = setTimeout(() => {
          router.replace("/home");
        }, 1500);
        return () => clearTimeout(timer);
      } else {
        setSnackbarVisible(true);
        setSnackbarMessage("⚠️ 로그인이 필요합니다!");
        Animated.sequence([
          Animated.timing(logoPosition, {
            toValue: -25,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(inputOpacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start();
      }
    };
    checkCertification();
  }, [router]);

  const CheckProcess = async (value, type) => {
    try {
      const response = await _axios.post("/existuser", value);
      const result = response.data.isNotExist || false;
      if (type) {
        return result === false ? true : false;
      } else {
        if (!result) {
          setSnackbarVisible(true);
          setSnackbarMessage("❌ 잘못 입력했거나 이미 사용 중입니다.");
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
      setSnackbarVisible(true);
      setSnackbarMessage("❌ 문제가 발생했습니다!");
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

  const CheckProcessEmail = async () => {
    try {
      const response = await CheckProcess({ email: reEmail });
      if (response) {
        const responseTo = await _axios.post("/auth/send-code", {
          email: reEmail,
        });
        setReEmailCheck(responseTo.data.isSent || false);
        setSnackbarVisible(true);
        setSnackbarMessage("✅ 인증번호를 발송했습니다!");
      }
    } catch {
      setReEmailCheck(false);
      setSnackbarVisible(true);
      setSnackbarMessage("❌ 인증번호를 발송하지 못했습니다.");
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
      setSnackbarVisible(true);
      setSnackbarMessage("❌ 인증번호가 잘못 입력되었습니다.");
      setReEmailCheckTo(false);
    }
  };

  const handleSend = async () => {
    try {
      if (sending || id.length < 1) return;
      setSending(true);
      Animated.parallel([
        Animated.timing(sendPosition, {
          toValue: 100,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(sendOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
      if (checkID) {
        const response = await _axios.post(
          "/auth/login",
          JSON.stringify({ user_id: id, password: pw })
        );
        const token = response.data.token;
        if (token) {
          await AsyncStorage.setItem("token", token);
          setSnackbarVisible(true);
          setSnackbarMessage(
            "✅ 로그인 되었습니다!\n메인으로 이동하고 있습니다..."
          );
          setLoginCheck(true);
          setTimeout(() => {
            router.replace("/(app)/(tabs)/home");
          }, 1000);
        } else {
          setSnackbarVisible(true);
          setSnackbarMessage("❌ 로그인 정보가 올바르지 않습니다!");
        }
        setSending(false);
      } else {
        const response = await CheckProcess({ user_id: id }, true);
        setCheckID(response);
        setSending(false);
        if (response) {
          Animated.parallel([
            Animated.timing(pwOpacity, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(pwPosition, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ]).start();
        } else {
          setSnackbarVisible(true);
          setSnackbarMessage("❌ 존재하지 않은 계정입니다.");
        }
      }
    } catch {
      setCheckID(false);
      setSending(false);
    } finally {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(sendOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(sendPosition, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      }, 1000);
    }
  };

  const inputID = (text) => {
    setID(text);
    setCheckID(false);
    setPW("");
    if (text.length > 0) {
      if (sendOpacity._value > 0) return;
      Animated.parallel([
        Animated.timing(sendOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      if (sendOpacity._value < 1) return;
      Animated.parallel([
        Animated.timing(sendOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const findAccount = async () => {
    if (findSending) return;
    let response;
    setFindSending(true);
    try {
      if (findID.length === 0) {
        response = await _axios.post("/find_user_id", {
          name: findName,
          email: findEmail,
        });
        setFindSending(false);
      } else if (findID.length > 0) {
        response = await _axios.post("/reset_password_request", {
          user_id: findID,
          username: findName,
          email: findEmail,
        });
        setFindSending(false);
      }
      if (response.data.isSent || response.data.foundpw) {
        setSnackbarVisible(true);
        setSnackbarMessage(
          "✅ 해당 이메일로 계정 정보가 발송되었습니다!\n일치하지 않을 경우 발송되지 않습니다."
        );
      }
    } catch {
      setFindSending(false);
      setSnackbarVisible(true);
      setSnackbarMessage(
        "❌ 계정 정보 찾기에 실패했습니다.\n다시 한번 확인 후 다시 시도해 주세요."
      );
    } finally {
      setModalVisible(false);
      setModalType("");
      setFindName("");
      setFindEmail("");
      setFindID("");
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
        setSnackbarVisible(true);
        setSnackbarMessage(
          "❌ 정보가 누락되었거나 확인되지 않은 항목이 있습니다."
        );
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
      setReProcess(false);
      if (response.data.status === "success") {
        setModalVisible(false);
        setModalType("");
        setReID("");
        setReIDCheck(false);
        setReName("");
        setReEmail("");
        setRePw("");
        setReEmailCheck(false);
        setReEmailCheckTo(false);
        setReEmailTo("");
        setRePwTo("");
        setReNickname("");
        setReNicknameCheck(false);
        setReSchool("");
        setReProcess(false);
        setSnackbarVisible(true);
        setSnackbarMessage(
          "✅ 회원 가입이 완료되었습니다!\n로그인이 필요합니다."
        );
      }
    } catch {
      setSnackbarVisible(true);
      setSnackbarMessage(
        "❌ 회원 가입에 실패했습니다.\n잠시 후 다시 시도해 주세요."
      );
      setReProcess(false);
    }
  };

  return (
    <View style={styles.container}>
      {snackbarVisible ? (
        <View style={styles.snackbarContainer}>
          <Snackbar
            style={styles.snackbar}
            visible={snackbarVisible}
            onDismiss={() => {
              setSnackbarVisible(false);
              setSnackbarMessage("");
            }}
            duration={3000}
          >
            {snackbarMessage}
          </Snackbar>
        </View>
      ) : (
        <></>
      )}
      <Animated.Image
        source={require("../assets/logo.png")}
        style={[styles.logo, { transform: [{ translateY: logoPosition }] }]}
      />
      {certification ? (
        <ActivityIndicator
          size="large"
          color="white"
        />
      ) : (
        <></>
      )}
      <Animated.View
        style={{
          opacity: inputOpacity,
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <TextInput
          style={styles.input}
          placeholder="아이디를 입력하세요."
          placeholderTextColor="#fff"
          value={id}
          onChangeText={(text) => {
            inputID(text);
          }}
          onSubmitEditing={handleSend}
          disabled={loginCheck}
        />
      </Animated.View>
      {checkID ? (
        <Animated.View
          style={{
            opacity: pwOpacity,
            transform: [{ translateY: pwPosition }],
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <TextInput
            style={styles.input}
            placeholder="비밀번호를 입력하세요."
            placeholderTextColor="#fff"
            value={pw}
            onChangeText={setPW}
            secureTextEntry={true}
            onSubmitEditing={handleSend}
            disabled={loginCheck}
          />
        </Animated.View>
      ) : (
        <></>
      )}
      <Animated.View style={{ opacity: inputOpacity, marginTop: 5 }}>
        <TouchableOpacity
          onPress={() => {
            setModalType("find");
            setFindName("");
            setFindEmail("");
            setFindID("");
            setModalVisible(true);
          }}
        >
          <Text style={styles.text}>계정을 잊으셨나요?</Text>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={{ opacity: inputOpacity, marginTop: 15 }}>
        <TouchableOpacity
          onPress={() => {
            setModalType("register");
            setModalVisible(true);
          }}
        >
          <Text style={[styles.text, { fontWeight: "bold" }]}>
            계정이 없다면 계정을 만들어봐요!
          </Text>
        </TouchableOpacity>
      </Animated.View>
      {!certification ? (
        <Animated.View
          style={{
            opacity: sendOpacity,
            transform: [{ translateX: sendPosition }],
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
          >
            <MaterialCommunityIcons
              name="send"
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <></>
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ fontSize: 25, marginBottom: 5, fontWeight: "bold" }}>
              {modalType === "find" ? "계정 정보 찾기" : "회원가입"}
            </Text>
            <Text style={{ fontSize: 12, marginBottom: 10 }}>
              {modalType === "find"
                ? "비밀번호 찾기는 모든 정보를 입력해야 표시됩니다."
                : ""}
            </Text>
            {modalType === "find" ? (
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
                    <Text style={styles.textTo}>
                      아이디 (비밀번호를 찾을 경우)
                    </Text>
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
            ) : (
              <>
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
                    (
                    {reEmailCheck && reEmailCheckTo ? "인증 완료" : "인증 필요"}
                    )
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
                            reEmailCheckTo || !confirmEmail(true)
                              ? "gray"
                              : mainColor,
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
                      onChangeText={(text) =>
                        setReEmailTo(text.replace(/[^0-9]/g, ""))
                      }
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
                          reNicknameCheck || reNickname.length <= 0
                            ? "gray"
                            : mainColor,
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
                  placeholder="소속을 입력하세요."
                  value={reSchool}
                  onChangeText={setReSchool}
                />
              </>
            )}
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={[
                  styles.buttonSmall,
                  { backgroundColor: false ? "gray" : mainColor },
                ]}
                onPress={() => setModalVisible(false)}
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
                  modalType === "find" ? findAccount() : registerProcess();
                }}
              >
                <Text style={styles.buttonTextSmall}>
                  {modalType === "find"
                    ? findID
                      ? "비밀번호 찾기"
                      : "아이디 찾기"
                    : "회원가입"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
