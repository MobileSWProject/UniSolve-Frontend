import { FlatList } from "react-native";
import { useState } from "react";
import List from "../../../../components/tabs/List/List"

export default function Community() {
  // 백엔드에서 Array[Object] 형태로 response(Value에서 Type은 상관 없음)
  // axios에서 받아온 Array[Object] 값을 setCommunitys()를 통해 할당해줍니다.
  const [communitys, setCommunitys] = useState([
    { id: 1324, questioner:'닉네임', title: 'React Native 질문', description: 'React Native에서', timestamp: '2024.8.31 20:18', reply: 0 },
  ]);
  return (
    <FlatList
      data={communitys}
      keyExtractor={item => item.id}
      renderItem={({item, index}) => (<List item={item} index={index} count={communitys.length} type='community'/>)}
    />
  );
}