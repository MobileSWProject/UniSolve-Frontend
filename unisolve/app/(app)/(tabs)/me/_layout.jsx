import { Stack } from "expo-router";

export default function MeLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Me" }}
      />
      {/* <Stack.Screen
        name="history"
        options={{ title: "히스토리" }}
      /> */}
    </Stack>
  );
}
