import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState, useRef, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import _axios from "../../../../api";
import List from "../../../../components/tabs/List/List";
import useScrollRefresh from "../../../../hooks/useScrollRefresh";
import { animated, useSpring } from "react-spring";
import Icons from "@expo/vector-icons/MaterialIcons";
import { mainColor } from "../../../../constants/Colors";
import SkeletonList from "../../../../components/tabs/List/Skeleton-List";
import { debounce } from "lodash";

export default function Community() {
  const [communitys, setCommunitys] = useState([]);
  const [page, setPage] = useState(1);
  const [isRemain, setIsRemain] = useState(true); // 총 페이지 수 관리
  const [searchText, setSearchText] = useState("");
  const [process, setProcess] = useState(false); // 데이터 요청 중 여부
  const [lastTimestamp, setLastTimestamp] = useState(null);
  const [lastPostId, setLastPostId] = useState(null);
  const [hasMore, setHasMore] = useState(true); // 더 가져올 데이터가 있는지 여부
  const [isSearching, setIsSearching] = useState(false);

  const flatListRef = useRef(null); // FlatList의 ref 생성

  // 초기 데이터 로드 및 상태 초기화
  // useFocusEffect(
  //   useCallback(() => {
  //     resetState();
  //     getList(1, null, null); // 첫 페이지 데이터 가져오기
  //   }, [])
  // );

  // 초기 데이터 로드 및 상태 초기화
  useEffect(() => {
    // resetState();
    getList(1, null, null); // 첫 페이지 데이터 가져오기
  }, []);

  // const resetState = () => {
  //   setPage(1);
  //   setTotalPage(1); // 초기화할 때 총 페이지 수도 초기화
  //   setCommunitys([]);
  //   setLastTimestamp(null);
  //   setLastPostId(null);
  //   setHasMore(true); // 데이터가 더 있다고 초기화
  // };

  // 서버에서 데이터 가져오기
  const getList = async (tempPage, timestamp, postId, isForce = false) => {
    // isForce true인 경우 강제 새로고침
    // 단, isForce true로 요청될 때는 반드시 tempPage=1, timestamp=null, postId=null 로 요청되어야 합니다.
    if (isForce === false) {
      if (process || !hasMore) return; // 중복 요청, 페이지 초과, 더 이상 데이터가 없을 경우 중단
    }
    setProcess(true);
    setIsSearching(false);

    try {
      // console.log(searchText);
      const response = await _axios.get(
        `/posts?page=${tempPage}&last_timestamp=${
          timestamp || ""
        }&last_post_id=${postId || ""}&search=${searchText}`
      );

      const newData = response.data.data || [];
      setIsRemain(response.data.is_remain); // 총 페이지 수 설정

      if (newData.length === 0) {
        setHasMore(false); // 더 이상 데이터가 없을 때 hasMore를 false로 설정
      }

      // 첫 페이지라면 데이터 초기화
      if (tempPage === 1) {
        setCommunitys(newData);
      } else {
        // 중복 데이터 없이 추가
        setCommunitys((prev) => [
          ...prev,
          ...newData.filter(
            (item) => !prev.some((prevItem) => prevItem.id === item.id)
          ),
        ]);
      }

      // 마지막 게시글의 시간과 ID 저장
      const lastItem = newData[newData.length - 1];
      if (lastItem) {
        setLastTimestamp(lastItem.timestamp);
        setLastPostId(lastItem.id);
        setHasMore(true);
      } else {
        setHasMore(false); // 새로운 데이터가 없으면 더 이상 요청하지 않음
      }

      // isForce: 위로 스크롤로 인한 새로고침 이거나 검색으로 인한 새로고침이면
      if (isForce) {
        setPage(1);
        // 스크롤을 가장 위로 올리기
        if (flatListRef.current) {
          flatListRef.current.scrollToOffset({ offset: 0, animated: true });
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setProcess(false); // 요청 완료 후 process 상태 해제
    }
  };

  // 스크롤 시 다음 페이지 데이터 가져오기
  const appendNextData = async () => {
    const nextPage = page + 1;

    if (process || !hasMore || !isRemain) return; // 중복 요청, 데이터 없음, 페이지 초과 방지

    setPage(nextPage); // 페이지 증가
    await getList(nextPage, lastTimestamp, lastPostId); // 다음 페이지 데이터 요청
  };

  // 0.5초 debounce
  const debouncedSearch = debounce(() => {
    getList(1, null, null, true);
  }, 500);

  // 키워드 변경시
  useEffect(() => {
    setIsSearching(true);
    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchText]);

  // 검색 키워드 입력 중일 때 로딩 표시
  useEffect(() => {
    if (isSearching) {
      setCommunitys([]);
    }
  }, [isSearching]);

  // 검색 기능
  const handleChangeText = (text) => {
    setSearchText(text.trim());
  };

  const getRefreshData = async () => {
    // 명시적으로 기다리게 하기 => 새로고침 되도록 느끼도록
    await new Promise((resolve) => setTimeout(resolve, 1200));
    await getList(1, null, null, true); // 첫 페이지 데이터 가져오기
  };

  // 새로고침
  const {
    isRefreshing,
    handleScroll,
    handleScrollEndDrag,
    canRefresh,
    handleScrollStartDrag,
  } = useScrollRefresh(getRefreshData);

  const AnimatedIcons = animated(Icons);
  const AnimatedView = animated(View);
  const [springs, api] = useSpring(() => ({
    marginTop: 0,
    opacity: 0,
    rotate: 0,
  }));
  const [springs2, api2] = useSpring(() => ({ y: 0 }));
  // "READY" | "CAN_REFRESH" | "IS_REFRESHING"
  const animationStep = useRef("READY");

  useEffect(() => {
    if (canRefresh && animationStep.current === "READY") {
      api.start({
        opacity: 1,
        marginTop: 12,
        rotate: 360,
        config: { duration: 300 },
      });
      api2.start({
        y: 30,
        config: { duration: 300 },
      });
      animationStep.current = "CAN_REFRESH";
    }

    if (isRefreshing && animationStep.current === "CAN_REFRESH") {
      api.start({ cancel: "rotate" });
      const curRotateValue = springs.rotate.get();
      api.start({
        from: { rotate: curRotateValue },
        to: { rotate: curRotateValue + 360 },
        config: { duration: 800 },
        loop: true, // 명시적으로 무한 반복
      });
      animationStep.current = "IS_REFRESHING";
    }

    if (!isRefreshing && animationStep.current === "IS_REFRESHING") {
      api.stop(); // 명시적으로 애니메이션 중지
      api.start({ opacity: 0, marginTop: 0, rotate: 0 });
      api2.start({ y: 0, duration: 300 });
      animationStep.current = "READY";
    }

    if (!canRefresh && animationStep.current === "CAN_REFRESH") {
      api.start({
        opacity: 0,
        marginTop: 0,
        rotate: 0,
        config: { duration: 300 },
      });
      api2.start({ y: 0, duration: 300 });
      animationStep.current = "READY";
    }
  }, [canRefresh, isRefreshing]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: mainColor }}>
      {/* 검색창 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="검색어"
          value={searchText}
          onChangeText={handleChangeText}
          placeholderTextColor={"white"}
        />
      </View>
      <View style={{ zIndex: 10 }}>
        <AnimatedIcons
          name="refresh"
          size={28}
          color="white"
          style={{
            position: "absolute",
            alignSelf: "center",
            // top: -10,
            ...springs,
          }}
        />
      </View>

      {/* 커뮤니티 리스트 */}
      <AnimatedView style={{ ...springs2, flex: 1 }}>
        <>
          {communitys.length === 0 ? (
            <>
              {process || isSearching ? (
                <ScrollView contentContainerStyle={{ paddingTop: 20 }}>
                  <SkeletonList length={20} />
                </ScrollView>
              ) : (
                <View>
                  <Text style={{ color: "white" }}>찾는 결과 없음 ㅋ.</Text>
                </View>
              )}
            </>
          ) : (
            <FlatList
              ref={flatListRef}
              style={{ backgroundColor: mainColor }}
              data={communitys}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <List
                  item={item}
                  index={index}
                  count={communitys.length}
                  type="community"
                />
              )}
              contentContainerStyle={{ paddingTop: 20 }}
              onEndReached={appendNextData}
              onEndReachedThreshold={0.1} // 적절한 임계값 설정
              onScroll={handleScroll}
              onScrollBeginDrag={handleScrollStartDrag}
              onScrollEndDrag={handleScrollEndDrag}
              ListFooterComponent={
                process || isSearching ? (
                  <SkeletonList />
                ) : (
                  <View style={{ marginBottom: 100 }} />
                )
              }
            />
          )}
        </>
      </AnimatedView>
    </SafeAreaView>
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
    borderColor: "white",
    color: "white",
    borderWidth: 2,
    borderRadius: 10,
    paddingLeft: 10,
    margin: 10,
  },
});
