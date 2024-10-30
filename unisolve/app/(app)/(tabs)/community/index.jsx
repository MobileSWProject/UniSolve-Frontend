import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import _axios from "../../../../api";
import List from "../../../../components/tabs/List/List";

export default function Community() {
  const [communitys, setCommunitys] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [filteredCommunitys, setFilteredCommunitys] = useState([]);
  const [process, setProcess] = useState(false);
  const [lastTimestamp, setLastTimestamp] = useState(null);
  const [lastPostId, setLastPostId] = useState(null);

  // useRef를 사용해 onEndReached 이벤트가 중복 호출되는 것을 방지
  const onEndReachedCalledDuringMomentum = useRef(true);

  // 초기 데이터 로드 및 상태 초기화
  useFocusEffect(
    useCallback(() => {
      resetState();
      getList(1, null, null); // 첫 페이지 데이터 가져오기
    }, [])
  );

  const resetState = () => {
    setPage(1);
    setCommunitys([]);
    setFilteredCommunitys([]);
    setLastTimestamp(null);
    setLastPostId(null);
  };

  // 서버에서 데이터 가져오기
  const getList = async (tempPage, timestamp, postId) => {
    if (process || tempPage > totalPage) return; // 중복 요청 및 페이지 초과 방지
    setProcess(true);
  
    try {
      const cleanTimestamp = timestamp ? timestamp.split("·")[0].trim() : ""; // '· 수정됨' 제거
  
      const response = await _axios.get(
        `/posts?page=${tempPage}&last_timestamp=${cleanTimestamp}&last_post_id=${postId || ""}`
      );
  
      setTotalPage(response.data.total_pages);
      const newData = response.data.data || [];
  
      if (tempPage === 1) {
        setCommunitys(newData);
        setFilteredCommunitys(newData);
      } else {
        setCommunitys((prev) => [
          ...prev,
          ...newData.filter((item) => !prev.some((prevItem) => prevItem.id === item.id)),
        ]);
        setFilteredCommunitys((prev) => [
          ...prev,
          ...newData.filter((item) => !prev.some((prevItem) => prevItem.id === item.id)),
        ]);
      }
  
      const lastItem = newData[newData.length - 1];
      if (lastItem) {
        setLastTimestamp(lastItem.timestamp);
        setLastPostId(lastItem.id);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setProcess(false);
    }
  };
  

  // 스크롤 시 다음 페이지 데이터 가져오기
  const refresh = async () => {
    if (process || page >= totalPage) return; // 중복 요청 방지 및 페이지 초과 방지
    const nextPage = page + 1;
    setPage(nextPage);
    await getList(nextPage, lastTimestamp, lastPostId); // 다음 페이지 데이터 요청
  };

  // 검색 기능
  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = communitys.filter((item) =>
      item.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCommunitys(filtered);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 검색창 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="검색어"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {/* 커뮤니티 리스트 */}
      <FlatList
        data={filteredCommunitys}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <List
            item={item}
            index={index}
            count={filteredCommunitys.length}
            type="community"
          />
        )}
        contentContainerStyle={{ paddingTop: 20 }}
        onEndReached={async () => {
          if (!onEndReachedCalledDuringMomentum.current) {
            await refresh(); // 다음 페이지 데이터 요청
            onEndReachedCalledDuringMomentum.current = true;
          }
        }}
        onEndReachedThreshold={0.1} // 트리거 임계값 조정
        onMomentumScrollBegin={() => {
          onEndReachedCalledDuringMomentum.current = false;
        }}
        ListFooterComponent={
          process && <ActivityIndicator size="large" color="#0000ff" />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 20,
    alignItems: "flex-end",
  },
  searchInput: {
    height: 40,
    width: 200,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    margin: 10,
  },
});
