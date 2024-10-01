import { FlatList } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import List from "../../../../components/tabs/List/List"
import _axios from '../../../../api';

export default function History() {
  // 백엔드에서 Array[Object] 형태로 response(Value에서 Type은 상관 없음)
  // axios에서 받아온 Array[Object] 값을 setHistorys()를 통해 할당해줍니다.
  const [historys, setHistorys] = useState([
    { id: 1326, private: true, user:'', title: '제목', description: '내용', timestamp: '3시간 전', reply: 2 }, //1:1 and 별도 지정 안함
    { id: 1325, private: true, user:'홍길동', title: '곡선의 기울기 관련', description: '곡선의 기울기란', timestamp: '22시간 전', reply: 2 }, //1:1 and 지정됨
    { id: 1324, private: false, user:'', title: 'React Native 질문', description: 'React Native에서', timestamp: '2024.8.31 20:18', reply: 0 }, //공개(커뮤니티에 보임)
  ]);
  useFocusEffect(
    useCallback(() => {
      _axios.get('/history').then(response => {
        setHistorys(response.data.data || []);
      })
      .catch(error => {
        setHistorys([]);
      })
    }, [])
  );
  return (
    <FlatList
      data={historys}
      keyExtractor={item => item.id}
      renderItem={({ item, index }) => (<List item={item} index={index} count={historys.length} type='history'/>)}
    />
  );
}