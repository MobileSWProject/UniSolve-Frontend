import { View, TouchableOpacity } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import PostCreate from "../form/PostCreate";
import Post from "../post/Post";
import Chat from "../post/Chat";
import Feather from "@expo/vector-icons/Feather";

export default function BottomView({ sheetRef, mode, setMode, post, snackBar}) {
  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={["1%", "25%", "90%"]}
      index={-1}
      enablePanDownToClose={true}
      animateOnMount={false}
      enableDynamicSizing={false}
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
      <BottomSheetScrollView style={{ flex: 1, marginTop: 35, marginBottom: 75 }}>
        {
          mode === "create" ? <PostCreate snackBar = {snackBar} /> :
          mode === "post" ? <Post sheetRef = {sheetRef} setMode = {setMode} post = {post} snackBar = {snackBar}/> :
          mode === "chat" ? <Chat sheetRef = {sheetRef} setMode = {setMode} post = {post} snackBar = {snackBar}/> :
          null
        }
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
