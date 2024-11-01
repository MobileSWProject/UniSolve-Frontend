import { View, Modal } from "react-native";
import { styles } from "../../styles/form/ModalStyle";
import Register from "./Register";
import FindAccount from "./FindAccount";
import Modify from "./ModifyAccount";
import Delete from "./DeleteAccount";

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
