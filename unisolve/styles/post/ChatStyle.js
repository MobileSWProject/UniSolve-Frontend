import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    width: "100%",
    gap: 5,
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
  messageContent: {
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1, 
    borderRadius: 5,
    borderColor: "#BBB", 
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.25,
    maxWidth: 450,
    maxHeight: 300,
  },
  image: {
    width: 50,
    height: 50
  },
});
