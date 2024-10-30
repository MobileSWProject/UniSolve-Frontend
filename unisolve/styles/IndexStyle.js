import { StyleSheet } from "react-native";
import { mainColor } from "../constants/Colors";

export const styles = StyleSheet.create({
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
  text: {
    fontSize: 12,
    color: "#fff",
  },
  sendButton: {
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});