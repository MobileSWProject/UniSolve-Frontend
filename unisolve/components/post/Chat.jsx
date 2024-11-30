import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { styles } from "../../styles/post/ChatStyle";
import ChatMessage from "./ChatMessage";
import { io } from "socket.io-client";
import _axios from "../../api";
import { useTranslation } from "react-i18next";
import "../../i18n";
import useUserId from "../../hooks/useUserId";
import DropDownPicker from "react-native-dropdown-picker";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { FlatList } from "react-native-gesture-handler";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";

export default function CommunityChat({ sheetRef, setMode, post, snackBar }) {
  const { t } = useTranslation();
  const { userId, loading } = useUserId();
  const [chatData, setChatData] = useState([]);
  const [message, setMessage] = useState("");
  const [categoryLoad, setCategoryLoad] = useState(false);
  const socket = useRef(null);
  const flatListRef = useRef(null); // FlatList 참조 생성
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [items, setItems] = useState([{ label: "선택안함", value: 0 }]);
  const [ban, setBan] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isAI, setIsAI] = useState(true);
  const [room, setRoom] = useState("0");

  

  // 스크롤 아래로 내리기
  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  };

  // 카테고리에서 아이템 선택했을 때
  const selectValue = async (value) => {
    setRoom(String(value));
    setChatData([]);
    setCategoryLoad(false);
  };

  // post 상태에 따라 카테고리를 로드할 것인지, Room 을 세팅할 것인지
  useEffect(() => {
    const loadCategory = async () => {
      const response = await _axios.get(`/chat/messages?post_id=${0}`);
      setBan(response.data.ban || false);
      setIsPrivate(response.data.is_private || false);
      setItems(response.data.data);
    };

    if (String(post) === "0") loadCategory();
    else setRoom(String(post));
  }, [post]);

  // Room이 세팅되면 채팅 불러오고, 소켓 연결하기
  useEffect(() => {
    const loadChatHistory = async () => {
      console.log("채팅 불러오기");
      try {
        const response = await _axios.get(`/chat/messages?post_id=${room}`);
        setChatData(response.data.data.reverse());
        setBan(response.data.ban || false);
        setIsPrivate(response.data.is_private || false);
        scrollToBottom();
      } catch (error) {
        console.error("Failed to load existing messages:", error);
      }
    };

    const initializeSocket = async () => {
      // 기존 소켓 연결 해제
      if (socket.current) {
        console.log("기존 소켓 연결 끊기");
        const token = await AsyncStorage.getItem("token");
        socket.current.emit("leave", { room, token });
        socket.current.disconnect();
      }

      console.log("소켓 연결하기");
      if (loading) return;
      socket.current = io(process.env.EXPO_PUBLIC_SERVER_BASE_URL);
      const token = await AsyncStorage.getItem("token");

      console.log("소켓 연결하기2");
      socket.current.emit("join", { room, token });
      console.log("소켓 연결하기3");

      socket.current.on("receive_message", (data) => {
        console.log("Received data:", data);

        setChatData((prevData) => {
          const updatedData = [...prevData]; // 기존 데이터를 복사
          const existingIndex = updatedData.findIndex(
            (item) => item.time_id === data.time_id
          );

          if (existingIndex !== -1) {
            // 기존 데이터가 존재하면 해당 인덱스의 데이터를 새 데이터로 교체
            updatedData[existingIndex] = {
              ...data,
              is_me: data.sender === userId,
            };
          } else {
            // 기존 데이터가 없으면 새 데이터 추가
            updatedData.unshift({
              ...data,
              is_me: data.sender === userId,
            });
          }

          return updatedData;
        });
      });

      socket.current.on("error", (data) => {
        console.error("Error:", data.msg);
      });
    };

    // room 이 세팅되었을 때 and user가 불러와졌을 때
    if (room !== "0" && loading === false) {
      // 채팅 내역 불러오기
      loadChatHistory();

      // 소켓 연결하기
      initializeSocket();
    }
  }, [room, loading]);

  // 데이터 포맷?
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

  // 메세지 보내기
  async function msgSend() {
    if (!message || message.length <= 0) return;

    const time_id = `${Date.now()}-${userId}`;
    setMessage("");
    scrollToBottom();
    chatData.unshift({
      content: message,
      is_me: true,
      sent_at: t("Function.sending"),
      is_ai: isAI,
      time_id: time_id,
    });

    const token = await AsyncStorage.getItem("token");
    socket.current.emit("send_message", {
      room,
      message,
      token,
      time_id: time_id,
    });
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{height: "100%"}}>
      {String(post) === "0" ? (
        <View style={{ alignItems: "center", zIndex: 99, minHeight: open ? 250 : 60}}>
          <View style={{ width: "93%" }}>
            <DropDownPicker
              style={{ borderWidth: 1.4 }}
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              maxHeight={200}
              onChangeValue={(value) => selectValue(value)}
              itemKey="value"
              // listMode="SCROLLVIEW"
            />
          </View>
        </View>
      ) : null}
      <View style={{ 
        flex: 1,
      }}>
        <FlatList
          ref={flatListRef} // FlatList 참조 추가
          data={chatData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString() || "0"}
          contentContainerStyle={styles.container}
          // onContentSizeChange={scrollToBottom} // 메시지 수가 변경되면 스크롤 이동
          inverted
        />
      </View>
      <View style={styles.inputContainer}>
        {!ban && isPrivate ? (
          <>
            <TouchableOpacity
              style={{
                height: 30,
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
              hitSlop={4}
              onPress={() => {
                setIsAI(!isAI);
              }}
            >
              <MaterialCommunityIcons
                name={isAI ? "checkbox-marked" : "checkbox-blank-outline"}
                size={24}
              />
              <View>
                <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                  AI와 대화
                </Text>
              </View>
            </TouchableOpacity>
          </>
        ) : null}
        <BottomSheetTextInput
          style={styles.textInput}
          disabled={ban || !isPrivate}
          placeholder={
            ban
              ? t("Function.forbidden")
              : !isPrivate
              ? "게시글이 비공개인 상태에서만 대화할 수 있습니다."
              : t("Function.input_content")
          }
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
        <TouchableOpacity
          disabled={ban || !isPrivate}
          onPress={() => msgSend(true)}
          style={[
            styles.sendButton,
            { backgroundColor: ban || !isPrivate ? "gray" : null },
          ]}
        >
          <Text style={{ fontWeight: 600 }}>{t("Function.send")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
