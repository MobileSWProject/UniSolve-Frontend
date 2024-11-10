import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, FlatList, StyleSheet } from "react-native";
import ChatMessage from "./ChatMessage";
import { io } from "socket.io-client";
import _axios from "../../api";
import { useTranslation } from "react-i18next";
import "../../i18n";
import useUserId from "../../hooks/useUserId";
import Input from "../../components/form/Input";

export default function CommunityChat({ sheetRef, setMode, post, snackBar }) {
  const { t } = useTranslation();
  const { userId, loading } = useUserId();
  const [chatData, setChatData] = useState([]);
  const [message, setMessage] = useState("");
  const socket = useRef(null);
  const flatListRef = useRef(null); // FlatList 참조 생성

  const [ban, setBan] = useState(false);

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const loadExistingMessages = async () => {
    try {
      const response = await _axios.get(`/chat/messages?post_id=${post}`);
      if (response.data && response.data.data) {
        setBan(response.data.ban || false);
        setChatData(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load existing messages:", error);
    }
  };

  function checkDate(sentDt) {
    if (!sentDt || isNaN(new Date(sentDt))) return sentDt;
    sentDt = new Date(sentDt);
    const nowDt = new Date();
    let resultDate = "";
    function pad(text) {
      return String(text).padStart(2, "0");
    }
    if (nowDt.getFullYear() !== sentDt.getFullYear()) {
      resultDate += `${sentDt.getFullYear()}`;
    }
    if (nowDt.getDate() !== sentDt.getDate()) {
      resultDate += `${resultDate.length ? "-" : ""}${pad(
        Number(sentDt.getMonth()) + 1
      )}-${pad(sentDt.getDate())}`;
    }
    resultDate += `${resultDate.length ? " " : ""}${pad(
      sentDt.getHours()
    )}:${pad(sentDt.getMinutes())}`;
    return resultDate;
  }

  useEffect(() => {
    const initializeSocket = async () => {
      if (loading) return;
      socket.current = io(process.env.EXPO_PUBLIC_SERVER_BASE_URL);
      const token = await AsyncStorage.getItem("token");

      socket.current.emit("join", { room: post, token });

      socket.current.on("receive_message", (data) => {
        setChatData((prevData) => {
          const updatedData = [...prevData];
          if (updatedData.length > 0) {
            updatedData[updatedData.length - 1] = {
              ...updatedData[updatedData.length - 1],
              sent_at: checkDate(data.sent_at) || "",
            };
          }
          if (!(updatedData[updatedData.length - 1].content === data.content)) { 
            const isMe = data.sender === userId;
            updatedData.push({ ...data, is_me: isMe });
          }
          return updatedData;
        });
      });

      socket.current.on("error", (data) => {
        console.error("Error:", data.msg);
      });
    };

    loadExistingMessages();
    initializeSocket();

    return () => {
      if (socket.current) {
        socket.current.emit("leave", { room: post });
        socket.current.disconnect();
      }
    };
  }, [post, userId, loading]);

  // chatData가 변경될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    scrollToBottom();
  }, [chatData]);

  const renderItem = ({ item }) => (
    <ChatMessage
      me={item.is_me}
      sender={item.sender || "NULL"}
      content={item.content}
      sent_at={checkDate(item.sent_at) || ""}
    />
  );

  async function msgSend() {
    if (!message || message.length <= 0) return;
    setMessage("");
    chatData.push({
      content: message,
      is_me: true,
      sent_at: t("Function.sending"),
    });

    const token = await AsyncStorage.getItem("token");

    socket.current.emit("send_message", { room: post, message, token });
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
        <Input
          placeholder={
            ban ? t("Function.forbidden") : t("Function.input_content")
          }
          content={message}
          onChangeText={(text) => setMessage(text)}
          buttonText={t("Function.send")}
          buttonOnPress={() => msgSend(true)}
        />
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
    bottom: 0,
    position: "absolute",
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
