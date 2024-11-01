// react-native-syntax-highlighter의 defaultProps 경고 메세지 앱에서 안나오게
import { LogBox } from "react-native";
LogBox.ignoreLogs(["defaultProps"]);
// react-native-syntax-highlighter의 defaultProps 에러 메세지 로그에서 안나오게
const originalError = console.error;
console.error = (message, ...args) => {
  if (typeof message === "string" && message.includes("defaultProps")) {
    return;
  }
  originalError(message, ...args);
};

import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(app)" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
