import { StyleSheet, Dimensions } from "react-native";
import { mainColor } from "../../constants/Colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 15,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    resizeMode: "cover",
    maxWidth: 400,
    maxHeight: 400,
    alignSelf: "center",
    borderRadius: 20,
    marginTop: 20,
  },
  contentContainer: {
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5,
    minHeight: 30,
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
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
    color: "#666",
  },

  // 댓글 관련 스타일
  commentContainer: {
    backgroundColor: "#f8f8f8",
    paddingTop: 30,
    paddingBottom: 60,
    paddingHorizontal: 24,
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: "bold",
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
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  commentButton: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  commentButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  centeredView: { //모달
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: 350,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonSmall: {
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 35,
    marginTop: 25,
  },
  buttonTextSmall: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },

  snackbarContainer: {//스낵바
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -50 }],
    backgroundColor: '#333',
    color: 'white',
    padding: '16px',
    borderRadius: '10px',
    width: '25%',
  },
  snackbar: {
    width: '100%',
  },
});

export default styles;
