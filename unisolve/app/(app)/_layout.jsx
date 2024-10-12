import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack initialRouteName="(tabs)">
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="post/[id]/index"
        options={({ route }) => ({
          title: `질문 #${route.params.id}`,
          headerBackTitle: "뒤로가기",
        })}
      />
      <Stack.Screen
        name="post/[id]/chat"
        options={({ route }) => ({
          title: `채팅 (질문 #${route.params.id})`,
          animation: "slide_from_bottom",
        })}
      />
    </Stack>
  );
}
