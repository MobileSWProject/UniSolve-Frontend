import { StyleSheet } from "react-native";
import { mainColor } from "../../../constants/Colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: mainColor,
  },
  welcomeText: {
    //환영합니다
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  timeDate: {
    //실시간
    fontSize: 40,
    marginBottom: 10,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  timeText: {
    //실시간
    fontSize: 50,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  logo: {
    //로고 이미지
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  logotypo: {
    //로고 이미지
    position: "absolute",
    width: 155,
    height: 45,
    top: 0,
    left: 5,
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
  extralogo: {
    //알림 이미지
    top: 0,
    width: 40,
    height: 40,
  },
  expLink: {
    //경험치 링크 사진
    position: "absolute",
    top: 200,
    left: 60,
  },
  alarmLink: {
    // 알림 링크 사진
    position: "absolute",
    top: 15,
    right: 10,
  },
  profileLink: {
    // 알림 링크 사진
    position: "absolute",
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
    marginTop: 20,
    marginBottom: 10,
  },
  buttonTextSmall: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 20,
  },
  modalView: {
    maxWidth: "86%",
    maxHeight: "76%",
    aspectRatio: 5 / 7,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
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
