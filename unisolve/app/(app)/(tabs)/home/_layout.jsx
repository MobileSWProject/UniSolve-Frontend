import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Home" }}
      />
      {/* 질문하기 페이지 밑에 추가 */}
      {/* <Stack.Screen
        name="logopage"
        options={{ title: "질문하기 페이지( 여기에 질문하기 추가)" }}
      /> */}
      {/* <Stack.Screen
        name="subPage"
        options={{ title: "Home 서브 페이지" }}
      /> */}
    </Stack>
  );
}
