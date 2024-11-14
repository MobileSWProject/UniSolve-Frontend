import { StyleSheet } from "react-native";
import { mainColor } from "../../constants/Colors";
import { styles as FormStyle } from "./FormStyle";

const styles = StyleSheet.create({
  container: {
    // left: 10,
    top: 10,
    // padding: 35,
    paddingHorizontal: 20,
  },
  submitContainer: {
    width: "93%",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 10,
  },
  submitButton: {
    backgroundColor: mainColor,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    width: 80,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "900",
    fontSize: 18,
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
  textTo: {
    ...FormStyle.textTo,
  },
});

export default styles;
