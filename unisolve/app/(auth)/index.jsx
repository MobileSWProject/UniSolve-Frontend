import { Link } from "expo-router";
import { Text, View } from "react-native";
import styles from "../../styles/auth/IndexStyles";

export default function AuthIndexPage() {
  return (
    <View style={styles.container}>
      <Link
        style={styles.link}
        href="/(auth)/login"
      >
        <Text style={styles.linkText}>로그인 하러 가기</Text>
      </Link>
      {/* <Link style={styles.linkText} href="/(auth)/register"> */}
      <Text style={styles.linkText}>회원가입 하러 가기 (아직 없음)</Text>
      {/* </Link> */}
    </View>
  );
}
