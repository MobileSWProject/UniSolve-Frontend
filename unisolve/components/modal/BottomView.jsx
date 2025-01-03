import { TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import PostCreateAndEdit from "../form/PostCreateAndEdit";
import Post from "../post/Post";
import Chat from "../post/Chat";
import Feather from "@expo/vector-icons/Feather";

export default function BottomView({ sheetRef, mode, setMode, post, setPost, snackBar, getList, categorys, modalVisible, setModalVisible, modalType, setModalType, setComment, setViewMessage, lagacy, setLagacy }) {
  useFocusEffect(
    useCallback(() => {
      if (!mode) sheetRef.current?.close();
    }, [mode])
  );
  return (
    <BottomSheet
      style={{  position: 'relative',position: 'absolute', zIndex: 99999,}}
      ref={sheetRef}
      snapPoints={["1%", "35%", "95%"]}
      index={-1}
      enablePanDownToClose={true}
      animateOnMount={false}
      enableDynamicSizing={false}
      enableContentPanningGesture={false}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
    >
      <TouchableOpacity
        style={{ position: "absolute", zIndex: 999, left: 10 }}
        onPress={() => {
          if (lagacy) {
            setMode("chat")
            setPost(0);
            setLagacy(false);
            return;
          }
          if ((mode === "chat" && post > 0) || mode === "edit") {
            return setMode("post");
          }
          sheetRef.current?.close();
          setMode("");
        }}
      >
        <Feather name="x" size={30} color="black" />
      </TouchableOpacity>
      <BottomSheetView style={{ flex: 1, marginTop: 35, marginBottom: 6, }}>
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
            setPost={setPost}
            mode={mode}
            snackBar={snackBar}
            setModalVisible={setModalVisible}
            setModalType={setModalType}
            setViewMessage={setViewMessage}
            setLagacy={setLagacy}
          /> :
          null
        }
      </BottomSheetView>
    </BottomSheet>
  );
}
