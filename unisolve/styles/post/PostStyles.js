import { StyleSheet, Dimensions } from "react-native";
import { mainColor } from "../../constants/Colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    resizeMode: "cover",
    maxWidth: 400,
    maxHeight: 400,
    alignSelf: "center",
    borderRadius: 20,
    marginBottom: 20,
  },
  contentContainer: {
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
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
  chatButtonText: {
    color: "white",
    fontWeight: "900",
    fontSize: 22,
  },

  // 댓글 관련 스타일
  commentContainer: {
    backgroundColor: "#f8f8f8",
    paddingTop: 20,
    paddingBottom: 60,
    paddingHorizontal: 24,
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  commentItem: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  commentUser: {
    fontSize: 16,
    fontWeight: "bold",
  },
  commentTimestamp: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  commentContent: {
    body: { fontSize: 14 },
    fence: { backgroundColor: "black", color: "white" },
  },

  // 댓글 입력 칸
  // 댓글 입력 필드 스타일
  commentInputContainer: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
    marginBottom: 10,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  commentButton: {
    marginLeft: 10,
    backgroundColor: mainColor,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  commentButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default styles;
