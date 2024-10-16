import { FlatList, View, ActivityIndicator} from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import List from "../../../../components/tabs/List/List";
import _axios from "../../../../api";

export default function History() {
  const [historys, setHistorys] = useState([
    // {
    //   id: 1326,
    //   private: true,
    //   user: "",
    //   title: "제목",
    //   description: "내용",
    //   timestamp: "3시간 전",
    //   reply: 2,
    // }, //1:1 and 별도 지정 안함
    // {
    //   id: 1325,
    //   private: true,
    //   user: "홍길동",
    //   title: "곡선의 기울기 관련",
    //   description: "곡선의 기울기란",
    //   timestamp: "22시간 전",
    //   reply: 2,
    // }, //1:1 and 지정됨
    // {
    //   id: 1324,
    //   private: false,
    //   user: "",
    //   title: "React Native 질문",
    //   description: "React Native에서",
    //   timestamp: "2024.8.31 20:18",
    //   reply: 0,
    // }, //공개(커뮤니티에 보임)
  ]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [process, setProcess] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      getList(1);
    }, [])
  );
  const getList = async (tempPage) => {
    if (process) return;
    setProcess(true);
    try {
      const response = await _axios.get(`/history?page=${tempPage}`);
      setTotalPage(response.data.total_pages);
      const reversedData = response.data.data || [];
      if (tempPage === 1) {
        setHistorys(reversedData);
      } else {
        setHistorys((prevHistorys) => [...prevHistorys, ...reversedData]);
      }
    } catch (error) {
      setHistorys([]);
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
      {/* 커뮤니티 리스트 */}
      <FlatList
        data={historys}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <List
            item={item}
            index={index}
            count={historys.length}
            type="history"
          />
        )}
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