import { useRouter } from "expo-router";
import { Text, FlatList  } from "react-native";
import { useCallback, useState, useRef, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SnackBar from "../Snackbar";
import Input from "./Input";
import InputProcess from "./InputProcess";
import _axios from "../../api";
import List from "../tabs/List/List";

import { useTranslation } from 'react-i18next';
import "../../i18n";

export default function SelectUser({ visible, setVisible, post }) {
  const router = useRouter();
  const { t } = useTranslation();

  const [loding, setLoding] = useState(false);

  const flatListRef = useRef(null); // FlatList의 ref 생성

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState("");

  // 초기 데이터 로드 및 상태 초기화
  useEffect(() => {
    if (loding) return;
    getUsers();
    setLoding(true);
  }, [users]);

  async function getUsers() {
    const response = await _axios.get(`category/${post}/users`);
    setUsers(response.data.data);
  }

  async function SettingsUser() {
    const response = await _axios.post(`category/${post}/select_partner`, {partner_nickname: user});
    if (response.data.post_id === post){
      setVisible(false);
    }
  }

  return (
    <>
      <Text style={{ fontSize: 25, marginBottom: 5, fontWeight: "bold" }}>
        1:1 대화 상대 지정
      </Text>
      <Text style={{ textAlign: "center", color: "#ff0000", fontWeight: "bold" }}>
        선택을 완료하시면 취소하거나 변경할 수 없습니다! 
      </Text>
      <FlatList
        ref={flatListRef}
        data={users}
        keyExtractor={(item) => item.user_id}
        renderItem={({ item, index }) => (
          <List
            type="users"
            item={item}
            index={index}
            count={users.length}
            setUser={setUser}
          />
        )}
      />
      <InputProcess
        visible={visible}
        setVisible={setVisible}
        onPress={() => {SettingsUser();}}
        content={t("Function.confirm")}
        cancel={false}
        disabled={false}
      />
    </>
  );
}