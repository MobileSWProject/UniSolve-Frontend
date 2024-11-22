import { useFocusEffect } from "expo-router";
import Input from "./Input";
import InputProcess from "./InputProcess";
import SnackBar from "../Snackbar";
import { mainColor } from "../../constants/Colors";
import { useState, useCallback } from "react";
import { Text } from "react-native";
import { useTranslation } from "react-i18next";
import "../../i18n";
import _axios from "../../api";

export default function Report({visible, setVisible, comment, setComment}) {
  const { t } = useTranslation();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [process, setProcess] = useState(false);

  const snackBar = (message) => { setSnackbarMessage(message); setSnackbarVisible(true); };

  // useFocusEffect(
  //   useCallback(async () => {
  //     try {
  //       const response = _axios.get(`/comment/${comment}`);
  //       setCommentContent(response.data.data.content);
  //     } catch {
  //       setVisible(false);
  //       setComment(null);
  //     }
  //   }, [])
  // );

  const handleUpdateComment = async () => {
    try {
      if (process || commentContent.trim().length <= 0) {
        setCommentContent("");
        snackBar(`${t("Stage.failed")}${t("Function.empty")}`);
        return;
      }
      setProcess(true);
      const response = await _axios.put(`/comments/${comment}`, {content: commentContent});
      if (response.data.status === "success") {
        snackBar(t("Function.edit"));
        setTimeout(() => { setVisible(false); setComment(null); setCommentContent(""); }, 2000);
      }
    } catch {
      snackBar("댓글 수정에 실패했습니다.");
    }
  };

  return (
    <>
      <SnackBar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={() => setSnackbarVisible(false)}
      />
      <Text style={{ fontSize: 40, marginBottom: 10, textAlign: "center", fontWeight: "bold", color: mainColor, marginTop: 4 }}>댓글 수정하기</Text>
      <Input
        title="댓글 수정"
        placeholder="댓글을 입력하세요."
        content={commentContent}
        onChangeText={setCommentContent}
        disabled={process}
      />
      <InputProcess
        visible={visible}
        setVisible={setVisible}
        onPress={() => {handleUpdateComment();}}
        content={t("Function.confirm")}
        cancel={process}
        disabled={process}
      />
    </>
  );
}
