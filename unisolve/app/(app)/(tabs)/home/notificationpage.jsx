import { FlatList } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import List from "../../../../components/tabs/List/List"
import _axios from '../../../../api';

export default function Notification() {
  // 백엔드에서 Array[Object] 형태로 response(Value에서 Type은 상관 없음)
  // axios에서 받아온 Array[Object] 값을 setNotifications()를 통해 할당해줍니다.
  const [notifications, setNotifications] = useState([
    { id: 1326, type: 0, title: '제목', description: '내용', timestamp: '2024.9.6 07:20', timebefore: '30분 전', check: false },
    { id: 1325, type: 1, title: '곡선의 기울기 관련', description: '곡선의 기울기란', timestamp: '2024.9.5 09:13', timebefore: '22시간 전', check: false },
    { id: 1324, type: 1, title: 'React Native 질문', description: 'React Native에서', timestamp: '2024.8.31 20:18', timebefore: '5일 전', check: true },
  ]); //여기서 description은 게시글의 내용이 아닌, 답변받은 내용입니다.
  useFocusEffect(
    useCallback(() => {
      _axios.get('/notification').then(response => {
        setNotifications(response.data || []);
      })
      .catch(error => {
        setNotifications([]);
      })
    }, [])
  );
  return (
    <FlatList
      data={notifications}
      keyExtractor={item => item.id}
      renderItem={({item, index}) => (<List item={item} index={index} count={notifications.length} type='notification'/>)}
    />
  );
}