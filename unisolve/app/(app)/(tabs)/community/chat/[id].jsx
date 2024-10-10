import { FlatList, StyleSheet } from "react-native";
import ChatMessage from "../../../../../components/tabs/community/ChatMessage";

// 임시 데이터
// /send_message post 방식으로 라우팅 필요합니다.
// 서버 코드 490번째 줄부터 참조하시면 됩니다
const chatData = [
  {
    me: false,
    user: "리액트 전문가",
    message:
      "안녕하세요. 'VirtualizedLists should never be nested' 오류에 대해 질문하셨네요.",
  },
  {
    me: true,
    message:
      "네, 맞아요. 제가 ScrollView 안에 여러 개의 FlatList를 넣어서 구현했더니 이런 오류가 나왔어요.",
  },
  {
    me: false,
    user: "리액트 전문가",
    message: "이 문제를 해결하기 위한 몇 가지 방법이 있습니다.",
  },
  { me: true, message: "아, 그렇군요. 구체적으로 어떻게 구현하면 될까요?" },
  {
    me: false,
    user: "리액트 전문가",
    message: "먼저 모든 데이터를 하나의 배열로 합치고...",
  },
  {
    me: true,
    message: "이해했어요. 그런데 이렇게 하면 성능에는 문제가 없을까요?",
  },
  {
    me: false,
    user: "리액트 전문가",
    message:
      "좋은 질문이에요. FlatList는 기본적으로 성능 최적화가 되어 있지만...",
  },
  { me: true, message: "오, 그런 prop들이 있군요." },
  {
    me: false,
    user: "리액트 전문가",
    message:
      "getItemLayout은 각 아이템의 높이와 위치를 미리 계산해 주는 함수예요.",
  },
  { me: true, message: "아하, 이해됐어요." },
  {
    me: false,
    user: "리액트 전문가",
    message: "천만에요. 궁금한 점 있으면 언제든 물어보세요.",
  },
];

export default function CommunityChat() {
  const renderItem = ({ item }) => (
    <ChatMessage
      me={item.me}
      user={item.user}
      message={item.message}
    />
  );

  // 데이터 역순으로 하기
  const reversedData = [...chatData].reverse();

  return (
    <FlatList
      data={reversedData}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.container}
      inverted // 거꾸로 출력
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40, // 여유 공간 추가
  },
});
