import { Stack } from "expo-router";
import useUserId from "../../hooks/useUserId";

export default function AppLayout() {
  const { loading } = useUserId();
  if (loading) return null; // 로딩 중일 때 빈 화면
  return (
    <Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }} >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}