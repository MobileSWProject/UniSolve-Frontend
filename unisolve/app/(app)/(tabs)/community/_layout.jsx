import { Stack } from "expo-router";

export default function CommunityLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{ title: "Community" }}
      />
      <Stack.Screen
        name="subPage"
        options={{ title: "Community 서브 페이지" }}
      />
    </Stack>
  );
}
