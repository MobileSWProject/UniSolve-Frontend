import { Stack } from "expo-router";
import { LogBox } from "react-native"; // react-native-syntax-highlighter의 defaultProps 경고 메세지 앱에서 안나오게
LogBox.ignoreLogs(["defaultProps"]);
const originalError = console.error; // react-native-syntax-highlighter의 defaultProps 에러 메세지 로그에서 안나오게
console.error = (message, ...args) => {
  if (typeof message === "string" && message.includes("defaultProps")) {
    console.log("defaultProps 어쩌구 오류");
    return;
  }

  if (message.includes("VirtualizedLists should never be nested")) {
    console.log("VirtualizedLists 어쩌구 오류");
    return; // 경고를 무시
  }
  originalError(message, ...args);
};

export default function Layout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }} >
      <Stack.Screen name="index" />
      <Stack.Screen name="(app)" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
