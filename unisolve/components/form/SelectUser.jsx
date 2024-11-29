import { Text, FlatList  } from "react-native";
import { useState, useRef, useEffect } from "react";
import InputProcess from "./InputProcess";
import _axios from "../../api";
import List from "../List/List";
import { useTranslation } from 'react-i18next';
import "../../i18n";

export default function SelectUser({ visible, setVisible, post }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState("");

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    const response = await _axios.get(`category/${post}/users`);
    setUsers(response.data.data);
  }

  async function SettingsUser() {
    if (loading) return;
    setLoading(true);
    try {
      const response = await _axios.post(`category/${post}/select_partner`, {partner_nickname: user});
      setLoading(false);
      if (response.data.post_id == post) {
        setVisible(false);
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <>
      <Text style={{ fontSize: 25, marginBottom: 5, fontWeight: "bold" }}>{t("Function.matching")}</Text>
      {
        users && users.length > 0 ?
        <>
        <Text style={{ textAlign: "center", color: "#ff0000", fontWeight: "bold", marginTop: 5 }}>{t("Function.matching_alert")}</Text>
        <Text style={{ textAlign: "center", fontSize: 25, fontWeight: "bold", marginTop: 10, marginBottom: 10 }}>{`${t("Function.matching_select")}: ${user}\n`}</Text>
        <FlatList
          style={{width: "100%"}}
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
        </> :
        <Text style={{fontSize: 40, marginBottom: 10, color: "black", textAlign: "center", fontWeight: "bold", marginTop: 4, fontSize: 20 }}>== {t("Function.matching_empty")} ==</Text> 
      }
      <InputProcess
        visible={visible}
        setVisible={setVisible}
        onPress={() => {SettingsUser();}}
        content={t("Function.confirm")}
        cancel={loading}
        disabled={!users || users.length <= 0 || !user || user.length <= 0 || loading}
      />
    </>
  );
}