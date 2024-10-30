import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
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
  const [process, setProcess] = useState(false); // 요청 중인지 여부
  const [lastTimestamp, setLastTimestamp] = useState(null);
  const [lastPostId, setLastPostId] = useState(null);

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
      const response = await _axios.get(
        `/posts?page=${tempPage}&last_timestamp=${timestamp || ""}&last_post_id=${postId || ""}`
      );

      setTotalPage(response.data.total_pages);
      const newData = response.data.data || [];

      // 첫 페이지라면 데이터 초기화
      if (tempPage === 1) {
        setCommunitys(newData);
        setFilteredCommunitys(newData);
      } else {
        // 중복 데이터 없이 추가
        setCommunitys((prev) => [
          ...prev,
          ...newData.filter((item) => !prev.some((prevItem) => prevItem.id === item.id)),
        ]);
        setFilteredCommunitys((prev) => [
          ...prev,
          ...newData.filter((item) => !prev.some((prevItem) => prevItem.id === item.id)),
        ]);
      }

      // 마지막 게시글의 시간과 ID 저장
      const lastItem = newData[newData.length - 1];
      if (lastItem) {
        setLastTimestamp(lastItem.timestamp);
        setLastPostId(lastItem.id);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setProcess(false); // 요청 완료 후 process 상태 해제
    }
  };

  // 스크롤 시 다음 페이지 데이터 가져오기
  const refresh = async () => {
    const nextPage = page + 1;
    if (process || nextPage > totalPage) return; // 중복 요청 및 페이지 초과 방지

    setPage(nextPage); // 페이지 증가
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
        onEndReached={refresh}
        onEndReachedThreshold={0.1} // 적절한 임계값 설정
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
