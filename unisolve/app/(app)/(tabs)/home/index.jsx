import { Link, usePathname } from "expo-router";
import { useState, useEffect } from "react";
import { Text, View, Image, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { mainColor } from "../../../../constants/Colors";
import Exp from "../../../../components/tabs/home/Exp";

export default function Home() {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [modalVisible, setModalVisible] = useState(false);

  // Update the current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>환영합니다</Text>
      <Text style={styles.timeText}>현재 시간: {currentTime}</Text>


      {/* 로고 페이지 */}
      <Link
        href={`${pathname}/../question`}
        style={styles.logopage}
      >
        <Image
          source={require('../../../../assets/logo.png')}
          style={styles.logo}
        />
      </Link>

      <Text >로고를 클릭하여 문제를 해결하세요!</Text>

      {/* 프로필 페이지 */}
      <Link
        href={`${pathname}/profilepage`}
        style={styles.profileLink}
      >
        <Image
          source={require('../../../../assets/profile.png')}
          style={styles.extralogo}
        />
      </Link>

      {/* 경험치 페이지 */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.expLink}
      >
        <Image
          source={require('../../../../assets/logo.png')}
          style={styles.extralogo}
        />
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Exp/>
            <TouchableOpacity disabled={false} style={[styles.buttonSmall, { backgroundColor: false ? 'gray' : mainColor }]} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonTextSmall}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 알림 페이지 */}
      <Link
        href={`${pathname}/notificationpage`}
        style={styles.alarmLink}
      >
        <Image
          source={require('../../../../assets/alarm.png')}
          style={styles.extralogo}
        />
      </Link>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcomeText: { //환영합니다
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timeText: { //실시간
    fontSize: 18,
    marginBottom: 20,
  },
  logo: { //로고 이미지
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  extralogo: { //프로필, 알림 이미지
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  profileLink: { //프로필 링크 사진
    position: 'absolute',
    top: 10,
    left: 10,
  },
  expLink: { //경험치 링크 사진
    position: 'absolute',
    top: 10,
    left: 60,
  },
  alarmLink: { // 알림 링크 사진
    position: 'absolute',
    top: 10,
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
  },
  buttonTextSmall: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
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
});
