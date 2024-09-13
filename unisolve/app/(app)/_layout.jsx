import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack initialRouteName="(tabs)">
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
