import { Link, usePathname } from "expo-router";
import { useState, useEffect } from "react";
import { Text, View, Image, StyleSheet, TouchableOpacity, Modal, ProgressBar } from "react-native";
import { mainColor } from "../../../../constants/Colors";
import { Exp, getExpToLevel, getLevel, Notification } from "../../../../components/tabs/home/index";
import _axios from "../../../../api";

export default function Home() {
  const pathname = usePathname();
  const [currentDate, setCurrentDate] = useState(convertDate());
  const [currentTime, setCurrentTime] = useState(convertTime());
  const [modalVisibleNotification, setModalVisibleNotification] = useState(false);
  const [modalVisibleRanking, setModalVisibleRanking] = useState(false);
  const [exp, setExp] = useState("");

  useEffect(() => {
    getAccount();
    const interval = setInterval(() => {
      setCurrentDate(convertDate());
      setCurrentTime(convertTime());
    }, 1000);
    return () => { clearInterval(interval); }
  }, []);

  function convertDate() {
    const date = new Date();
    const week = { 0: "일", 1: "월", 2: "화", 3: "수", 4: "목", 5: "금", 6: "토" };
    return `${Number(date.getMonth() + 1)}월 ${date.getDate().toString().padStart(2, '0')}일 ${week[date.getDay()]}요일`
  }
  function convertTime() {
    const date = new Date();
    return `${date.getHours().toString().padStart(2, '0')}시 ${date.getMinutes().toString().padStart(2, '0')}분 ${date.getSeconds().toString().padStart(2, '0')}초`
  }

  async function getAccount() {
    await _axios.get("/accounts/mine").then((response) => {
      const tempExp = response.data.data.exp || 0;
      setExp(tempExp);
    });
  }

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
      <Text style={styles.timeDate}>{currentDate}</Text>
      <Text style={styles.timeText}>{currentTime}</Text>

      {/* 로고 페이지 */}
      <Link
        href={`${pathname}/../question`}
      >
        <Image
          source={require('../../../../assets/logo.png')}
          style={styles.logo}
        />
      </Link>

      <Text style={styles.timeDate}>로고를 클릭하여 문제를 해결하세요!</Text>

      {/* 알림 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisibleNotification}
        onRequestClose={() => setModalVisibleNotification(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Notification />
            <TouchableOpacity disabled={false} style={[styles.buttonSmall, { backgroundColor: false ? 'gray' : mainColor }]} onPress={() => setModalVisibleNotification(false)}>
              <Text style={styles.buttonTextSmall}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 랭킹 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisibleRanking}
        onRequestClose={() => setModalVisibleRanking(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Exp />
            <TouchableOpacity disabled={false} style={[styles.buttonSmall, { backgroundColor: false ? 'gray' : mainColor }]} onPress={() => setModalVisibleRanking(false)}>
              <Text style={styles.buttonTextSmall}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Image
        source={require('../../../../assets/logotypo.png')}
        style={styles.logotypo}
        resizeMode="contain"
      />

      {/* 알림 아이콘 */}
      <TouchableOpacity
        style={styles.alarmLink}
        onPress={() => { setModalVisibleNotification(true) }}
      >
        <Image
          source={require('../../../../assets/alarm.png')}
          style={styles.extralogo}
        />
      </TouchableOpacity>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: mainColor,
  },
  welcomeText: { //환영합니다
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timeDate: { //실시간
    fontSize: 40,
    marginBottom: 10,
    color: 'white',
    textAlign: "center",
    fontWeight: "bold",
  },
  timeText: { //실시간
    fontSize: 50,
    color: 'white',
    textAlign: "center",
    fontWeight: "bold",
  },
  logo: { //로고 이미지
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  logotypo: { //로고 이미지
    position: 'absolute',
    width: 180,
    height: 55,
    top: 15,
    left: 10,
  },
  box: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  extralogo: { //프로필, 알림 이미지
    top: 5,
    width: 50,
    height: 50,
  },
  expLink: { //경험치 링크 사진
    position: 'absolute',
    top: 200,
    left: 60,
  },
  alarmLink: { // 알림 링크 사진
    position: 'absolute',
    top: 15,
    right: 10,
  },
  profileLink: { // 알림 링크 사진
    position: 'absolute',
    top: 15,
    right: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  buttonSmall: {
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 35,
    marginTop: 25,
    marginBottom: 25,
  },
  buttonTextSmall: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 20,
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
