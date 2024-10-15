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


      {/* 로고 페이지 */}
      <Link
        href={`${pathname}/../question`}
        style={styles.logopage}
      >
        <Image
          source={require('../../../../assets/logo.jpg')}
          style={styles.logo}
        />
      </Link>

      <Text >로고를 클릭하여 문제를 해결하세요!</Text>

      {/* 프로필 페이지 */}
      <Link
        href={`${pathname}/profilepage`}
        style={styles.profileLink}
      >
        <Image
          source={require('../../../../assets/profile.png')}
          style={styles.extralogo}
        />
      </Link>

      {/* 경험치 페이지 */}
      <Link
        href={`${pathname}/expPage`}
        style={styles.expLink}
      >
        <Image
          source={require('../../../../assets/logo.jpg')}
          style={styles.extralogo}
        />
      </Link>

      {/* 알림 페이지 */}
      <Link
        href={`${pathname}/notificationpage`}
        style={styles.alarmLink}
      >
        <Image
          source={require('../../../../assets/alarm.png')}
          style={styles.extralogo}
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
  welcomeText: { //환영합니다
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timeText: { //실시간
    fontSize: 18,
    marginBottom: 20,
  },
  logo: { //로고 이미지
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  extralogo: { //프로필, 알림 이미지
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  profileLink: { //프로필 링크 사진
    position: 'absolute',
    top: 10,
    left: 10,
  },
  expLink: { //경험치 링크 사진
    position: 'absolute',
    top: 10,
    left: 60,
  },
  alarmLink: { // 알림 링크 사진
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
