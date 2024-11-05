import { View, Modal } from "react-native";
import { styles } from "../../styles/form/ModalStyle";
import Register from "../form/Register";
import FindAccount from "../form/FindAccount";
import Modify from "../form/ModifyAccount";
import Delete from "../form/DeleteAccount";
import ModalList from "./ModalList";

export default function ModalView({ type, visible, setVisible, userData }) {
  return (
    <>
      {
        type ? 
        <Modal
          animationType="fade"
          transparent={true}
          visible={visible}
          onRequestClose={() => setVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {
                type === "register" ? <Register visible={visible} setVisible={setVisible}/> :
                type === "find" ? <FindAccount visible={visible} setVisible={setVisible} /> :
                type === "modify" ? <Modify visible={visible} setVisible={setVisible} userData={userData} /> :
                type === "delete" ? <Delete visible={visible} setVisible={setVisible} /> :
                type === "notification" || "history" ? <ModalList visible={visible} setVisible={setVisible} type={type} /> :
                type === "sanction" ? <ModalList visible={visible} setVisible={setVisible} /> :
                null
              }
            </View>
          </View>
        </Modal> :
        () => { setVisible(false); }
      }
    </>
  );
}
