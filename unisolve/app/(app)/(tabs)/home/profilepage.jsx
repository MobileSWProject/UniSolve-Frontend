import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function HomeSubPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 프로필 이미지 */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: "" }} // 여기에 실제 이미지 URL을 넣을 수 있음
          style={styles.profileImage}
        />
        <View style={styles.profileTextContainer}>
          <Text style={styles.nickname}>닉네임</Text>
          <Text style={styles.phoneNumber}>010-1***-***9</Text>
        </View>
      </View>

      {/* 질문 게시판 버튼 */}
      <TouchableOpacity style={styles.button} onPress={()=> {}}>
        <Text style={styles.buttonText}>질문/답변 기록</Text>
      </TouchableOpacity>

      {/* 알림 설정 버튼 */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>알림 설정</Text>
      </TouchableOpacity>

      {/* 뒤로 가기 버튼 */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>뒤로가기</Text>
      </TouchableOpacity>

      {/* 뒤로 가기 버튼 */}
      <TouchableOpacity style={styles.Button} onPress={() => router.back()}>
        <Text style={styles.exitButtonText}>탈퇴하시겠습니까?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ccc",
  },
  profileTextContainer: {
    marginLeft: 20,
  },
  nickname: {
    fontSize: 18,
    fontWeight: "bold",
  },
  phoneNumber: {
    fontSize: 14,
    color: "#777",
  },
  button: {
    width: "80%",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    elevation: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 50,
  },
  backButtonText: {
    fontSize: 14,
  },
  exitButton: {
    marginTop: 50,
  },
  exitButtonText: {
    fontSize: 14,
    color: "red",
  },
});
