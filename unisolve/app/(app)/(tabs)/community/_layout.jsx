import { Stack } from "expo-router";

export default function CommunityLayout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Community" }} />
    </Stack>
  );
}
