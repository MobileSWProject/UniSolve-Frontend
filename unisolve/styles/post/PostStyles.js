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
  chatButtonText: {
    color: "white",
    fontWeight: "900",
    fontSize: 22,
  },

  // 댓글 관련 스타일
  commentContainer: {
    padding: 15,
    backgroundColor: "#f8f8f8",
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
    fontSize: 14,
    fontWeight: "bold",
  },
  commentTimestamp: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  commentContent: {
    fontSize: 14,
  },

  // 대댓글 관련 스타일
  repliesContainer: {
    marginLeft: 20,
    marginTop: 10,
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: "#dcdcdc",
  },
  replyItem: {
    marginBottom: 10,
  },
  replyIndent: {
    marginTop: 5,
  },
  replyUser: {
    fontSize: 13,
    fontWeight: "bold",
  },
  replyTimestamp: {
    fontSize: 11,
    color: "#999",
    marginBottom: 5,
  },
  replyContent: {
    fontSize: 13,
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

  // 대댓글 버튼
  replyButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: mainColor,
    borderRadius: 5,
    marginTop: 8,
    alignSelf: "flex-start", // 버튼을 왼쪽에 배치
  },
  replyButtonText: {
    color: "#FFFFFF", // 텍스트 색상: 흰색
    fontSize: 12, // 텍스트 크기: 작게
    fontWeight: "bold",
  },
});

export default styles;
