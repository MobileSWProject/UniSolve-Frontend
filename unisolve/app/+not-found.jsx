import { useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { styles } from "../styles/NotFoundStyle";
import { useTranslation } from 'react-i18next';
import "../i18n";

export default function NotFoundScreen() {
  const router = useRouter();
  const [time, setTime] = useState(3);
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => { setTime(time => time - 1); }, 1000);
    if (time <= 0) {
      router.replace("/");
    }
    return () => clearInterval(interval);
  }, [time]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>404</Text>
      <Text style={styles.subtitle}>{t("Function.notpage")}</Text>
      <Text style={styles.subsubtitle}>{`${time}${t("Function.notpagego")}`}</Text>
    </SafeAreaView>
  );
}