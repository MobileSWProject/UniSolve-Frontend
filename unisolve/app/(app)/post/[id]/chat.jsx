import { useState, useEffect, useRef } from "react";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import ChatMessage from "../../../../components/post/ChatMessage";
import { io } from "socket.io-client";
import _axios from "../../../../api";
import { useTranslation } from "react-i18next";
import "../../../../i18n";
import useUserId from "../../../../hooks/useUserId";

export default function CommunityChat() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const { userId, loading } = useUserId();
  const [chatData, setChatData] = useState([]);
  const [message, setMessage] = useState("");
  const socket = useRef(null);
  const flatListRef = useRef(null); // FlatList 참조 생성

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const loadExistingMessages = async () => {
    try {
      const response = await _axios.get(`/chat/messages?post_id=${id}`);
      if (response.data && response.data.data) {
        setChatData(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load existing messages:", error);
    }
  };

  useEffect(() => {
    const initializeSocket = async () => {
      if (loading) return;
      socket.current = io(process.env.EXPO_PUBLIC_SERVER_BASE_URL);
      const token = await AsyncStorage.getItem("token");

      socket.current.emit("join", { room: id, token });

      socket.current.on("receive_message", (data) => {
        const isMe = data.sender === userId;
        setChatData((prevData) => [...prevData, { ...data, is_me: isMe }]);
      });

      socket.current.on("error", (data) => {
        console.error("Error:", data.msg);
      });
    };

    loadExistingMessages();
    initializeSocket();

    return () => {
      if (socket.current) {
        socket.current.emit("leave", { room: id });
        socket.current.disconnect();
      }
    };
  }, [id, userId, loading]);

  // chatData가 변경될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    scrollToBottom();
  }, [chatData]);

  const renderItem = ({ item }) => (
    <ChatMessage
      me={item.is_me}
      sender={item.sender || "NULL"}
      content={item.content}
      sent_at={item.sent_at}
    />
  );

  async function msgSend() {
    if (!message || message.length <= 0) return;
    setMessage("");
    const token = await AsyncStorage.getItem("token");

    socket.current.emit("send_message", { room: id, message, token });
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        ref={flatListRef} // FlatList 참조 추가
        data={chatData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.container}
        onContentSizeChange={scrollToBottom} // 메시지 수가 변경되면 스크롤 이동
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          style={styles.textInput}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={msgSend}
        >
          <Text>{t("Function.send")}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  inputContainer: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    flexDirection: "row",
  },
  textInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#ccc",
    paddingHorizontal: 10,
  },
  sendButton: {
    backgroundColor: "skyblue",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
});
