import { FlatList, TextInput, View, StyleSheet, ActivityIndicator} from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import List from "../../../../components/tabs/List/List";
import _axios from "../../../../api";

export default function Community() {
  const [communitys, setCommunitys] = useState([
    // {
    //   id: 1324,
    //   questioner: "닉네임",
    //   title: "React Native 질문",
    //   description: "React Native에서",
    //   timestamp: "2024.8.31 20:18",
    //   reply: 0,
    // },
  ]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [filteredCommunitys, setFilteredCommunitys] = useState(communitys);
  const [process, setProcess] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      getList(1);
      setCommunitys([]);
      setFilteredCommunitys([]);
    }, [])
  );
  const getList = async (tempPage) => {
    if (process) return;
    setProcess(true);
    try {
      const response = await _axios.get(`/community?page=${tempPage}`);
      setTotalPage(response.data.total_pages);
      const reversedData = response.data.data || [];
      if (tempPage === 1) {
        setCommunitys(reversedData);
      } else {
        setCommunitys((prevCommunitys) => [...prevCommunitys, ...reversedData]);
      }
      setFilteredCommunitys((prevCommunitys) => [...prevCommunitys, ...reversedData]);
    } catch (error) {
      setCommunitys([]);
      setFilteredCommunitys([]);
    } finally {
      setProcess(false);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = communitys.filter((item) =>
      item.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCommunitys(filtered);
  };

  const refresh = async () => {
    let nextPage = page + 1;
    if (nextPage > totalPage || process) return;
    setPage(nextPage);
    await getList(nextPage);
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
        ListFooterComponent={
          process && <ActivityIndicator size="large" color="#0000ff" />
        }
        onEndReachedThreshold={0.05}
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
