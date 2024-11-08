import { Stack } from "expo-router";
import useUserId from "../../hooks/useUserId";

export default function AppLayout() {
  const { loading } = useUserId();

  // 로딩 중일 때 빈 화면
  if (loading) return <></>;

  return (
    <Stack
      initialRouteName="(tabs)"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="post/[id]/index"
        options={({ route }) => ({
          title: `질문 #${route.params.id}`,
          headerBackTitle: "뒤로가기",
          headerShown: true,
        })}
      />
      <Stack.Screen
        name="post/[id]/chat"
        options={({ route }) => ({
          title: `채팅 (질문 #${route.params.id})`,
          animation: "slide_from_bottom",
          headerShown: true,
        })}
      />
    </Stack>
  );
}
