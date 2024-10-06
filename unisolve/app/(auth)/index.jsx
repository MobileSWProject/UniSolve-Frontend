import { View } from "react-native";
import { useRouter } from "expo-router";
import MainButton from "../../components/tabs/question/MainButton";

export default function AuthIndexPage() {
  const router = useRouter(); // 라우팅을 위한 useRouter 훅을 가져옵니다.

  return (
    <View style={styles.container}>
      {/* 로그인 버튼 */}
      <MainButton
        text={"로그인 하기"}
        onPress={() => router.push("/login")} // 로그인 페이지로 이동
      />

      {/* 여백 추가 */}
      <View style={styles.buttonSpacing} />

      {/* 회원가입 버튼 */}
      <MainButton
        text={"회원가입 하기"}
        onPress={() => router.push("/register")} // 회원가입 페이지로 이동
      />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  buttonSpacing: {
    height: 20, // 로그인 버튼과 회원가입 버튼 사이의 여백 크기
  },
};
