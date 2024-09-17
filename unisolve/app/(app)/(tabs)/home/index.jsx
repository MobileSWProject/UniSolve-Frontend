import { Link, usePathname } from "expo-router";
import { useState, useEffect } from "react";
import { Text, View, Image, StyleSheet } from "react-native";

export default function Home() {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Update the current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>환영합니다</Text>
      <Text style={styles.timeText}>현재 시간: {currentTime}</Text>
      
      {/* 로고 이미지 추가 */}
      <Image
        source={require('../../../../assets/logo.jpg')} // 이미지 경로 수정
        style={styles.logo}
      />
      
    
      <Link
        href={`${pathname}/alarmpage`}
        style={styles.link}
      >
        <Image
        source={require('../../../../assets/alarm.png')} // 이미지 경로 수정
        style={styles.logo}
      />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timeText: {
    fontSize: 18,
    marginBottom: 20,
  },
  logo: {
    width: 100, // 원하는 너비로 수정
    height: 100, // 원하는 높이로 수정
    marginBottom: 20,
  },
  homeText: {
    fontSize: 18,
    marginBottom: 20,
  },
  link: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 16,
    color: 'blue',
  },
});
