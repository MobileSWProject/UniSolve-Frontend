import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack initialRouteName="(tabs)">
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="post/[id]"
        options={({ route }) => ({
          title: `질문 #${route.params.id}`,
          headerBackTitle: "뒤로가기",
        })}
      />
    </Stack>
  );
}
