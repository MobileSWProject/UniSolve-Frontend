import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  main: {
    backgroundColor: "#EEE",
    borderWidth: 2,
    borderColor: "#ffffff00",
    borderTopColor: "#fff",
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    borderRadius: 15,
    padding: 15,
    marginVertical: 2,
    marginHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  id: {
    fontWeight: "bold",
    color: "#333",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    color: "#000",
  },
  description: {
    fontSize: 14,
    marginTop: 5,
    color: "#999",
    marginRight: 25,
  },
  footer: {
    fontSize: 12,
    marginTop: 12,
    fontWeight: "bold",
    color: "#666",
  },
  flatList: {
    width: "93%",
    maxHeight: 100,
    borderWidth: 3,
    borderColor: "black",
    borderTopWidth: 0,
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
});
