import { StyleSheet } from "react-native";
import { mainColor } from "../../../constants/Colors";

export const styles = StyleSheet.create({
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
  buttonText: {
    fontSize: 16,
    marginBottom: 4,
    color: "#fff",
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
    width: 150,
    height: 15,
  },
});
