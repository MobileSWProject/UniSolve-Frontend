import { Stack } from "expo-router";

export default function CommunityLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{ title: "Community" }}
      />
      <Stack.Screen
        name="[id]"
        options={({ route }) => ({
          title: `질문 #${route.params.id}`,
        })}
      />
      <Stack.Screen
        name="chat/[id]"
        options={({ route }) => ({
          title: `채팅 (질문 #${route.params.id})`,
          animation: "slide_from_bottom",
        })}
      />
    </Stack>
  );
}
