import { View, Modal } from "react-native";
import { styles } from "../../styles/form/ModalStyle";
import Register from "../form/Register";
import FindAccount from "../form/FindAccount";
import Modify from "../form/ModifyAccount";
import Delete from "../form/DeleteAccount";
import SelectUser from "../form/SelectUser";
import CommentModify from "../form/CommentModify";
import ViewMessage from "../post/ViewMessage";
import Post from "../post/Post";
import Support from "../form/Support";
import ModalList from "./ModalList";
import Image from "../Image";
import { ExpPage } from "../tabs/me/Exp";
import Report from "../form/Report";
import { useEffect } from "react";

export default function ModalView({ type, visible, setVisible, userData, image, post, comment, setComment, setUser, viewMessage }) {
  // type이 falsy일 때 모달을 닫기 위해 setVisible(false)를 호출
  useEffect(() => {
    if (!type) {
      setVisible(false);
    }
  }, [type, setVisible]);
  return (
    <>
      {
        type ? (
          <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={() => setVisible(false)} >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {
                  type === "register" ? <Register visible={visible} setVisible={setVisible} /> :
                  type === "find" ? <FindAccount visible={visible} setVisible={setVisible} /> :
                  type === "modify" ? <Modify visible={visible} setVisible={setVisible} userData={userData} /> :
                  type === "delete" ? <Delete visible={visible} setVisible={setVisible} /> :
                  type === "notification" || type === "history" ? <ModalList setVisible={setVisible} type={type} /> :
                  type === "sanction" ? <ModalList setVisible={setVisible} type={type} /> :
                  type === "image" ? <Image setVisible={setVisible} image={image} /> :
                  type === "user" ? <SelectUser visible={visible} setVisible={setVisible} post={post} setUser={setUser} /> :
                  type === "exp" ? <ExpPage setVisible={setVisible} /> :
                  type === "report" ? <Report visible={visible} setVisible={setVisible} post={post} comment={comment} setComment={setComment} /> :
                  type === "comment" ? <CommentModify visible={visible} setVisible={setVisible} comment={comment} setComment={setComment} /> :
                  type === "message" ? <ViewMessage setVisible={setVisible} viewMessage={viewMessage} /> :
                  type === "post" ? <Post post={post} /> :
                  type === "support" ? <Support setVisible={setVisible} /> :
                  null
                }
              </View>
            </View>
          </Modal>
        ) : null // type이 falsy일 때는 아무것도 렌더링하지 않음
      }
    </>
  );
}
