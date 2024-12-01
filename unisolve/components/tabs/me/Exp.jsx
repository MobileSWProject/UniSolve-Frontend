import { useFocusEffect } from "expo-router";
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useCallback } from "react";
import _axios from "../../../api";
import { styles } from "../../../styles/tabs/me/ExpStyle";
import { mainColor } from "../../../constants/Colors";
import LevelImage from "../../../components/tabs/me/LevelImage";
import { Table, Row, Rows } from "react-native-table-component";
import { useTranslation } from "react-i18next";
import "../../../i18n";
import { getExpToLevel, getLevel, getPercent } from "../../../utils/expUtils";

export function ExpPage({setVisible}) {
  const { t } = useTranslation();
  const [meRank, setMeRank] = useState(0);
  const [meExp, setMeExp] = useState(0);
  const listHeader = [
    t("User.ranking"),
    t("User.nickname"),
    t("User.level"),
  ];
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [TotalPage, setTotalPage] = useState(1);
  const [process, setProcress] = useState(false);

  const getList = async (temp) => {
    if (process) return;
    let tempPage = page;
    let tempSelf = false;
    if (temp === "down") {
      if (tempPage <= 1) return;
      tempPage--;
    } else if (temp === "up") {
      if (tempPage >= TotalPage) return;
      tempPage++;
    } else if (temp === "self") tempSelf = true;
    setPage(tempPage);
    setProcress(true);
    await _axios.get(`/rankings?page=${tempPage}&self=${tempSelf}`).then((response) => {
      setProcress(false);
      setMeRank(response.data.self_user.rank);
      setMeExp(response.data.self_user.exp);
      setList(
        response.data.users.map((item, index) => [
          index + 1 + (tempSelf ? response.data.self_user.page : tempPage) * 10 - 10,
          item.nickname,
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
            <LevelImage exp={item.exp} size={32} />
            <Text style={styles.text}>| {getExpToLevel(t, getLevel(item.exp))}</Text>
          </View>,
        ])
      );
      setTotalPage(response.data.total_pages);
      if (tempSelf) {
        setPage(response.data.self_user.page || 1);
      }
      })
      .catch(() => {
        setProcress(false);
        setList([]);
      });
  };

  useFocusEffect(
    useCallback(() => {
      const getListCallback = async () => {
        await getList();
      };
      getListCallback();
    }, [])
  );

  const numConvert = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <>
      <Text style={styles.meSubText}>{`${meRank}${t("User.rank")}`}</Text>
      <View style={styles.me}>
        <Text style={styles.meText}><LevelImage exp={meExp} size={42} /> {numConvert(meExp)}</Text>
      </View>
      <View style={{ width: "100%" }}>
        <Table borderStyle={{ borderWidth: 0, borderColor: "#C1C0B9" }}>
          <Row data={listHeader} style={styles.head} textStyle={styles.headText}/>
          <Rows data={list} textStyle={styles.text}></Rows>
        </Table>
        {
          process ?
          <ActivityIndicator size="large" color={mainColor}/> :
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", marginTop: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold"}}>{page}/{TotalPage}</Text>
          </View>
        }
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            disabled={process || page <= 1}
            style={[styles.buttonSmall, { backgroundColor: process || page <= 1 ? "gray" : mainColor }, { width: "33%", marginLeft: 1, marginRight: 1 }]}
            onPress={() => { getList("down");}}
          >
            <Text style={styles.buttonTextSmall}>{t("Function.previous")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={process}
            style={[styles.buttonSmall, { backgroundColor: process ? "gray" : mainColor }, { width: "33%", marginLeft: 1, marginRight: 1 }]}
            onPress={() => { getList("self"); }}
          >
            <Text style={styles.buttonTextSmall}>{t("User.rank_me")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={process || page >= TotalPage}
            style={[styles.buttonSmall, { backgroundColor: process || page >= TotalPage ? "gray" : mainColor }, { width: "33%" }]}
            onPress={() => { getList("up"); }}
          >
            <Text style={styles.buttonTextSmall}>{t("Function.next")}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.buttonSmall, { backgroundColor: mainColor }]}
          onPress={() => setVisible(false)}
        >
          <Text style={styles.buttonTextSmall}>{t("Function.confirm")}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}