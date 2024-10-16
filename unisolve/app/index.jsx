// react-native-syntax-highlighter의 defaultProps 경고 메세지 앱에서 안나오게
import { LogBox } from "react-native";
LogBox.ignoreLogs(["defaultProps"]);

// react-native-syntax-highlighter의 defaultProps 에러 메세지 로그에서 안나오게
const originalError = console.error;
console.error = (message, ...args) => {
  if (typeof message === "string" && message.includes("defaultProps")) {
    return;
  }
  originalError(message, ...args);
};

import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native"; // Image 추가
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)");
    }, 1000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>UniSolve</Text>
      <Image
        source={require("../assets/logo.jpg")}
        style={styles.logo}
      />
      <Text style={styles.text}>환영합니다!</Text>
      <Text>곧 이동합니다.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  logo: {
    //로고 이미지
    width: 250,
    height: 250,
    marginBottom: 20,
  },
});
