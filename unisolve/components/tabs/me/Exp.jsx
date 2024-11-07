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

import { useTranslation } from 'react-i18next';
import "../../../i18n";

const { t } = useTranslation();

export function getExpToLevel(index) {
  return t(`User.exp_${index}`);
};
export function getPercent(exp) {
  const percent = exp < 101
    ? (exp / 101) * 100
    : exp < 301
      ? ((exp - 101) / (301 - 101)) * 100
      : exp < 501
        ? ((exp - 301) / (501 - 301)) * 100
        : exp < 701
          ? ((exp - 501) / (701 - 501)) * 100
          : exp < 1001
            ? ((exp - 701) / (1001 - 701)) * 100
            : exp < 1501
              ? ((exp - 1001) / (1501 - 1001)) * 100
              : exp < 2001
                ? ((exp - 1501) / (2001 - 1501)) * 100
                : exp < 3001
                  ? ((exp - 2001) / (3001 - 2001)) * 100
                  : exp < 5001
                    ? ((exp - 3001) / (5001 - 3001)) * 100
                    : 100;
  return percent.toFixed(2);
}
export function getLevel(exp) {
  return (
    Math.floor(
      exp < 101
        ? 1
        : exp < 301
          ? 1 + (exp - 100) / 200
          : exp < 501
            ? 2 + (exp - 300) / 200
            : exp < 701
              ? 3 + (exp - 500) / 200
              : exp < 1001
                ? 4 + (exp - 700) / 300
                : exp < 1501
                  ? 5 + (exp - 1000) / 500
                  : exp < 2001
                    ? 6 + (exp - 1500) / 500
                    : exp < 3001
                      ? 7 + (exp - 2000) / 1000
                      : exp < 5001
                        ? 8 + (exp - 3000) / 2000
                        : 10
    ) - 1
  );
}
export function ExpPage() {
  const [meExp, setMeExp] = useState(0);
  const listHeader = [t("User.ranking"), t("User.nickname"), t("User.level"), t("User.variation")];
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
            getExpToLevel(getLevel(item.exp)),
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
      <Text style={styles.meSubText}>{1}{t("User.rank")}</Text>
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
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  me: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 15,
  },
  meText: {
    fontSize: 48, // fontSize: 'em은 부모 요소의 값, 24이므로 3em인 72가 됨',
    fontWeight: "bold",
  },
  meSubText: {
    fontSize: 24, // fontSize: 'em은 부모 요소의 값, 24이므로 3em인 72가 됨',
    fontWeight: "bold",
    color: "gray",
  },
  head: {
    height: 40,
    backgroundColor: mainColor,
    textAlign: "center",
  },
  headText: {
    margin: 6,
    color: "white",
    textAlign: "center",
  },
  text: {
    margin: 6,
    textAlign: "center",
  },
  buttonSmall: {
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 35,
  },
  buttonTextSmall: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});
