import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{ title: "Home" }}
      />
      {/* 질문하기 페이지 밑에 추가 */}
      <Stack.Screen 
        name="logopage"
        options={{ title: "질문하기 페이지( 여기에 질문하기 추가)" }}
      />
      <Stack.Screen
        name="profilepage"
        options={{ title: "개인정보 페이지" }}
      />
      <Stack.Screen
        name="alarmpage"
        options={{ title: "알림 페이지(알림 페이지 구현)" }}
      />
      <Stack.Screen
        name="subPage"
        options={{ title: "Home 서브 페이지" }}
      />
    </Stack>
  );
}
