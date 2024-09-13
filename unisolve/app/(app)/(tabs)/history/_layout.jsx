import { Stack } from "expo-router";

export default function HistoryLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" />
      <Stack.Screen
        name="subPage"
        options={{ title: "서브 페이지" }}
      />
    </Stack>
  );
}
