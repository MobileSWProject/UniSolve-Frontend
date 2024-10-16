import { View, FlatList, ActivityIndicator } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import List from "../../../../components/tabs/List/List"
import _axios from "../../../../api";

export default function Notification() {
  const [notifications, setNotifications] = useState([
    // { id: 1326, type: 0, title: '제목', description: '내용', timestamp: '2024.9.6 07:20', timebefore: '30분 전', check: false },
    // { id: 1325, type: 1, title: '곡선의 기울기 관련', description: '곡선의 기울기란', timestamp: '2024.9.5 09:13', timebefore: '22시간 전', check: false },
    // { id: 1324, type: 1, title: 'React Native 질문', description: 'React Native에서', timestamp: '2024.8.31 20:18', timebefore: '5일 전', check: true },
  ]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [process, setProcess] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      getList(1);
      setNotifications([]);
    }, [])
  );
  const getList = async (tempPage) => {
    if (process) return;
    setProcess(true);
    try {
      const response = await _axios.get(`/notification?page=${tempPage}`);
      setTotalPage(response.data.total_pages);
      const reversedData = response.data.data || [];
      if (tempPage === 1) {
        setNotifications(reversedData);
      } else {
        setNotifications((prevCommunitys) => [...prevCommunitys, ...reversedData]);
      }
    } catch (error) {
      setNotifications([]);
    } finally {
      setProcess(false);
    }
  };

  const refresh = async () => {
    let nextPage = page + 1;
    if (nextPage > totalPage || process) return;
    setPage(nextPage);
    await getList(nextPage);
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item, index}) => (<List item={item} index={index} count={notifications.length} type='notification'/>)}
        contentContainerStyle={{ paddingTop: 20 }}
        onEndReached={refresh}
        ListFooterComponent={
          process && <ActivityIndicator size="large" color="#0000ff" />
        }
        onEndReachedThreshold={0.05}
      />
    </View>
  );
}