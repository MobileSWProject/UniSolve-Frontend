import { FlatList, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { styles } from "../../styles/modal/ModalListStyle";
import { mainColor } from "../../constants/Colors";
import List from "../tabs/List/List";
import _axios from "../../api";
import { useTranslation } from 'react-i18next';
import "../../i18n";

export default function ModalList({ visible, setVisible, type }) {
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [process, setProcess] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setList([]);
      setPage(1);
      getList(1);
    }, [])
  );

  const getList = async (tempPage) => {
    if (process) return;
    setProcess(true);
    try {
      const response = await _axios.get(type === "notification" ? `/notifications/mine?page=${tempPage}` : type === "history" ? `/posts/mine?page=${tempPage}` : `/accounts/user/sanctions?page=${tempPage}`);
      setTotalPage(response.data.total_pages);
      const reversedData = response.data.data || [];
      if (tempPage === 1) {
        setList(reversedData);
      } else {
        setList((prevNotifications) => [...prevNotifications, ...reversedData]);
      }
    } catch (error) {
      setList([]);
    } finally {
      setProcess(false);
    }
  };

  const refresh = async () => {
    let nextPage = page + 1;
    if (nextPage > totalPage || process) return;
    setPage(nextPage);
    await getList(nextPage);
  };

  return (
    <>
      <Text style={[styles.timeDate, { color: mainColor, marginTop: 4 }]}>{type === "notification" ? t("Function.notification") : type === "history" ? t("Function.history") : t("Function.sanction")}</Text>
      <FlatList
        style={{ width: "100%" }}
        data={list}
        keyExtractor={(item) => type === "notification" ? item.not_id.toString() : type === "history" ? item.id.toString() : null}
        renderItem={({ item, index }) => (
          <List
            item={item}
            index={index}
            count={list.length}
            type={type}
            setVisible={setVisible}
            getList={getList}
          />
        )}
        contentContainerStyle={{ paddingTop: 20 }}
        onEndReached={refresh}
        onEndReachedThreshold={0.05}
        ListFooterComponent={process && <ActivityIndicator size="large" color="#0000ff" />}
      />

      <TouchableOpacity style={[styles.buttonSmall, { backgroundColor: mainColor }]} onPress={() => setVisible(false)}>
        <Text style={styles.buttonTextSmall}>{t("Function.confirm")}</Text>
      </TouchableOpacity>
    </>
  );
}
