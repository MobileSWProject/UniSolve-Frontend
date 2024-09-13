import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{ title: "Home" }}
      />
      <Stack.Screen
        name="subPage"
        options={{ title: "Home 서브 페이지" }}
      />
    </Stack>
  );
}
