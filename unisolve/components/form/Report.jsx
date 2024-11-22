import Input from "./Input";
import InputProcess from "./InputProcess";
import SnackBar from "../Snackbar";
import { mainColor } from "../../constants/Colors";
import { useState } from "react";
import { Text } from "react-native";
import { useTranslation } from "react-i18next";
import "../../i18n";
import _axios from "../../api";

export default function Report({visible, setVisible, post, comment, setComment}) {
  const { t } = useTranslation();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [process, setProcess] = useState(false);

  const snackBar = (message) => { setSnackbarMessage(message); setSnackbarVisible(true); };

  const handleReport = async () => {
    if (reportReason.length < 1 || process) {
      snackBar(t("Function.input_content"));
      return;
    }
    try {
      setProcess(true);
      const response = await _axios.post(`/reports`, { post_id: post, comment_id: comment || null, reason: reportReason });
      if (response.data.status === "success") {
        snackBar(t("Function.report_success"));
        setTimeout(() => { 
          setVisible(false);
          setProcess(false);
          setReportReason("");
          setComment(null);
        }, 2000);
      }
    } catch {
      setProcess(false);
      snackBar(t("Function.report_failed"));
    }
  };
  return (
    <>
      <SnackBar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={() => setSnackbarVisible(false)}
      />
      <Text style={{ fontSize: 40, marginBottom: 10, textAlign: "center", fontWeight: "bold", color: mainColor, marginTop: 4 }}>{comment ? "댓글 신고하기" : "게시글 신고하기"}</Text>
      <Input
        title="신고 내용"
        placeholder="신고할 내용을 자세하게 입력하세요."
        content={reportReason}
        onChangeText={setReportReason}
        disabled={process}
      />
      <InputProcess
        visible={visible}
        setVisible={setVisible}
        onPress={() => {handleReport();}}
        content={t("Function.confirm")}
        cancel={process}
        disabled={process}
      />
    </>
  );
}
