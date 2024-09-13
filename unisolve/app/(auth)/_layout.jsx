import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{ title: "Home", headerShown: false }}
      />
      <Stack.Screen
        name="login"
        options={{ title: "Login" }}
      />
      {/* <Stack.Screen
        name="register"
        options={{ title: "Register" }}
      />
        */}
    </Stack>
  );
}
