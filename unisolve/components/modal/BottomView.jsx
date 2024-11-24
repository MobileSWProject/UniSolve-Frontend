import { TouchableOpacity } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { useCallback } from "react";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";
import PostCreateAndEdit from "../form/PostCreateAndEdit";
import Post from "../post/Post";
import Chat from "../post/Chat";
import Feather from "@expo/vector-icons/Feather";

export default function BottomView({ sheetRef, mode, setMode, post, setPost, snackBar, getList, categorys, modalVisible, setModalVisible, modalType, setModalType, setComment}) {
  useFocusEffect(
    useCallback(() => {
      if (!mode) sheetRef.current?.close();
    }, [mode])
  );
  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={["1%", "35%", "95%"]}
      index={-1}
      enablePanDownToClose={true}
      animateOnMount={false}
      enableDynamicSizing={false}
      enableContentPanningGesture={false}
    >
      <TouchableOpacity
        style={{ position: "absolute", zIndex: 999, left: 10 }}
        onPress={() => {
          if (mode === "chat" || mode === "edit") return setMode("post");
          setMode("");
          sheetRef.current?.close();
        }}
      >
        <Feather name="x" size={30} color="black" />
      </TouchableOpacity>
      <BottomSheetScrollView style={{ flex: 1, marginTop: 35, marginBottom: 75, }} >
        {
          mode === "create" || mode === "edit" ?
          <PostCreateAndEdit
            mode={mode}
            setMode={setMode}
            post={post}
            setPost={setPost}
            snackBar={snackBar}
            categorys={categorys}
          /> :
          mode === "post" ?
          <Post
            sheetRef={sheetRef}
            setMode={setMode}
            post={post}
            snackBar={snackBar}
            getList={getList}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            modalType={modalType}
            setModalType={setModalType}
            setComment={setComment}
          /> :
          mode === "chat" ?
          <Chat
            sheetRef={sheetRef}
            setMode={setMode}
            post={post}
            mode={mode}
            snackBar={snackBar}
          /> :
          null
        }
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
