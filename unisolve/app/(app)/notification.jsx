import { Link, usePathname } from "expo-router";
import { ScrollView, Text, FlatList, StyleSheet, View } from "react-native";
import { useState } from "react";
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function Notification() {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState([ //백엔드에서 Array[Object] 형태로 response(Value에서 Type은 상관 없음)
    { id: 1326, type: 0, title: '제목', description: '내용', timestamp: '2024.9.6 07:20', timebefore: '30분 전', check: false },
    { id: 1325, type: 1, title: '곡선의 기울기 관련', description: '곡선의 기울기란', timestamp: '2024.9.5 09:13', timebefore: '22시간 전', check: false },
    { id: 1324, type: 1, title: 'React Native 질문', description: 'React Native에서', timestamp: '2024.8.31 20:18', timebefore: '5일 전', check: true },
  ]); //여기서 description은 게시글의 내용이 아닌, 답변받은 내용입니다.
  const typeConvert = {0: '시스템 알림', 1: '새로운 답변'};
  //각 게시글을 누르면 링크는 다음과 같은 느낌으로 작동한다. //unisolve.com/post/1234 === //localhost:8081/post/1234
  //링크로 접속 시 auth 인증 value가 없으면 Login 화면으로 리다이렉트
  const items = ({ item }) => (
    <View style={[styles.notifications, item.check ? {backgroundColor: '#DADADA'} : {backgroundColor: '#BABABA'}]} href={`post/${item.id}`}>
      <View style={styles.header}>
        <Text style={styles.id}>{!item.check ? <FontAwesome name="circle" size={16} style={{marginRight: 5}} color="gray"/> : null}{typeConvert[item.type]}</Text>
        <Text>{item.timebefore}</Text>
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <View style={styles.header}>
        <Text style={[styles.description, {fontWeight: 'bold'}]}>{item.description}</Text>
        <View style={styles.header}>
          <Text> {item.reply}</Text>
        </View>
      </View>
      <Text style={styles.footer}>{item.timestamp}</Text>
    </View>
  );
  return (
    <ScrollView>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={items}
      />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  notifications: {
    backgroundColor: '#DADADA',
    borderRadius: 15,
    padding: 15,
    marginVertical: 2,
    marginHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  id: {
    fontWeight: 'bold',
    color: '#666',
    fontSize: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    marginTop: 5,
    color: '#666',
  },
  footer: {
    fontSize: 12,
    marginTop: 12,
    fontWeight: 'bold',
    color: '#666',
  }
});