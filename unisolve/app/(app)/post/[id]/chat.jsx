import { useState, useCallback } from "react";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import ChatMessage from "../../../../components/post/ChatMessage";
import _axios from "../../../../api";

export default function CommunityChat() {
  const { id } = useLocalSearchParams();
  const [chatData, setChatData] = useState([]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState("");

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [id])
  );

  const getData = async () => {
    try {
      const response = await _axios.get(`/chat/messages?post_id=${id}`);
      setChatData(response.data.data);
    } catch {
      setChatData([]);
    }
  };

  const renderItem = ({ item }) => (
    <ChatMessage
      me={item.is_me}
      sender={item.sender}
      content={item.content}
      sent_at={item.sent_at}
    />
  );

  // 데이터 역순으로 하기
  const reversedData = [...chatData].reverse();

  async function msgSend() {
    if (!message || message.length <= 0) return;
    setMessage("");
    const dt = new Date();
    chatData.push({ content: message, is_me: true, sent_at: "전송중..." });
    const response = await _axios.post(`/chat/send_message`, {
      post_id: id,
      content: message,
    });
    if (response.data.sent) {
      getData();
    } else {
      chatData.pop();
    }
  }

  return (
    <>
      <FlatList
        data={reversedData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.container}
        inverted // 거꾸로 출력
      />
      <View
        style={{
          marginLeft: 10,
          marginRight: 10,
          marginBottom: 10,
          flexDirection: "row",
        }}
      >
        <TextInput
          value={message}
          onChangeText={setMessage}
          style={{ flex: 1, height: 100, backgroundColor: "#ccc" }}
        ></TextInput>
        <TouchableOpacity
          style={{ backgroundColor: "skyblue", fontSize: 30, color: "#000" }}
          onPress={() => {
            msgSend();
          }}
        >
          <Text>전송</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40, // 여유 공간 추가
  },
});
