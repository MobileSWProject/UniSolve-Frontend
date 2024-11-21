import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../../../styles/tabs/List/ListStyles";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import formatAuthor from "../../../utils/formatAuthor";
import _axios from "../../../api";
import { useTranslation } from 'react-i18next';
import "../../../i18n";

export default function PostListItem({ item, type, bottomView, setVisible, setUser, getList }) {
  const { t } = useTranslation();
  const router = useRouter();

  const updateNotification = async (id) => {
    try {
      await _axios.put(`/notifications/${id}`, { is_read: true });
    } catch {}
  };

  async function invite(post, isGo) {
    const response = await _axios.post('notifications/send_partner_notification', {not_id: post, acc_deny: isGo})
    if (response.data){
      getList(1);
      console.log("good")
    }
  }

  return (
    <TouchableOpacity
      style={[
        styles.main,
        (type === "history" && item.private) || (type === "notification" && !item.check) || (type === "users") ?
        { backgroundColor: "#BABABA" } :
        null,
      ]}
      onPress={async () => {
        if (setVisible) setVisible(false);
        if (type === "users") return setUser(item.user_nickname);
        if (type === "sanction") null
        else if (type === "notification") {
          await updateNotification(item.not_id);
          router.push(`community?post=${item.id}`);
        }
        else if (type === "community") {
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
        <Text style={[ styles.id, type === "notification" ? { color: "#666", fontSize: 14 } : null ]}>
          {
            type === "notification" && !item.check ?
            <FontAwesome name="circle" size={16} style={{ marginRight: 5 }} color="gray"/> :
            null
          }
          {
            type === "community" ?
            `#${item.id} | by ${formatAuthor(item.author_nickname || `${item.questioner}_temp_nickname`)}` :
              type === "history" ?
              `#${item.id} | ${item.private ? t("Function.private") : t("Function.public")}` :
                type === "notification" ?
                t(`Function.notification_${item.type}`) :
                  type === "sanction" ?
                  `${t(`User.sanction_${item.type}`)}\n${t("User.sanction_start")}: ${item.created_at}\n${t("User.sanction_end")}: ${item.end_at}\n${t("User.sanction_content")}: ${item.content || t("User.sanction_empty")}` :
                  null
          }
        </Text>
        <Text>
          {type === "notification" ? item.timebefore : item.timestamp}
          {type === "users" ? item.user_nickname : ''}
        </Text>
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <View style={styles.header}>
        {item.type === 1 && item.description === "invite" ? 
        <>
          <TouchableOpacity style={[styles.buttonSmall, { backgroundColor: "blue" }]} onPress={() => {invite(item.not_id, true)}}>
            <Text style={styles.buttonTextSmall}>수락</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.buttonSmall, { backgroundColor: "red" }]} onPress={() => {invite(item.not_id, false)}}>
            <Text style={styles.buttonTextSmall}>거절</Text>
          </TouchableOpacity>
        </> :
        <Text style={[styles.description, { fontWeight: "bold" }]} numberOfLines={3}>{item.description ? item.description.replace(/\n/g, " ") : ""}</Text>}
        <View style={styles.header}>
          {
            type === "history" || type === "community" ?
            <Entypo name="new-message" size={16} color="#ccc"/> :
            null
          }
          <Text> {item.reply_count}</Text>
        </View>
      </View>
      {
        type === "notification" ? 
        <Text style={styles.footer}>{item.timestamp}</Text> :
        null
      }
    </TouchableOpacity>
  );
}
