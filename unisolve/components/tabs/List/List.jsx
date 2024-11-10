import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../../../styles/tabs/List/ListStyles";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import formatAuthor from "../../../utils/formatAuthor";
import _axios from "../../../api";

import { useTranslation } from 'react-i18next';
import "../../../i18n";

export default function PostListItem({ item, index, count, type, bottomView, setVisible }) {
  const { t } = useTranslation();
  const router = useRouter();

  const updateNotification = async (id) => {
    try {
      await _axios.put(`/notifications/${id}`, {
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
        if (setVisible) setVisible(false);
        if (type === "notification") await updateNotification(item.not_id);
        if (type === "community") {
          bottomView.sheetRef.current?.collapse();
          bottomView.setMode("post");
          bottomView.setPostID(item.id);
          bottomView.sheetRef.current?.expand();
        } else {
          router.push(`community?post=${item.id}`);
        }
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
            ? `#${item.id} | ${item.private ? t("Function.private") : t("Function.public")}`
            : type === "notification"
            ? t(`Function.notification_${item.type}`)
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
              color="#ccc"
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
