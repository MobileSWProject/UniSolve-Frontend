import { useRouter } from "expo-router";
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { mainColor } from '../../constants/Colors';  

export default function Register() {


  const router = useRouter()
  return (
  <View style={styles.container}>
    {/* 회원가입 제목 */}
    <Text style={styles.title}>회원가입</Text>

      {/* 아이디 입력 필드 */}
      <Text style={styles.label}>아이디</Text>
      <TextInput
        style={styles.input}
        placeholder="사용할 아이디를 입력하세요."
      />

      {/* 이름 입력 필드 */}
      <Text style={styles.label}>이름</Text>
      <TextInput
        style={styles.input}
        placeholder="한글, 본명을 입력하세요"
      />

      {/* 비밀번호 입력 필드 */}
      <Text style={styles.label}>비밀번호</Text>
      <TextInput
        style={styles.input}
        placeholder="사용할 비밀번호를 입력하세요."
        secureTextEntry={true}
      />

      {/* 하단 로그인 링크 */}
      <View style={styles.footer}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.link}>Log in</Text>
        </TouchableOpacity>
      </View>

      {/* 회원가입 버튼 */}
      <TouchableOpacity style={[styles.button, { backgroundColor: mainColor }]} >
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  label: {
    width: '100%', 
    textAlign: 'left', 
    marginBottom: 4, 
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  link: {
    color: mainColor,
    fontWeight: 'bold',
  },
});
