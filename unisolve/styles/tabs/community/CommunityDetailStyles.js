import { StyleSheet, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: windowWidth,
    height: windowWidth,
    resizeMode: "cover",
  },
  contentContainer: {
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  privateStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  privateStatusIcon: {
    marginRight: 5,
  },
  privateStatusText: {
    fontSize: 14,
    color: "#666",
  },
  userInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    marginBottom: 20,
  },
  replyContainer: {
    padding: 15,
    backgroundColor: "#f8f8f8",
  },
  replyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  replyItem: {
    marginBottom: 15,
  },
  replyUser: {
    fontSize: 14,
    fontWeight: "bold",
  },
  replyTimestamp: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  replyContent: {
    fontSize: 14,
  },
});

export default styles;
