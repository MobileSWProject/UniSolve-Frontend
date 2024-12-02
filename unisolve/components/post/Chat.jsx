import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, TouchableOpacity, ActivityIndicator, Platform } from "react-native";
import { styles } from "../../styles/post/ChatStyle";
import ChatMessage from "./ChatMessage";
import { io } from "socket.io-client";
import _axios from "../../api";
import { useTranslation } from "react-i18next";
import "../../i18n";
import useUserId from "../../hooks/useUserId";
import DropDownPicker from "react-native-dropdown-picker";
import { FlatList } from "react-native-gesture-handler";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { mainColor } from "../../constants/Colors";
import SwitchBtn from "../form/Switch";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';

export default function CommunityChat({ setMode, post, setPost, snackBar, setModalVisible, setModalType, setViewMessage, setLagacy }) {
  const { t } = useTranslation();
  const { userId, loading } = useUserId();
  const [chatData, setChatData] = useState([]);
  const [message, setMessage] = useState("");
  const [categoryLoad, setCategoryLoad] = useState(false);
  const socket = useRef(null);
  const flatListRef = useRef(null); // FlatList 참조 생성
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [items, setItems] = useState([{ label: t("Function.noSelect"), value: 0 }]);
  const [ban, setBan] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isAI, setIsAI] = useState(false);
  const [room, setRoom] = useState("0");
  const [AICheck, setAICheck] = useState(false);
  const [AICount, setAICount] = useState(0);
  const [sendProcess, setSendProcess] = useState(false);
  

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
      setItems([{ label: t("Function.noSelect"), value: 0 }, ...response.data.data]);
    };

    if (String(post) === "0") loadCategory();
    else setRoom(String(post));
  }, [post]);

  // Room이 세팅되면 채팅 불러오고, 소켓 연결하기
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        await aiCheck();
        const response = await _axios.get(`/chat/messages?post_id=${room}`);
        setChatData(response.data.data.reverse());
        setBan(response.data.ban || false);
        setIsPrivate(response.data.is_private || false);
        scrollToBottom();
      } catch (error) {
        snackBar(`${t(`Stage.failed`)} [${error.response.status}] ${t(`Status.${error.response.status}`)}`);
      }
    };

    const initializeSocket = async () => {
      // 기존 소켓 연결 해제
      if (socket.current) {
        const token = await AsyncStorage.getItem("token");
        socket.current.emit("leave", { room, token });
        socket.current.disconnect();
      }

      if (loading) return;
      socket.current = io(process.env.EXPO_PUBLIC_SERVER_BASE_URL);
      const token = await AsyncStorage.getItem("token");

      socket.current.emit("join", { room, token });

      socket.current.on("receive_message", (data) => {
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

      socket.current.on("error", (data) => {});
    };

    // room 이 세팅되었을 때 and user가 불러와졌을 때
    if (room !== "0" && loading === false) {
      // 채팅 내역 불러오기
      loadChatHistory();

      // 소켓 연결하기
      initializeSocket();
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    }

  }, [room, loading]);  

  // 날짜 및 시간 변환
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
      resultDate += `${resultDate.length ? "-" : ""}${pad(Number(sentDt.getMonth()) + 1)}-${pad(sentDt.getDate())}`;
    }
    resultDate += `${resultDate.length ? " " : ""}${pad(sentDt.getHours())}:${pad(sentDt.getMinutes())}`;
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
      exp={item.exp}
      setModalVisible={setModalVisible}
      setModalType={setModalType}
      setViewMessage={setViewMessage}
    />
  );

  async function aiCheck () {
    const response = await _axios.get(`chat/can_ai_chat?post_id=${room}`)
    if (response) {
      setAICheck(response.data.can_request ?? false);
      setAICount(response.data.aicount ?? 15);
    } else return setAICheck(false);
  }

  function checkFile(type) {
    if (type === "!") {
      if (!(message.startsWith("data:image/png") || message.startsWith("file:///"))) {
        return true;
      }
    }
    else if (type) {
      if (message.startsWith("data:image/png") || message.startsWith("file:///")) {
        return true;
      }
    }
    return false;
  }

  async function convertBase64(message) {
    if (Platform.OS === "web") return message;
    if (checkFile(true)) {
      return `data:image/png;base64,${await FileSystem.readAsStringAsync(message, { encoding: FileSystem.EncodingType.Base64 })}`
    }
  };

  // 메세지 보내기
  async function msgSend() {
    if (sendProcess) return;
    if (!message || message.length <= 0) {
      snackBar(`${t("Stage.failed")} ${t("Function.empty")}`);
      return;
    }
    setSendProcess(true);
    await aiCheck();
    const time_id = `${Date.now()}-${userId}`;
    setMessage("");
    scrollToBottom();

    chatData.unshift({
      content: checkFile(true) ? `${t("Function.image")} ${t("Function.file")}` : message,
      is_me: true,
      sent_at: t("Function.sending"),
      is_ai: isAI,
      time_id: time_id,
      image: checkFile(true) ? await convertBase64(message) : "",
    });

    if (isAI) {
      setAICount(AICount + 1);
      if (AICount + 1 >= 15) {
        setIsAI(false);
      }
    }
    const token = await AsyncStorage.getItem("token");
    socket.current.emit("send_message", {
      room,
      message: checkFile(true) ? "" : message,
      token,
      time_id: time_id,
      is_ai: isAI,
      be_ip: process.env.EXPO_PUBLIC_SERVER_BASE_URL,
      image: checkFile(true) ? await convertBase64(message) : "",
    });
    setSendProcess(false);
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={mainColor}/>
      </View>
    );
  }

  const BtnHandleFunctions = {
    // 사진 촬영하기
    takePhoto: async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        snackBar(`${t("Stage.failed")} ${t("Function.permission_camera")}`);
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });
      if (!result.canceled) {
        setMessage(result.assets[0].uri);
      }
    },
    // 사진 첨부하기
    attachPhoto: async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        snackBar(`${t("Stage.failed")} ${t("Function.permission_image")}`);
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });
      if (!result.canceled) {
        setMessage(result.assets[0].uri);
      }
    },
  };

  return (
    <View style={{height: "95%"}}>
      {
        String(post) === "0" ?
        <View style={{ alignItems: "center", zIndex: 99, minHeight: open ? 250 : 60}}>
          <View style={{ width: "98%" }}>
            {
              value > 1 ?
              <TouchableOpacity
                style={{ backgroundColor: mainColor, marginBottom: 5, borderRadius: 5 }}
                onPress={() => { setPost(value); setLagacy(true); setMode("post"); }}
              >
                <Text style={{ color: "#FFF", fontSize: 20, fontWeight: "bold", textAlign: "center", marginVertical: 3 }}>{`${t("Function.post")} ${t("Function.view")}`}</Text>
              </TouchableOpacity> :
              null
            }
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
        </View> :
        null
      }
      <View style={{ flex: 1 }}>
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
      {
        !ban && isPrivate && checkFile("!") ?
        <View style={{ display: "flex", flexDirection: "row"}}>
          <SwitchBtn
            disabled={sendProcess || !AICheck || AICount >= 15}
            setValue={setIsAI}
            value={isAI}
          />
          <View>
            <Text style={{ fontSize: 14, fontWeight: "bold", color: !AICheck || AICount >= 15 ? "#BBBBBB" : isAI ? mainColor : "#000" }}>{t("Function.AI")}</Text>
            {
              !AICheck ? <Text style={{ fontSize: 12, fontWeight: "bold", color: "#FF0000" }}>({t("Function.AI_failed")})</Text> :
              <Text style={{ fontSize: 12, fontWeight: "bold", color: "#FF0000" }}>{`${15-AICount < 0 ? 0 : 15-AICount}${t("Function.AI_count")}`}</Text>
            }
          </View>
        </View> :
        null
      }
        <BottomSheetTextInput
          style={styles.textInput}
          disabled={sendProcess || ban || !isPrivate || checkFile(true)}
          placeholder=
          {
            ban ?
            t("Function.forbidden") :
            !isPrivate ?
            t("Function.post_private") :
            t("Function.input_content")
          }
          value={checkFile(true) ? t("Function.chat_image") : message}
          onChangeText={(text) => { 
            if (ban || !isPrivate || checkFile(true)) return;
            else {
              setMessage(text);
            }
          }}
          multiline={true}
        />
        {
          !ban && isPrivate && checkFile("!") ?
          <>
            <TouchableOpacity style={[styles.submitButton, { height: 30, width: 30 }]} onPress={BtnHandleFunctions.takePhoto}>
              <Text style={styles.submitButtonText}>
                <FontAwesome name="camera" size={24} color={mainColor}/>
              </Text>
            </TouchableOpacity>
            {/* 사진 버튼 */}
            <TouchableOpacity style={[styles.submitButton, { height: 30, width: 30 }]} onPress={BtnHandleFunctions.attachPhoto} >
              <Text style={styles.submitButtonText}>
                <FontAwesome name="photo" size={24} color={mainColor}/>
              </Text>
            </TouchableOpacity>
          </> :
          !ban && isPrivate && checkFile(true) ?
          <TouchableOpacity style={[styles.submitButton, { height: 30, width: 30 }]} onPress={() => {setMessage("")}} >
            <Text style={styles.submitButtonText}>
              <FontAwesome name="remove" size={24} color={mainColor}/>
            </Text>
          </TouchableOpacity> :
          null
        }
        <TouchableOpacity
          disabled={ban || !isPrivate}
          onPress={() => msgSend(true)}
          style={[styles.sendButton, { backgroundColor: ban || !isPrivate ? "gray" : null }]}
        >
          <Text style={{ fontWeight: 600 }}>{t("Function.send")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
