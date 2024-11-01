import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  main: {
    backgroundColor: "#DADADA",
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
  },
  description: {
    fontSize: 14,
    marginTop: 5,
    color: "#666",
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
});
