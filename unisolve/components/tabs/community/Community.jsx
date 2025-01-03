import Entypo from "@expo/vector-icons/Entypo";
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { FlatList, StyleSheet, Text, TextInput, View, TouchableOpacity, RefreshControl, Platform } from "react-native";
import _axios from "../../../api";
import List from "../../../components/List/List";
import useScrollRefresh from "../../../hooks/useScrollRefresh";
import { animated, useSpring } from "react-spring";
import Icons from "@expo/vector-icons/MaterialIcons";
import { mainColor } from "../../../constants/Colors";
import SkeletonList from "../../../components/List/Skeleton-List";
import { debounce } from "lodash";
import Ionicons from "@expo/vector-icons/Ionicons";
import SnackBar from "../../../components/Snackbar";
import ModalView from "../../../components/modal/ModalView";
import BottomView from "../../../components/modal/BottomView";
import { router } from "expo-router";
import { useTranslation } from 'react-i18next';
import "../../../i18n";
import { ScrollView } from "react-native-gesture-handler";

export default function Community() {
  const { post, log_click, history } = useLocalSearchParams();
  const sheetRef = useRef(null);
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("");
  const [mode, setMode] = useState("");
  const [postID, setPostID] = useState("");
  const [commentID, setCommentID] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [ban, setBan] = useState(true);
  const [communitys, setCommunitys] = useState([]);
  const [page, setPage] = useState(1);
  const [isRemain, setIsRemain] = useState(true); // 총 페이지 수 관리
  const [searchText, setSearchText] = useState("");
  const [process, setProcess] = useState(false); // 데이터 요청 중 여부
  const [lastPostId, setLastPostId] = useState(null);
  const [hasMore, setHasMore] = useState(true); // 더 가져올 데이터가 있는지 여부
  const [isSearching, setIsSearching] = useState(false);
  const flatListRef = useRef(null); // FlatList의 ref 생성
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const lastPostRef = useRef(null); // 이전 post ID를 저장하는 useRef
  const [viewMessage, setViewMessage] = useState("");
  const [lagacy, setLagacy] = useState(false);

  const firstRender = useRef(true)


  useEffect(()=>{
    getCategory();
  }, [])

  const resetParams = () => {
    router.setParams({ log_click: undefined, post: undefined, history: undefined });
  }

  useFocusEffect(()=>{
    let id = 0
    if (log_click==="True" || post !=="undefined") {
      id = setTimeout(resetParams, 100)
    }

    return () => clearTimeout(id)
  })

  useEffect(()=> {
    if (log_click==="True") {
      setMode("create");
      sheetRef.current?.expand();
      resetParams();
    }
  }, [log_click, router])

  useEffect(()=>{
    if (post && post > 0) {
      setMode("post");
      setPostID(post);
      sheetRef.current?.expand();
      resetParams();
    }
  }, [post, router])

  useEffect(() => {
    if (mode === "") return;
    if (firstRender.current) {
      setTimeout(()=>{
        sheetRef.current?.expand();
        firstRender.current = false
      },100)
    }
    sheetRef.current?.expand();

    resetParams();
  }, [mode, postID]);

  const snackBar = (message) => { setSnackbarMessage(message); setSnackbarVisible(true);};

  const getCategory = async () => {
    try {
      const response = await _axios.post("posts/category");
      setItems(response.data.data);
    } catch {
      setItems([]);
    }
  };

  // 서버에서 데이터 가져오기
  const getList = async (tempPage, postId, isForce = false, tempCategory = null) => {
    // isForce true인 경우 강제 새로고침
    // 단, isForce true로 요청될 때는 반드시 tempPage=1, timestamp=null, postId=null 로 요청되어야 합니다.
    if (isForce === false) {
      if (process || !hasMore) return; // 중복 요청, 페이지 초과, 더 이상 데이터가 없을 경우 중단
    }
    setProcess(true);
    setIsSearching(false);
    try {
      const response = await _axios.get(`/posts?page=${tempPage}&last_post_id=${postId || ""}&search=${searchText}&category_filter=${tempCategory || category}`);
      setBan(response.data.ban);

      const newData = response.data.data || [];
      if (category && newData.length <= 0) {
        snackBar(`${t("Stage.warning")} ${t("Function.post_empty")}`);
      }
      setIsRemain(response.data.is_remain); // 총 페이지 수 설정

      if (newData.length === 0) {
        setHasMore(false); // 더 이상 데이터가 없을 때 hasMore를 false로 설정
      }

      // 첫 페이지라면 데이터 초기화
      if (tempPage === 1) {
        setCommunitys(newData);
      } else {
        // 중복 데이터 없이 추가
        setCommunitys((prev) => [...prev, ...newData.filter((item) => !prev.some((prevItem) => prevItem.id === item.id))]);
      }

      // 마지막 게시글의 시간과 ID 저장
      const lastItem = newData[newData.length - 1];
      if (lastItem) {
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
      snackBar(`${t(`Stage.failed`)} [${error.response.status}] ${t(`Status.${error.response.status}`)}`);
    } finally {
      setProcess(false); // 요청 완료 후 process 상태 해제
    }
  };

  // 스크롤 시 다음 페이지 데이터 가져오기
  const appendNextData = async () => {
    const nextPage = page + 1;

    if (process || !hasMore || !isRemain) return; // 중복 요청, 데이터 없음, 페이지 초과 방지

    setPage(nextPage); // 페이지 증가
    await getList(nextPage, lastPostId); // 다음 페이지 데이터 요청
  };

  // 0.5초 debounce
  const debouncedSearch = debounce(() => {
    getList(1, null, true);
  }, 500);

  // 키워드 변경시
  useEffect(() => {
    sheetRef.current?.close();
    setIsSearching(true);
    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchText]);

  // 검색 키워드 입력 중일 때 로딩 표시
  useEffect(() => {
    if (isSearching) {
      if (!category) return;
      setCommunitys([]);
    }
  }, [isSearching]);

  // 검색 기능
  const handleChangeText = (text) => {
    if (!category) {
      setSearchText("");
      return;
    }
    setSearchText(text.trim());
  };

  const getRefreshData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    await getList(1, null, true); // 첫 페이지 데이터 가져오기
  };

  // 새로고침
  const {isRefreshing, handleScroll, handleScrollEndDrag, canRefresh,handleScrollStartDrag} = useScrollRefresh(getRefreshData);

  const AnimatedIcons = animated(Icons);
  const AnimatedView = animated(View);
  const [springs, api] = useSpring(() => ({ marginTop: 0, opacity: 0, rotate: 0 }));
  const [springs2, api2] = useSpring(() => ({ opacity: 1 }));
  // "READY" | "CAN_REFRESH" | "IS_REFRESHING"
  const animationStep = useRef("READY");

  useEffect(() => {
    if (canRefresh && animationStep.current === "READY") {
      api.start({ opacity: 1, marginTop: 12, rotate: 360, config: { duration: 300 }});
      // api2.start({opacity: 0.5, config: { duration: 300 }});
      animationStep.current = "CAN_REFRESH";
    }

    if (isRefreshing && animationStep.current === "CAN_REFRESH") {
      api.start({ cancel: "rotate" });
      const curRotateValue = springs.rotate.get();
      api.start({ from: { rotate: curRotateValue }, to: { rotate: curRotateValue + 360 }, config: { duration: 800 }, loop: true }); // 명시적으로 무한 반복
      animationStep.current = "IS_REFRESHING";
    }

    if (!isRefreshing && animationStep.current === "IS_REFRESHING") {
      api.stop(); // 명시적으로 애니메이션 중지
      api.start({ opacity: 0, marginTop: 0, rotate: 0 });
      // api2.start({ opacity: 1, duration: 300 });
      animationStep.current = "READY";
    }

    if (!canRefresh && animationStep.current === "CAN_REFRESH") {
      api.start({ opacity: 0, marginTop: 0, rotate: 0, config: { duration: 300 }});
      // api2.start({ opacity: 1, duration: 300 });
      animationStep.current = "READY";
    }
  }, [canRefresh, isRefreshing]);

  const postCreate = async () => {
    try {
      setMode("create");
      sheetRef.current?.expand();
      const response = await _axios.get("/posts/check_ban_status");
      if (response.data.ban) {
        sheetRef.current?.close();
        setBan(response.data.ban);
      }
    } catch { }
  };

  const chatOpen = async () => {
    try {
      setPostID(0);
      setMode("chat");
      sheetRef.current?.expand();
    } catch {}
  };

  function getLabelByValue(value) {
    const item = items.find(item => item.value === value);
    return item ? item.label : null;
  }


  return (
    <>
      {/* 검색창 */}
      <View style={styles.searchContainer}>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          {
            category ?
            <TouchableOpacity style={styles.button} onPress={() => { 
                sheetRef.current?.close();
                setSearchText("");
                setCategory("");
              }}>
              <Text><Ionicons name="arrow-back" size={30} color="white" /></Text>
            </TouchableOpacity> :
            null
          }
        </View>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity style={styles.button} disabled={ban} onPress={() => { chatOpen(); }}>
            <Text><Entypo name="chat" size={26} color="white"/></Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} disabled={ban} onPress={() => { postCreate(); }}>
            <Text><Ionicons name="create" size={30} color={ban ? "#AAA" : "white"}/></Text>
          </TouchableOpacity>
          {
            category ?
            <TextInput
              style={styles.searchInput}
              placeholder={t("Function.search")}
              value={searchText}
              onChangeText={handleChangeText}
              placeholderTextColor={"white"}
            /> :
            null
          }
        </View>
      </View>
      {
        category ? 
        <View style={{margin: 5, alignItems: "center"}}>
          <Text style={{color: "#fff", fontWeight: "bold", fontSize: 30}}>{getLabelByValue(category)}</Text>
        </View> :
        null
      }
      {
        !category ?
        <FlatList
          ref={flatListRef}
          data={items}
          style={{marginBottom: 14 }}
          keyExtractor={(item) => item.value.toString()}  
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
              keyboardShouldPersistTaps="handled"
                style={{padding: 10, borderBottomWidth: 1, borderColor: "#fff", margin: 8}}
                onPress={() => {
                  setCommunitys([]);
                  setCategory(item.value);
                  getList(1, null, true, item.value);
                }}
              >
                <Text style={{ color: "#fff", fontSize: 18, }}>{item.label}</Text>
              </TouchableOpacity>
            );
          }}
          refreshControl={ Platform.OS === "android" ? <RefreshControl refreshing={false}/> : null}
        /> :
        null
      }
      <View style={{ zIndex: 10 }}>
        <AnimatedIcons name="refresh" size={28} color="white" style={{ position: "absolute", alignSelf: "center", ...springs}}/>
      </View>

      {/* 커뮤니티 리스트 */}
      <View style={{marginTop: isRefreshing ? 30 : 0}} />
      <AnimatedView style={{  flex: 1 }}>
        <>
          {
            communitys.length === 0 ?
            <>
              {
                process || isSearching ?
                <ScrollView contentContainerStyle={{marginTop: 14}}>
                  <SkeletonList length={20} />
                </ScrollView> :
                <View style={{margin: 5, alignItems: "center"}}>
                  <Text style={{color: "#fff", fontWeight: "bold", fontSize: 35}}>== {t("Function.post_empty")} ==</Text>
                </View>
              }
            </> :
              category ?
              <FlatList
                ref={flatListRef}
                style={{ backgroundColor: mainColor, marginBottom: 14, borderBottomWidth: 2, borderBottomColor: "white", borderRadius: 6}}
                data={communitys}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                  <List
                    item={item}
                    index={index}
                    count={communitys.length}
                    type="community"
                    bottomView={{ setMode, setPostID, sheetRef }}
                  />
                )}
                contentContainerStyle={{ paddingTop: 10 }}
                onEndReached={appendNextData}
                onEndReachedThreshold={0.5} // 적절한 임계값 설정
                onScroll={handleScroll}
                onScrollBeginDrag={handleScrollStartDrag}
                onScrollEndDrag={handleScrollEndDrag}
                ListFooterComponent=
                {
                  process || isSearching ?
                  <SkeletonList /> :
                  <View style={{ marginBottom: isRemain ? 500 : 100 }} />
                }
                refreshControl={
                  Platform.OS === "android" ? (
                    <RefreshControl
                      refreshing={isRefreshing}
                      onRefresh={() => {
                        getList(1, null, true);
                      }}
                    />
                  ) : null
                }
              /> :
              null
            }
        </>
      </AnimatedView>
      <BottomView
        sheetRef={sheetRef}
        ban={ban}
        mode={mode}
        setMode={setMode}
        post={postID}
        setPost={setPostID}
        snackBar={snackBar}
        getList={getList}
        categorys={items}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        modalType={modalType}
        setModalType={setModalType}
        setComment={setCommentID}
        setViewMessage={setViewMessage}
        lagacy={lagacy}
        setLagacy={setLagacy}
      />
      <View>
        <ModalView type={modalType} visible={modalVisible} setVisible={setModalVisible} post={postID} comment={commentID} setComment={setCommentID} viewMessage={viewMessage}/>
      </View>
      <SnackBar visible={snackbarVisible} message={snackbarMessage} onDismiss={() => setSnackbarVisible(false)}/>
    </>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    justifyContent: "space-between",
    paddingHorizontal: 20,
    flexDirection: "row",
    borderBottomColor: "white",
    borderBottomWidth: 2,
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
  button: {
    margin: 3
  }
});
