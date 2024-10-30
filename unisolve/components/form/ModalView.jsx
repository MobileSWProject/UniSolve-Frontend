import { View, StyleSheet, Modal } from "react-native";
import { mainColor } from "../../constants/Colors";
import Register from "./Register";
import FindAccount from "./FindAccount";

export default function ModalView({ type, visible, setVisible }) {
  return (
    <>
      {type ? (
        <Modal
          animationType="fade"
          transparent={true}
          visible={visible}
          onRequestClose={() => setVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {type === "register" ? (
                <Register visible={visible} setVisible={setVisible} />
              ) : type === "find" ? (
                <FindAccount visible={visible} setVisible={setVisible} />
              ) : null}
            </View>
          </View>
        </Modal>
      ) : (
        () => {
          setVisible(false);
        }
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: mainColor,
  },
  logo: {
    width: 250,
    height: 250,
  },
  input: {
    width: 250,
    height: 40,
    borderColor: "#fff",
    borderWidth: 3,
    borderRadius: 15,
    paddingHorizontal: 10,
    color: "#fff",
  },
  inputTo: {
    width: "100%",
    height: 40,
    borderColor: "#fff",
    borderWidth: 3,
    borderRadius: 15,
    paddingHorizontal: 10,
    color: "#fff",
    borderColor: "#000",
    color: "#000",
    marginTop: 5,
  },
  text: {
    fontSize: 12,
    color: "#fff",
  },
  textTo: {
    fontSize: 15,
    marginLeft: 20,
    marginBottom: -5,
    marginTop: 20,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  flatList: {
    width: "93%",
    maxHeight: 100,
    borderWidth: 3,
    borderColor: "black",
    borderTopWidth: 0,
  },
  sendButton: {
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: 350,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonSmall: {
    paddingHorizontal: 16,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    marginTop: 15,
    margin: 2,
  },
  buttonTextSmall: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  snackbarContainer: {
    position: "absolute",
    zIndex: 999,
    top: "10%",
    width: "20%",
  },
  snackbar: {
    borderRadius: 15,
  },
});
