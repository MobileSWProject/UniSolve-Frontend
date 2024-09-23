import { Link, usePathname } from "expo-router";
import { ScrollView, Text, FlatList, StyleSheet, View } from "react-native";
import { useState } from "react";
import Entypo from '@expo/vector-icons/Entypo';

export default function Community() {
  const pathname = usePathname();
  const [communitys, setCommunitys] = useState([ //백엔드에서 Array[Object] 형태로 response(Value에서 Type은 상관 없음)
    { id: 1324, questioner:'닉네임', title: 'React Native 질문', description: 'React Native에서', timestamp: '2024.8.31 20:18', reply: 0 },
  ]);
  //각 게시글을 누르면 링크는 다음과 같은 느낌으로 작동한다. //unisolve.com/post/1234 === //localhost:8081/post/1234
  //링크로 접속 시 auth 인증 value가 없으면 Login 화면으로 리다이렉트
  const items = ({ item }) => (
    <View style={styles.communitys} href={`post/${item.id}`}>
      <View style={styles.header}>
        <Text style={styles.id}>{item.questioner}</Text>
        <Text>{item.timestamp}</Text>
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <View style={styles.header}>
        <Text style={[styles.description, {fontWeight: 'bold'}]}>{item.description}</Text>
        <View style={styles.header}>
          <Entypo name="new-message" size={16} color="gray"/>
          <Text> {item.reply}</Text>
        </View>
      </View>
    </View>
  );
  return (
    <ScrollView>
      <FlatList
        data={communitys}
        keyExtractor={item => item.id}
        renderItem={items}
      />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  communitys: {
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
    color: '#333'
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
});