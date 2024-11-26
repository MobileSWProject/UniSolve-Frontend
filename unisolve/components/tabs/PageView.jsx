import Home from "./home/Home";
import Community from "./community/Community";
import Me from "./me/Me";
import { useState } from "react";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { SafeAreaView, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { styles } from "../../styles/tabs/home/HomeStyle";
import { mainColor } from "../../constants/Colors";
import ModalView from "../modal/ModalView";

export default function PageView({ type }) {
  const statusBarSize = StatusBar.currentHeight === null ? getStatusBarHeight() + 40 : 0
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");

  return (
    <SafeAreaView style={[styles.container, { marginTop: statusBarSize }]}>
      <StatusBar backgroundColor={mainColor} barStyle="white-content" />
      {
        type === "home" ?
        <Home type={modalType} setType={setModalType} visible={modalVisible} setVisible={setModalVisible} /> :
        type === "community" ?
        <GestureHandlerRootView>
          <Community type={modalType} setType={setModalType} visible={modalVisible} setVisible={setModalVisible} />
        </GestureHandlerRootView> :
        type === "me" ?
        <Me type={modalType} setType={setModalType} visible={modalVisible} setVisible={setModalVisible} /> :
        null
      }
      <ModalView type={modalType} visible={modalVisible} setVisible={setModalVisible} />
    </SafeAreaView>
  );
}