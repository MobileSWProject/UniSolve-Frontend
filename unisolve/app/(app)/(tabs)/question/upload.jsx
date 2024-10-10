import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Image, Platform, Text, TouchableOpacity, View } from "react-native";
import { ImageContext } from "./_layout";
import styles from "../../../../styles/tabs/question/UploadStyles";
import InputBox from "../../../../components/tabs/question/InputBox";
import InputTitle from "../../../../components/tabs/question/InputTitle";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { _fetchFormData, formFetch } from "../../../../api";

export default function QuestionSubPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const router = useRouter();
  const { image } = useContext(ImageContext); // 이미지 URI 가져오기

  // 이미지 및 폼 데이터 전송
  const handleSubmit = async () => {
    // 폼이 다 채워지지 않았을 때 처리
    if (title.trim() === "" || content.trim() === "") {
      console.log("폼이 다 채워지지 않음");
      return;
    }
    const data = new FormData();

    // 기본 질문 데이터 추가
    data.append("title", title);
    data.append("content", content);
    data.append("is_private", Number(isPrivate));

    console.log("image" + image);

    // 이미지가 있을 경우 FormData에 추가
    if (image) {
      if (Platform.OS === "web") {
        // 웹 환경에서는 파일을 그대로 FormData에 추가
        console.log("web");
        data.append("image", image);
      } else {
        // 앱 환경에서는 uri 기반으로 처리
        console.log("app");
        data.append("image", {
          uri: image, // 이미지 URI
          name: "image.jpg", // 파일 이름 (없을 경우 기본 이름 설정)
          type: "image/jpeg", // MIME 타입 (없을 경우 기본값 설정)
        });
      }
    }

    // 서버로 데이터 전송
    console.log("제출중...");
    setSubmitLoading(true);
    try {
      const response = await formFetch("/questions", data);
      // 등록된 포스트 아이디를 가져옴
      const postId = response.postId;

      console.log("제출완료");
      setSubmitLoading(false);

      // question으로 먼저 이동 후
      router.navigate("/question");
      // community 메인으로 이동
      router.push("/community");
      // 등록된 포스트로 이동
      setTimeout(() => router.push(`/post/${postId}`));
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
