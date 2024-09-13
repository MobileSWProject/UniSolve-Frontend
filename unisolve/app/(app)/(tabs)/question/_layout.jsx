import { Stack } from "expo-router";

export default function QuestionLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{ title: "Question" }}
      />
      <Stack.Screen
        name="subPage"
        options={{ title: "Question 서브 페이지" }}
      />
    </Stack>
  );
}
