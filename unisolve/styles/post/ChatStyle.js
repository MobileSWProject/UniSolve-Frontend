import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  inputContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    bottom: 0,
    position: "absolute",
    width: "100%",
    gap: 10,
    backgroundColor: "white",
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: "black",
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
  sendButton: {
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 6,
  },
});
