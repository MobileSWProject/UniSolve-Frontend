import { Text, FlatList  } from "react-native";
import { useState, useRef, useEffect } from "react";
import InputProcess from "./InputProcess";
import _axios from "../../api";
import List from "../List/List";
import { useTranslation } from 'react-i18next';
import "../../i18n";

export default function SelectUser({ visible, setVisible, post, postMatched, setPostMatched }) {
  const { t } = useTranslation();
  const [loding, setLoding] = useState(false);
  const flatListRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState("");

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
    if (response.data.post_id === post) {
      setVisible(false);
    }
  }

  return (
    <>
      <Text style={{ fontSize: 25, marginBottom: 5, fontWeight: "bold" }}>1:1 대화 상대 지정</Text>
      <Text style={{ textAlign: "center", color: "#ff0000", fontWeight: "bold" }}>{!postMatched.nickname ? "요청 후 거절하지 않거나 상대방이 수락하면 변경할 수 없습니다!" : "이미 요청을 보낸 상태입니다."}</Text>
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