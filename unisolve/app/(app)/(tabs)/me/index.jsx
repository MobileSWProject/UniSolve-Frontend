import { useCallback, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { mainColor } from "../../../../constants/Colors";
import { ProgressBar } from "react-native-paper";
import { getExpToLevel, getPercent, getLevel } from "../../../../components/tabs/home/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalView from "../../../../components/form/ModalView";
import _axios from "../../../../api";

export default function MePage() {
  const router = useRouter();

  const [user, setUser] = useState({});
  const [userProcess, setUserProcess] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [exp, setExp] = useState("");

  useFocusEffect(
    useCallback(async () => { 
      await getUser();
    }, [])
  );

  async function getUser() {
    if (userProcess) return;
    try {
      setUserProcess(true);
      const response = await _axios.get("/accounts/mine");
      if (!response.data.data.username) {
        await AsyncStorage.clear();
        router.replace("/");
        return;
      }
      setUser(response.data.data);
      setExp(response.data.data.exp || 0);
      setUserProcess(false);
    } catch {
      router.replace("/");
    }
  }

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
          setModalType("modify");
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
      <TouchableOpacity
        onPress={() => {
          setModalType("delete");
          setModalVisible(true);
        }}
      >
        <Text style={styles.buttonText}>회원 계정 탈퇴</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={async () => {
        await AsyncStorage.removeItem("token");
        router.replace("/");
      }}>
        <Text style={styles.buttonText}>로그아웃</Text>
      </TouchableOpacity>
      {modalVisible ? (
        <ModalView
          type={modalType}
          visible={modalVisible}
          setVisible={setModalVisible}
          userData={user}
        />
      ) : null}
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
