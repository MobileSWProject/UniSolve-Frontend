import { useFocusEffect } from "expo-router";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useState, useCallback } from "react";
import _axios from "../../../api";
import { mainColor } from "../../../constants/Colors";
import { Table, Row, Rows } from "react-native-table-component";

import { useTranslation } from "react-i18next";
import "../../../i18n";
import { getExpToLevel, getLevel, getPercent } from "../../../utils/expUtils";

export function ExpPage() {
  const { t } = useTranslation(); // `t`를 컴포넌트 내부에서 사용 가능하게 함
  const [meExp, setMeExp] = useState(0);
  const listHeader = [
    t("User.ranking"),
    t("User.nickname"),
    t("User.level"),
    t("User.variation"),
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
    await _axios
      .get(`/rankings?page=${tempPage}&self=${tempSelf}`)
      .then((response) => {
        setProcress(false);
        setMeExp(response.data.self_user.exp);
        setList(
          response.data.users.map((item, index) => [
            index + 1 + tempPage * 10 - 10,
            item.nickname,
            getExpToLevel(t, getLevel(item.exp)),
            true,
          ])
        );
        setTotalPage(response.data.total_pages);
        if (tempSelf) setPage(response.data.current_page || 1);
      })
      .catch((error) => {
        setProcress(false);
        setList([]);
      });
  };

  useFocusEffect(
    useCallback(async () => {
      await getList();
    }, [])
  );

  const numConvert = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <>
      <Text style={styles.meSubText}>
        {1}
        {t("User.rank")}
      </Text>
      <View style={styles.me}>
        <Text style={styles.meText}>★ {numConvert(meExp)}</Text>
      </View>
      <ScrollView style={{ width: "100%" }}>
        <Table borderStyle={{ borderWidth: 0, borderColor: "#C1C0B9" }}>
          <Row
            data={listHeader}
            style={styles.head}
            textStyle={styles.headText}
          />
          <Rows
            data={list}
            textStyle={styles.text}
          ></Rows>
        </Table>
        <Text style={{ alignContent: "center" }}>
          {page}/{TotalPage}
        </Text>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            disabled={false}
            style={[
              styles.buttonSmall,
              { backgroundColor: false ? "gray" : mainColor },
              { width: "33%", marginLeft: 1, marginRight: 1 },
            ]}
            onPress={() => {
              getList("down");
            }}
          >
            <Text style={styles.buttonTextSmall}>{t("User.previous")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={false}
            style={[
              styles.buttonSmall,
              { backgroundColor: false ? "gray" : mainColor },
              { width: "33%", marginLeft: 1, marginRight: 1 },
            ]}
            onPress={() => {
              getList("self");
            }}
          >
            <Text style={styles.buttonTextSmall}>{t("User.rank_me")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={false}
            style={[
              styles.buttonSmall,
              { backgroundColor: false ? "gray" : mainColor },
              { width: "33%" },
            ]}
            onPress={() => {
              getList("up");
            }}
          >
            <Text style={styles.buttonTextSmall}>{t("User.next")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}