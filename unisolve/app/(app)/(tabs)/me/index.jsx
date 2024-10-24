import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Snackbar } from "react-native-paper";
import { useFocusEffect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mainColor } from "../../../../constants/Colors";
import { ProgressBar } from "react-native-paper";
import { getExpToLevel, getPercent, getLevel } from "../../../../components/tabs/home/index";
import _axios from "../../../../api";

export default function MePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [emailCheck, setEmailCheck] = useState(false);
  const [emailChecks, setEmailChecks] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [subPassword, setSubPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [nicknameCheck, setNicknameCheck] = useState("");

  const [exp, setExp] = useState("");

  useFocusEffect(
    useCallback(() => {
      _axios
        .get("/accounts/mine")
        .then((response) => {
          setUser(response.data.data);
          setEmail(response.data.data.email);
          setEmailCheck(true);
          setEmailChecks(true);
          setNicknameCheck(true);
          setNickname(response.data.data.user_nickname);
          setExp(response.data.data.exp || 0);
        })
        .catch((error) => {
          router.replace("/");
        });
    }, [])
  );

  const CheckProcess = async (value) => {
    try {
      const response = await _axios.post("/accounts/existuser", value);
      const result = response.data.isNotExist || false;
      if (!result) {
        setSnackbarVisible(true);
        setSnackbarMessage("❌ 잘못 입력했거나 이미 사용 중입니다.");
      }
      if (value.user_id) {
        setReIDCheck(result);
      } else if (value.email) {
        return result;
      } else if (value.nickname) {
        setNicknameCheck(result);
      }
    } catch {
      setSnackbarVisible(true);
      setSnackbarMessage("❌ 문제가 발생했습니다!");
      if (type) {
        return false;
      }
      if (value.email) {
        return false;
      }
      if (value.nickname) {
        setNicknameCheck(false);
      }
    }
  };

  const DeletedProcess = async () => {
    if (deleting || !password || password.length < 8) return;
    setDeleting(true);
    await _axios
      .delete("/accounts", { password })
      .then(async (response) => {
        setDeleting(false);
        if (response.data.deleted === true) {
          setModalVisible(false);
          setSnackbarVisible(true);
          setSnackbarMessage("✅ 회원 탈퇴가 완료되었습니다!");
          await AsyncStorage.clear();
          router.replace("/");
          return;
        }
      })
      .catch(() => {
        setDeleting(false);
        setModalVisible(false);
        setModalType("");
        setSnackbarVisible(true);
        setSnackbarMessage("❌ 회원 탈퇴에 실패하였습니다.");
      });
  };

  if (!user) {
    return <></>;
  }

  const EditProcess = async () => {
    if (editing || password.length <= 0 || !emailChecks || (newPassword.length > 0 && newPassword !== subPassword) || nickname.length <= 0) return;
    setEditing(true);
    await _axios
      .put("/accounts", {
        current_password: password,
        email: email,
        new_password: newPassword,
        user_nickname: nickname,
      })
      .then(async (response) => {
        setEditing(false);
        if (response.data.updated === true) {
          setPassword("");
          setNewPassword("");
          setSubPassword("");
          _axios.get("/accounts/mine").then((response) => {
            setUser(response.data.data);
            setEmail(response.data.data.email);
            setEmailChecks(true);
            setNicknameCheck(true);
            setNickname(response.data.data.user_nickname);
          });
          setSnackbarVisible(true);
          setSnackbarMessage("✅ 정보 수정이 완료되었습니다!");
          setModalVisible(false);
          setModalType("");
        }
      })
      .catch(() => {
        setEditing(false);
        setSnackbarVisible(true);
        setSnackbarMessage("❌ 문제가 발생했습니다!");
      });
  };

  const inputNickname = (text) => {
    setNickname(text);
    if (user.user_nickname === text) setNicknameCheck(true);
    else setNicknameCheck(false);
  };

  const CheckProcessEmail = async () => {
    try {
      const response = await CheckProcess({ email: email });
      console.log(response)
      if (response) {
        const responseTo = await _axios.post("/auth/send-code", {
          email: email,
        });
        setEmailCheck(responseTo.data.isSent || false);
        setSnackbarVisible(true);
        setSnackbarMessage("✅ 인증번호를 발송했습니다!");
      }
    } catch {
      setEmailCheck(false);
      setSnackbarVisible(true);
      setSnackbarMessage("❌ 인증번호를 발송하지 못했습니다.");
    }
  };

  const CheckProcessEmailTo = async () => {
    try {
      const response = await _axios.post("/auth/verify-code", {
        email: email,
        code: emailConfirm,
      });
      setEmailChecks(response.data.isVerified || false);
    } catch {
      setSnackbarVisible(true);
      setSnackbarMessage("❌ 인증번호가 잘못 입력되었습니다.");
      setEmailChecks(false);
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
    return !regEx
      ? "규칙이 잘못됨"
      : newPassword === subPassword
        ? "일치함"
        : "일치하지 않음";
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
      {/* 프로필 이미지 */}
      <View style={styles.profileContainer}>
        <Image
          source={`../../../../assets/icons/lv${getLevel(exp)}.png`}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.nickname}>
            {user.username} | {user.user_nickname}
          </Text>
          <Text style={styles.phoneNumber}>
            {user.school || "소속이 없습니다."}
          </Text>
          <Text style={[styles.phoneNumber, { marginBottom: 15, fontSize: 18, fontWeight: "bold", color: "#fff" }]}>
            {getExpToLevel(getLevel(exp))}
          </Text>
          <View style={styles.experienceContainer}>
            {getPercent(exp) < 100 ?
              <Text style={[styles.experienceText, { color: getPercent(exp) <= 33 ? mainColor : "#000" }]}>{getPercent(exp)}%</Text> :
              <></>}
            <ProgressBar
              styleAttr="Horizontal"
              indeterminate={false}
              progress={getPercent(exp) / 100}
              color={mainColor}
              style={styles.progressBar}
            />
          </View>
        </View>
      </View>

      <Text style={[styles.buttonText, { fontWeight: "bold", marginTop: 20 }]}>계정</Text>
      <TouchableOpacity
        onPress={() => {
          setModalType("edit");
          setModalVisible(true);
        }}
      >
        <Text style={styles.buttonText}>정보 수정</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { }}>
        <Text style={styles.buttonText}>이용 제한 내역</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { () => { router.replace("/history") } }}>
        <Text style={styles.buttonText}>히스토리</Text>
      </TouchableOpacity>
      <Text style={[styles.buttonText, { fontWeight: "bold", marginTop: 20 }]}>앱 설정</Text>
      <TouchableOpacity onPress={() => { }}>
        <Text style={styles.buttonText}>다크 모드</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { }}>
        <Text style={styles.buttonText}>언어 변경</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { }}>
        <Text style={styles.buttonText}>알림 설정</Text>
      </TouchableOpacity>
      <Text style={[styles.buttonText, { fontWeight: "bold", marginTop: 20 }]}>이용 관련</Text>
      <TouchableOpacity onPress={() => { }}>
        <Text style={styles.buttonText}>앱 버전</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { }}>
        <Text style={styles.buttonText}>고객지원</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { }}>
        <Text style={styles.buttonText}>공지사항</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { }}>
        <Text style={styles.buttonText}>서비스 이용약관</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { }}>
        <Text style={styles.buttonText}>개인정보 처리방침</Text>
      </TouchableOpacity>
      <Text style={[styles.buttonText, { fontWeight: "bold", marginTop: 20 }]}>기타</Text>
      <TouchableOpacity onPress={() => {
        setModalType("delete");
        setModalVisible(true)
      }}>
        <Text style={styles.buttonText}>회원 계정 탈퇴</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={async () => {
        await AsyncStorage.removeItem("token");
        router.replace("/");
      }}>
        <Text style={styles.buttonText}>로그아웃</Text>
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setModalType("");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ fontSize: 25, marginBottom: 5, fontWeight: "bold" }}>
              {modalType === "edit" ? "계정 정보 수정" : modalType === "delete" ? "계정 탈퇴" : ""}
            </Text>
            {
              modalType === "edit" ?
                <>
                  <Text style={styles.textTo}>
                    이메일 변경
                    <Text style={[styles.textTo, { fontSize: 12, color: emailCheck && emailChecks ? "blue" : "red", },]}
                    >
                      (
                      {emailCheck && emailChecks ? "인증 완료" : "인증 필요"}
                      )
                    </Text>
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: emailCheck ? "100%" : "",
                    }}
                  >
                    <TextInput
                      style={styles.inputTo}
                      placeholder="이메일을 입력하세요."
                      value={email}
                      onChangeText={(text) => inputEmail(text)}
                    />
                    {!emailCheck ? (
                      <TouchableOpacity
                        disabled={emailCheck || !confirmEmail(true)}
                        style={[
                          styles.buttonSmall,
                          {
                            backgroundColor:
                              emailChecks || !confirmEmail(true)
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
                  {!(user.email === email) && emailCheck ? (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <TextInput
                        style={styles.inputTo}
                        placeholder="인증번호를 입력하세요."
                        value={emailConfirm}
                        maxLength={8}
                        disabled={emailChecks}
                        onChangeText={(text) =>
                          setEmailConfirm(text.replace(/[^0-9]/g, ""))
                        }
                      />
                      <TouchableOpacity
                        disabled={emailChecks || !confirmEmail(true)}
                        style={[
                          styles.buttonSmall,
                          {
                            backgroundColor: emailChecks ? "gray" : mainColor,
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
                    비밀번호 변경
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
                    placeholder="변경할 비밀번호를 입력하세요."
                    value={newPassword}
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
                        placeholder="변경할 비밀번호를 다시 한번 입력하세요."
                        value={subPassword}
                        onChangeText={setSubPassword}
                        secureTextEntry={true}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                  <Text style={styles.textTo}>
                    닉네임 변경
                    <Text
                      style={[
                        styles.textTo,
                        { fontSize: 12, color: nicknameCheck ? "blue" : "red" },
                      ]}
                    >
                      ({nicknameCheck ? "확인 완료" : "중복 확인 필요"})
                    </Text>
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                      style={[styles.inputTo, { flex: 1, marginRight: 1 }]}
                      placeholder="닉네임을 입력하세요."
                      value={nickname}
                      onChangeText={(text) => inputNickname(text)}
                    />
                    <TouchableOpacity
                      disabled={nicknameCheck || nickname.length <= 0}
                      style={[
                        styles.buttonSmall,
                        {
                          backgroundColor:
                            nicknameCheck || nickname.length <= 0
                              ? "gray"
                              : mainColor,
                        },
                      ]}
                      onPress={() => CheckProcess({ nickname: nickname })}
                    >
                      <Text style={styles.buttonTextSmall}>확인</Text>
                    </TouchableOpacity>
                  </View>
                </> :
                modalType === "delete" ?
                  <Text style={{ textAlign: "center", color: "#ff0000", fontWeight: "bold" }}>
                    정말로 해당 계정을 탈퇴 처리하시겠습니까?{"\n"}이 작업은 되돌릴 수 없습니다.
                  </Text> : <></>
            }
            <Text style={styles.textTo}>
              현재 비밀번호
            </Text>
            <TextInput
              style={[styles.inputTo, { borderColor: modalType === "edit" ? "" : modalType === "delete" ? "#ff0000" : "" }]}
              placeholder="현재 비밀번호를 입력하세요."
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
            />
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={[
                  styles.buttonSmall,
                  { backgroundColor: false ? "gray" : mainColor },
                ]}
                onPress={() => {
                  setModalVisible(false);
                  setModalType("");
                }}
              >
                <Text style={styles.buttonTextSmall}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={false}
                style={[
                  styles.buttonSmall,
                  { backgroundColor: modalType === "edit" ? mainColor : modalType === "delete" ? "#ff0000" : "" },
                ]}
                onPress={() => {
                  modalType === "edit" ? EditProcess() : modalType === "delete" ? DeletedProcess() : null;
                }}
              >
                <Text style={styles.buttonTextSmall}>
                  {modalType === "edit" ? "수정하기" : modalType === "delete" ? "탈퇴하기" : null}
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
    backgroundColor: mainColor,
    alignItems: "center",
    justifyContent: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
  },
  nickname: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  phoneNumber: {
    marginTop: 10,
    fontSize: 14,
    color: "#ccc",
  },
  button: {
    width: "80%",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    elevation: 1,
  },
  buttonText: {
    fontSize: 16,
    marginBottom: 4,
    color: "#fff",
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    marginTop: 4,
  },
  backButton: {
    marginTop: 50,
  },
  backButtonText: {
    fontSize: 14,
  },
  exitButton: {
    marginTop: 50,
  },
  exitButtonText: {
    fontSize: 14,
    color: "white",
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  buttonTextSmall: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
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
  buttonStyle: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  experienceContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  experienceText: {
    color: mainColor,
    position: "absolute",
    zIndex: 1,
  },
  progressBar: {
    borderWidth: 0.5,
    borderColor: "#fff",
    width: "100%",
    height: 15,
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
  textTo: {
    fontSize: 15,
    marginLeft: 20,
    marginBottom: -5,
    marginTop: 20,
    fontWeight: "bold",
    alignSelf: "flex-start",
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
