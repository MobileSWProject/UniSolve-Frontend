import { View, Text, TouchableOpacity } from "react-native";
import styles from "../../../styles/tabs/List/ListStyles";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import formatAuthor from "../../../utils/formatAuthor";
import _axios from "../../../api";

export default function PostListItem({ item, index, count, type }) {
  const typeConvert = {
    0: "시스템 알림",
    1: "새로운 질문",
    2: "새로운 답변",
    3: "새로운 댓글",
    4: "새로운 대댓글",
  };
  const router = useRouter();

  const updateNotification = async (id) => {
    try {
      const response = await _axios.patch(`/notification/${id}`, {
        is_read: true,
      });
    } catch (error) {}
  };

  return (
    <TouchableOpacity
      style={[
        styles.main,
        (type === "history" && item.private) ||
        (type === "notification" && !item.check)
          ? { backgroundColor: "#BABABA" }
          : null,
      ]}
      onPress={async () => {
        if (type === "notification") await updateNotification(item.not_id);
        router.push(`post/${item.id}`);
      }}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.id,
            type === "notification" ? { color: "#666", fontSize: 14 } : null,
          ]}
        >
          {type === "notification" && !item.check ? (
            <FontAwesome
              name="circle"
              size={16}
              style={{ marginRight: 5 }}
              color="gray"
            />
          ) : null}
          {type === "community"
            ? `#${item.id} | by ${formatAuthor(
                item.author_nickname || `${item.questioner}_temp_nickname`
              )}`
            : type === "history"
            ? `#${item.id} | ${item.private ? "비공개" : "공개"}`
            : type === "notification"
            ? typeConvert[item.type]
            : null}
        </Text>
        <Text>
          {type === "notification" ? item.timebefore : item.timestamp}
        </Text>
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <View style={styles.header}>
        <Text
          style={[styles.description, { fontWeight: "bold" }]}
          numberOfLines={3}
        >
          {item.description ? item.description.replace(/\n/g, " ") : ""}
        </Text>
        <View style={styles.header}>
          {type !== "notification" ? (
            <Entypo
              name="new-message"
              size={16}
              color="gray"
            />
          ) : null}
          <Text> {item.reply_count}</Text>
        </View>
      </View>
      {type === "notification" ? (
        <Text style={styles.footer}>{item.timestamp}</Text>
      ) : null}
    </TouchableOpacity>
  );
}
