import { StyleSheet, Dimensions } from "react-native";
import { mainColor } from "../../constants/Colors";

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
    maxWidth: 400,
    maxHeight: 400,
    alignSelf: "center",
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
  chatButtonContainer: {
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  chatButtonTouchArea: {
    backgroundColor: mainColor,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  chatButtonText: { color: "white", fontWeight: "900", fontSize: 22 },
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
