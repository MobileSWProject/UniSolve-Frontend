import { View, FlatList, ActivityIndicator } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import List from "../../../components/tabs/List/List";
import _axios from "../../../api";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [process, setProcess] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setNotifications([]);
      setPage(1);
      getList(1);
    }, [])
  );
  const getList = async (tempPage) => {
    if (process) return;
    setProcess(true);
    try {
      const response = await _axios.get(`/notifications/mine?page=${tempPage}`);
      setTotalPage(response.data.total_pages);
      const reversedData = response.data.data || [];
      if (tempPage === 1) {
        setNotifications(reversedData);
      } else {
        setNotifications((prevCommunitys) => [
          ...prevCommunitys,
          ...reversedData,
        ]);
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
    <View>
      <FlatList
        style={{ width: 500, height: 600 }}
        data={notifications}
        keyExtractor={(item) => item.not_id}
        renderItem={({ item, index }) => (
          <List
            item={item}
            index={index}
            count={notifications.length}
            type="notification"
          />
        )}
        contentContainerStyle={{ paddingTop: 20 }}
        onEndReached={refresh}
        ListFooterComponent={
          process && (
            <ActivityIndicator
              size="large"
              color="#0000ff"
            />
          )
        }
        onEndReachedThreshold={0.05}
      />
    </View>
  );
}
