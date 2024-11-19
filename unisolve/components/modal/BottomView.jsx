import { View, TouchableOpacity } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import PostCreate from "../form/PostCreate";
import Post from "../post/Post";
import Chat from "../post/Chat";
import Feather from "@expo/vector-icons/Feather";

export default function BottomView({
  sheetRef,
  mode,
  setMode,
  post,
  setPost,
  snackBar,
  getList,
  categorys,
  modalVisible,
  setModalVisible,
  modalType,
  setModalType,
}) {
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
          if (mode === "chat") return setMode("post");
          setMode("");
          sheetRef.current?.collapse();
        }}
      >
        <Feather
          name="x"
          size={30}
          color="black"
        />
      </TouchableOpacity>
      <BottomSheetScrollView
        style={{
          flex: 1,
          marginTop: 35,
          marginBottom: 75,
        }}
      >
        {mode === "create" ? (
          <PostCreate
            setMode={setMode}
            setPost={setPost}
            snackBar={snackBar}
            categorys={categorys}
          />
        ) : mode === "post" ? (
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
          />
        ) : mode === "chat"? (
          <Chat
            sheetRef={sheetRef}
            setMode={setMode}
            post={post}
            mode={mode}
            snackBar={snackBar}
          />
        ) : null}
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
