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
          source={require('../assets/logo.jpg')} 
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
  logo: { //로고 이미지
    width: 250, 
    height: 250,
    marginBottom: 20,
  }
});
