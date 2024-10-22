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

export function getExpToLevel(index) {
  const ExpToLevel = [
    "신생아",
    "유치원생",
    "초등학생",
    "중학생",
    "고등학생",
    "대학생(학사)",
    "석사",
    "박사",
    "교수",
    "전문가",
  ];
  return ExpToLevel[index];
};
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
  const listHeader = ["순위", "닉네임", "레벨", "증감"];
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
      <Text style={styles.meSubText}>1위</Text>
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
            <Text style={styles.buttonTextSmall}>이전</Text>
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
            <Text style={styles.buttonTextSmall}>내 순위</Text>
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
            <Text style={styles.buttonTextSmall}>다음</Text>
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
