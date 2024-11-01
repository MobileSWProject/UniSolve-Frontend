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
  const [totalPage, setTotalPage] = useState(1); // 총 페이지 수 관리
  const [searchText, setSearchText] = useState("");
  const [filteredCommunitys, setFilteredCommunitys] = useState([]);
  const [process, setProcess] = useState(false); // 데이터 요청 중 여부
  const [lastTimestamp, setLastTimestamp] = useState(null);
  const [lastPostId, setLastPostId] = useState(null);
  const [hasMore, setHasMore] = useState(true); // 더 가져올 데이터가 있는지 여부

  // 초기 데이터 로드 및 상태 초기화
  useFocusEffect(
    useCallback(() => {
      resetState();
      getList(1, null, null); // 첫 페이지 데이터 가져오기
    }, [])
  );

  const resetState = () => {
    setPage(1);
    setTotalPage(1); // 초기화할 때 총 페이지 수도 초기화
    setCommunitys([]);
    setFilteredCommunitys([]);
    setLastTimestamp(null);
    setLastPostId(null);
    setHasMore(true); // 데이터가 더 있다고 초기화
  };

  // 서버에서 데이터 가져오기
  const getList = async (tempPage, timestamp, postId) => {
    if (process || !hasMore || tempPage > totalPage) return; // 중복 요청, 페이지 초과, 더 이상 데이터가 없을 경우 중단
    setProcess(true);

    try {
      const response = await _axios.get(
        `/posts?page=${tempPage}&last_timestamp=${timestamp || ""}&last_post_id=${postId || ""}`
      );

      const newData = response.data.data || [];
      setTotalPage(response.data.total_pages); // 총 페이지 수 설정

      if (newData.length === 0) {
        setHasMore(false); // 더 이상 데이터가 없을 때 hasMore를 false로 설정
      }

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
      } else {
        setHasMore(false); // 새로운 데이터가 없으면 더 이상 요청하지 않음
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
    if (process || !hasMore || nextPage > totalPage) return; // 중복 요청, 데이터 없음, 페이지 초과 방지

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
