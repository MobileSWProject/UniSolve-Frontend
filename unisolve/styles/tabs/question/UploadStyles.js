import { Platform, StyleSheet } from "react-native";
import { mainColor } from "../../../constants/Colors";

const styles = StyleSheet.create({
  container: {
    gap: 22,
    paddingHorizontal: 30,
    paddingVertical: 20,
    flex: 1,
  },
  image: {
    borderRadius: 20,
    width: "full",
    aspectRatio: "1/1",
  },
  inputArea: {
    gap: 6,
  },
  privateToggleView: {
    alignItems: "flex-start",
  },
  privateToggleTouchArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  privateToggleButton: {
    borderWidth: 2,
    borderColor: "rgb(75, 75, 75)",
    width: 28,
    aspectRatio: 1,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  privateToggleButton_pressed: {
    borderColor: mainColor,
    backgroundColor: mainColor,
  },
  privateToggleText: {
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: mainColor,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "900",
    fontSize: 18,
  },
});

export default styles;
