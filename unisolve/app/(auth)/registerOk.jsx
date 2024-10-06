import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { mainColor } from '../../constants/Colors';  

export default function RegisterComplete() {

  const router = useRouter();
  
  return (
    <View style={styles.container}>
      {/* 완료 메시지 아이콘 */}
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>✓</Text>
      </View>

      {/* 회원가입 완료 메시지 */}
      <Text style={styles.completeText}>회원가입 완료!</Text>

      {/* 로그인 버튼 */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: mainColor }]}
        onPress={() => router.push('/login')}
      >
        <Text style={styles.buttonText}>로그인하러 가기</Text>
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
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#CCCCCC',
  },
  completeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
