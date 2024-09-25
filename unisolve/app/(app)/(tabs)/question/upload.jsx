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
    console.log(`전송 데이터: ${JSON.stringify(data)}`);
    setSubmitLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("제출완료");
    setSubmitLoading(false);
    router.back();
    router.push("/community/123");
    // 등록된 게시글로 router replace
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
