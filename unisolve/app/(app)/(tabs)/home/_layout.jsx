import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }} >
      <Stack.Screen name="index" options={{ title: "HomePage" }} />
    </Stack>
  );
}