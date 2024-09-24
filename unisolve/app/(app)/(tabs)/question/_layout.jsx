import { Stack } from "expo-router";
import { createContext, useState } from "react";

// Question 탭에서 image 상태 관리를 공유할 수 있도록 ImageContext를 이용합니다.
export const ImageContext = createContext(null);

export default function QuestionLayout() {
  // 질문할 때 사용할 이미지 상태 관리를 위한 코드입니다.
  const [image, setImage] = useState(null);

  return (
    // ImageContext Provider로 Question 탭의 모든 화면에서,
    // image와 setImage를 사용할 수 있도록 해줍니다.
    <ImageContext.Provider value={{ image, setImage }}>
      <Stack initialRouteName="index">
        <Stack.Screen
          name="index"
          options={{ title: "질문하기" }}
        />
        <Stack.Screen
          name="upload"
          options={{ title: "질문하기", headerBackTitle: "뒤로가기" }}
        />
      </Stack>
    </ImageContext.Provider>
  );
}
