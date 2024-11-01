import { Modal } from "react-native";
import { styles } from "../../styles/form/ModalStyle"

export default function Modify({ visible, setVisible }) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {setVisible(false);}}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          
        </View>
      </View>
    </Modal>
  );
}