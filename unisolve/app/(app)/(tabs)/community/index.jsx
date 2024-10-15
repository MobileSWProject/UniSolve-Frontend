import { FlatList, TextInput, View, StyleSheet } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import List from "../../../../components/tabs/List/List";
import _axios from "../../../../api";

export default function Community() {
  const [communitys, setCommunitys] = useState([
    {
      id: 1324,
      questioner: "닉네임",
      title: "React Native 질문",
      description: "React Native에서",
      timestamp: "2024.8.31 20:18",
      reply: 0,
    },
  ]);

  const [searchText, setSearchText] = useState("");
  const [filteredCommunitys, setFilteredCommunitys] = useState(communitys);

  useFocusEffect(
    useCallback(() => {
      _axios
        .get("/community")
        .then((response) => {
          const reversedData = response.data.reverse() || [];
          setCommunitys(reversedData);
          setFilteredCommunitys(reversedData);
        })
        .catch((error) => {
          setCommunitys([]);
          setFilteredCommunitys([]);
        });
    }, [])
  );

  // 검색 텍스트가 변경될 때마다 필터링
  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = communitys.filter((item) =>
      item.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCommunitys(filtered);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 검색창 추가 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="검색어"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {/* 검색창 아래에서 시작하도록 FlatList에 marginTop 추가 */}
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
        contentContainerStyle={{ paddingTop: 20 }}  // 검색창 높이만큼 여유 공간 추가
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 20,  // 좌우 여백
    alignItems: "flex-end", // 검색창을 오른쪽으로 정렬
  },
  searchInput: {
    height: 40,
    width: 200,             // 검색창 너비를 200px로 설정
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    margin: 10,
  },
});
