import { Stack } from "expo-router";
import useUserId from "../../hooks/useUserId";

import { useTranslation } from 'react-i18next';
import "../../i18n";

export default function AppLayout() {
  const { loading } = useUserId();
  const { t } = useTranslation();

  // 로딩 중일 때 빈 화면
  if (loading) return <></>;

  return (
    <Stack
      initialRouteName="(tabs)"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
