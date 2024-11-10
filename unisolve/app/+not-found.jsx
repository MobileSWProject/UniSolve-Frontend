import { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { mainColor } from "../constants/Colors";
import { useRouter } from "expo-router";

import { useTranslation } from 'react-i18next';
import "../i18n";

export default function NotFoundScreen() {
  const router = useRouter();
  const [time, setTime] = useState(3);

  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time => time - 1);
    }, 1000);
    if (time <= 0) router.replace("/");
    return () => clearInterval(interval);
  }, [time]);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>404</Text>
      <Text style={styles.subtitle}>{t("Function.notpage")}</Text>
      <Text style={styles.subsubtitle}>{`${time}${t("Function.notpagego")}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: mainColor,
  },
  title: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 40,
  },
  subsubtitle: {
    fontSize: 16,
    color: '#ccc',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1e90ff',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
});
