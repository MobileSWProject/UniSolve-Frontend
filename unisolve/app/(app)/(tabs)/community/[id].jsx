import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../../../styles/tabs/community/CommunityDetailStyles";

const getData = () => ({
  id: 123,
  private: true,
  user: "천사1004",
  title: "리액트 네이티브 오류 VirtualizedLists should never be nested...",
  content: "외 않 되",
  timestamp: "14분 전",
  image: "https://i.ibb.co/WgmTx24/2024-09-25-2-02-47.png",
  reply: [
    { user: "사자52", timestamp: "3분 전", content: "구글링을 해보십쇼" },
    {
      user: "악어99",
      timestamp: "8분 전",
      content: "오류나는 코드를 알려주세요.",
    },
  ],
});

export default function CommunityDetail() {
  const { id } = useLocalSearchParams();
  const data = getData();

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: data.image }}
        style={styles.image}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{data.title}</Text>
        <View style={styles.privateStatusContainer}>
          <Ionicons
            name={data.private ? "lock-closed" : "earth-sharp"}
            size={16}
            color="#666"
            style={styles.privateStatusIcon}
          />
          <Text style={styles.privateStatusText}>
            {data.private ? "비공개" : "공개"}
          </Text>
        </View>
        <Text style={styles.userInfo}>
          {data.user} • {data.timestamp}
        </Text>
        <Text style={styles.content}>{data.content}</Text>
      </View>
      <View style={styles.replyContainer}>
        <Text style={styles.replyTitle}>댓글 {data.reply.length}개</Text>
        {data.reply.map((reply, index) => (
          <View
            key={index}
            style={styles.replyItem}
          >
            <Text style={styles.replyUser}>{reply.user}</Text>
            <Text style={styles.replyTimestamp}>{reply.timestamp}</Text>
            <Text style={styles.replyContent}>{reply.content}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
