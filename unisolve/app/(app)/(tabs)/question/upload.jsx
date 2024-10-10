import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  Button,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ImageContext } from "./_layout";
import styles from "../../../../styles/tabs/question/UploadStyles";
import InputBox from "../../../../components/tabs/question/InputBox";
import InputTitle from "../../../../components/tabs/question/InputTitle";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import _axios from "../../../../api";

export default function QuestionSubPage() {
  // 폼 내용 상태 관리
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  // 질문 제출 로딩 상태 관리
  const [submitLoading, setSubmitLoading] = useState(false);

  const router = useRouter();
  const { image } = useContext(ImageContext);

  // 작성 완료 버튼을 눌렀을 때 동작하는 함수
  const handleSubmit = async () => {
    const data = {
      title,
      content,
      isPrivate,
      image,
    };

    // 폼이 다 채워지지 않았을 때 처리
    if (data.title.trim() === "" || data.content.trim() === "") {
      console.log("폼이 다 채워지지 않음");
      return;
    }

    // 서버로 데이터 전송
    console.log("제출중...");
    setSubmitLoading(true);

    // !! 서버 전송 로직 ===
    const dataForServer = JSON.stringify({
      is_private: Number(isPrivate),
      title,
      content,
      // image <-- 이미지는 임시 보류
    });

    try {
      const response = await _axios.post("/questions", dataForServer);
      console.log(response);

      console.log("제출완료");
      setSubmitLoading(false);

      // question으로 먼저 이동 후
      router.navigate("/question");
      // community 메인으로 이동
      router.push("/community");
      // 바로 생성된 게시글로 이동
      setTimeout(() => router.push("/community/123"));
    } catch (error) {
      console.log("Error during submission:", error);

      // 400 또는 401 상태 코드를 받을 때 홈 화면으로 리다이렉트
      if (
        error.response &&
        (error.response.status === 400 || error.response.status === 401)
      ) {
        console.log("권한이 없거나 요청이 잘못됨, 홈으로 리다이렉트 중...");
        router.replace("/"); // 홈 라우터로 이동 (로그인 페이지 등으로 리다이렉트)
      }

      // 기타 다른 에러 처리 로직
      setSubmitLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        {/* 이미지 */}
        {image && (
          <Image
            source={{ uri: image }}
            style={styles.image}
          />
        )}
        {/* 제목 입력 */}
        <View style={styles.inputArea}>
          <InputTitle title="제목" />
          <InputBox
            height={40}
            setState={setTitle}
          />
        </View>
        {/* 내용 입력 */}
        <View style={[styles.inputArea]}>
          <InputTitle title="내용" />
          <InputBox
            height={300}
            multiline
            setState={setContent}
          />
        </View>
        {/* 비공개 선택 */}
        <View style={styles.privateToggleView}>
          <TouchableOpacity
            style={styles.privateToggleTouchArea}
            hitSlop={6}
            onPress={() => setIsPrivate((prev) => !prev)}
          >
            <View
              style={[
                styles.privateToggleButton,
                isPrivate && styles.privateToggleButton_pressed,
              ]}
            >
              {isPrivate && (
                <MaterialCommunityIcons
                  name="check"
                  size={18}
                  color="white"
                />
              )}
            </View>
            <Text style={styles.privateToggleText}>비공개로 질문하기</Text>
          </TouchableOpacity>
        </View>
        {/* 작성 완료 버튼 */}
        <TouchableOpacity
          style={styles.submitButton}
          hitSlop={4}
          onPress={handleSubmit}
          disabled={submitLoading}
        >
          <Text style={styles.submitButtonText}>
            {submitLoading ? "로딩중..." : "작성 완료"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}
