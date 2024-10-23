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
import { useFocusEffect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mainColor } from "../../../../constants/Colors";
import { ProgressBar } from "react-native-paper";
import { getLevel } from "../../../../components/tabs/home/index";
import _axios from "../../../../api";

export default function MePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEeleting] = useState(false);

  const [modalVisibleEdit, setModalVisibleEdit] = useState(false);
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
    await _axios.post('/existuser', value).then(response => {
      if (value.nickname) { setNicknameCheck(response.data.isNotExist || false); }
    })
      .catch(() => {
        if (value.nickname) { setNicknameCheck(false); }
      })
  };

  const DeletedProcess = async () => {
    setDeleting(true);
    await _axios
      .delete("/delete_user")
      .then(async (response) => {
        setDeleting(false);
        if (response.data.deleted === true) {
          setModalVisible(false);
          await AsyncStorage.removeItem("token");
          router.replace("/");
          return;
        }
      })
      .catch(() => {
        setDeleting(false);
      });
  };

  if (!user) {
    return <></>;
  }

  const EmailCheckProcess = async () => {
    setEmailCheck(false);
    await _axios.post('/existuser', { email: email }).then(async (response) => {
      if (response.data.isNotExist) {
        await _axios.post('/send-code', { email }).then(response => {
          if (response.data.isSent) setEmailCheck(response.data.isSent);
        })
      }
    })
  };

  const EmailChecksProcess = async () => {
    await _axios
      .post("/verify-code", { email, code: emailConfirm })
      .then((response) => {
        setEmailChecks(response.data.isVerified || false);
      })
      .catch(() => {
        setEmailChecks(false);
      });
  };

  const EditProcess = async () => {
    setEeleting(true);
    if (
      password.length <= 0 ||
      !emailChecks ||
      (newPassword.length > 0 && newPassword !== subPassword) ||
      nickname.length <= 0
    ) {
      setEeleting(false);
      return;
    }
    await _axios
      .put("/update_user", {
        current_password: password,
        email: email,
        new_password: newPassword,
        user_nickname: nickname,
      })
      .then(async (response) => {
        setEeleting(false);
        if (response.data.updated === true) {
          setPassword("");
          setNewPassword("");
          setSubPassword("");
          _axios.get("/accounts/mine").then((response) => {
            setUser(response.data.data);
            setEmail(response.data.data.email);
            setEmailChecks(true);
            setNicknameCheck(false);
            setNickname(response.data.data.user_nickname);
          });
          setModalVisibleEdit(false);
          return;
        }
      })
      .catch(() => {
        setEeleting(false);
      });
  };

  const EmailEditCheck = (value) => {
    if (value === user.email) setEmailChecks(true);
    else setEmailChecks(false);
    setEmail(value);
  };

  const NicknameEditCheck = (value) => {
    if (value === user.user_nickname) setNicknameCheck(true);
    else setNicknameCheck(false);
    setNickname(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.experienceContainer}>
        <Text style={styles.experienceText}>{getLevel(exp)}레벨</Text>
        <ProgressBar
          styleAttr="Horizontal"
          indeterminate={false}
          progress={exp / 100}
          color="#00ff00"
          style={styles.progressBar}
        />
      </View>
      {/* 프로필 이미지 */}
      <View style={styles.profileContainer}>
        <Image
          source={require(`../../../../assets/icons/lv${0}.png`)}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.nickname}>
            {user.username} | {user.user_nickname}
          </Text>
          <Text style={styles.phoneNumber}>
            {user.school || "소속이 없습니다."}
          </Text>
        </View>
      </View>

      {/* 정보 수정 버튼 */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setModalVisibleEdit(true);
        }}
      >
        <Text style={styles.buttonText}>정보 수정</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisibleEdit}
        onRequestClose={() => setModalVisibleEdit(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.buttonText}>정보 수정</Text>
            {/* 이메일 입력 필드 */}
            <Text style={styles.label}>
              이메일 ({emailChecks ? "인증 완료" : "인증 필요"})
            </Text>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.flexInput]}
                placeholder="이메일 @형식으로 입력하세요"
                value={email}
                onChangeText={(value) => {
                  EmailEditCheck(value);
                }}
                disabled={emailCheck}
              />
              {!emailCheck &&
                email !== user.email &&
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) ? (
                <TouchableOpacity
                  style={[
                    styles.buttonSmall,
                    { backgroundColor: emailCheck ? "gray" : mainColor },
                  ]}
                  onPress={() => EmailCheckProcess()}
                >
                  <Text style={styles.buttonTextSmall}>이메일 인증</Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}
              {emailCheck ? (
                <>
                  {/* 이메일 입력 필드 */}
                  <TextInput
                    style={[styles.input, styles.flexInput]}
                    placeholder="이메일로 발송된 인증번호를 입력하세요."
                    value={emailConfirm}
                    onChangeText={setEmailConfirm}
                    disabled={emailChecks}
                  />
                  <TouchableOpacity
                    disabled={emailChecks}
                    style={[
                      styles.buttonSmall,
                      { backgroundColor: emailChecks ? "gray" : mainColor },
                    ]}
                    onPress={() => EmailChecksProcess()}
                  >
                    <Text style={styles.buttonTextSmall}>인증</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <></>
              )}
            </View>
            <View style={styles.row}>
              {/* 비밀번호 입력 필드 */}
              <View style={styles.flexItem}>
                <Text style={styles.label}>
                  비밀번호 (
                  {!/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W])[a-zA-Z0-9\W]{8,}$/.test(
                    newPassword
                  )
                    ? "규칙이 잘못됨"
                    : newPassword === subPassword
                      ? "일치함"
                      : "일치하지 않음"}
                  )
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="변경할 비밀번호를 입력하세요."
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={true}
                />
              </View>

              {/* 비밀번호 확인 입력 필드 */}
              <View style={styles.flexItem}>
                <Text style={styles.label}>
                  비밀번호 확인 (
                  {!/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W])[a-zA-Z0-9\W]{8,}$/.test(
                    newPassword
                  )
                    ? "규칙이 잘못됨"
                    : newPassword === subPassword
                      ? "일치함"
                      : "일치하지 않음"}
                  )
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="변경할 비밀번호를 다시 입력하세요."
                  value={subPassword}
                  onChangeText={setSubPassword}
                  secureTextEntry={true}
                />
              </View>
            </View>

            {/* 닉네임 입력 필드 */}
            <Text style={styles.label}>닉네임 ({nicknameCheck ? '확인 완료' : '중복 확인 필요'})</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.input}
                placeholder="앱 사용시 사용할 닉네임을 입력하세요"
                value={nickname}
                onChangeText={(nickname) => NicknameEditCheck(nickname)}
              />
              {
                !nicknameCheck ?
                  <TouchableOpacity disabled={nicknameCheck} style={[styles.buttonSmall, { backgroundColor: nicknameCheck ? 'gray' : mainColor }]} onPress={() => CheckProcess({ nickname: nickname })}>
                    <Text style={styles.buttonTextSmall}>중복확인</Text>
                  </TouchableOpacity> :
                  <></>
              }
            </View>
            {/* 비밀번호 입력 필드 */}
            <View style={styles.flexItem}>
              <Text style={styles.label}>비밀번호</Text>
              <TextInput
                style={styles.input}
                placeholder="현재 비밀번호를 입력하세요."
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.buttonStyle, { backgroundColor: "gray" }]}
                onPress={() => setModalVisibleEdit(false)}
              >
                <Text style={styles.textStyle}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonStyle, { backgroundColor: "skyblue" }]}
                onPress={() => {
                  EditProcess();
                }}
              >
                <Text style={styles.textStyle}>수정하기</Text>
                {editing && (
                  <ActivityIndicator
                    size="small"
                    color="#fff"
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 알림 설정 버튼 */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>알림 설정</Text>
      </TouchableOpacity>
      {/* 히스토리 버튼 */}
      <TouchableOpacity style={styles.button} onPress={() => router.replace()}>
        <Text style={styles.buttonText}>히스토리</Text>
      </TouchableOpacity>
      {/* 로그아웃 버튼 */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={async () => {
          await AsyncStorage.removeItem("token");
          router.replace("/");
          return;
        }}
      >
        <Text style={styles.backButtonText}>로그아웃</Text>
      </TouchableOpacity>
      {/* 탈퇴 버튼 */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "red" }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.exitButtonText}>탈퇴하기</Text>
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              정말로 해당 계정을 탈퇴 처리하시겠습니까?{"\n"}이 작업은 되돌릴 수 없습니다.
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.buttonStyle, { backgroundColor: "gray" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textStyle}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonStyle, { backgroundColor: "indianred" }]}
                onPress={() => {
                  DeletedProcess();
                }}
              >
                <Text style={styles.textStyle}>탈퇴하기</Text>
                {deleting && (
                  <ActivityIndicator
                    size="small"
                    color="#fff"
                  />
                )}
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
    width: 100,
    height: 100,
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
  buttonSmall: {
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
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
    fontWeight: "bold",
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    marginTop: 4,
  },
  input: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    marginBottom: 8,
    height: 50,
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
  modalText: {
    marginBottom: 15,
    textAlign: "center",
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
    top: 0,
  },
  experienceText: {
    fontSize: 16,
    color: mainColor,
    position: "absolute",
    zIndex: 1,
  },
  progressBar: {
    width: "100%",
    height: 15,
  },
});
