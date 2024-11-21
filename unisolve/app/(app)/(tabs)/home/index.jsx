import Home from "../../../../components/tabs/home/Home";
import { useState } from "react";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { SafeAreaView, StatusBar } from "react-native";
import { styles } from "../../../../styles/tabs/home/HomeStyle";
import { mainColor } from "../../../../constants/Colors";
import ModalView from "../../../../components/modal/ModalView";

export default function HomePage() {
  const statusBarSize = StatusBar.currentHeight === null ? getStatusBarHeight() + 40 : 0
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");

  return (
    <SafeAreaView style={[styles.container, { marginTop: statusBarSize }]}>
      <StatusBar backgroundColor={mainColor} barStyle="white-content" />
      <Home type={modalType} setType={setModalType} setVisible={setModalVisible} />
      <ModalView type={modalType} visible={modalVisible} setVisible={setModalVisible} />
    </SafeAreaView>
  );
}