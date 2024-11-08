import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  view: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: '100%',
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
  buttonSmall: {
    paddingHorizontal: 16,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    marginTop: 15,
    margin: 2,
  },
  buttonTextSmall: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  image: {
    borderRadius: 20,
    width: "100%",
    aspectRatio: "4/3",
  },
});
