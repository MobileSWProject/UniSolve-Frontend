import { useFocusEffect, usePathname } from "expo-router";
import { ScrollView, View, Text, StyleSheet, FlatList } from 'react-native';
import { useState, useCallback } from "react";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import _axios from '../../../../api';

export default function expPage() {
  const pathname = usePathname();
  const [meExp, setMeExp] = useState(0);
  const [saltList, setSaltList] = useState([ //백엔드에서 Array[Object] 형태로 response
    { id: 0 }, { id: 0 },
    { id: 1, coin: 50, bouns: 10, price: 5000 },
    { id: 2, coin: 300, bouns: 50, price: 20000 },
    { id: 3, coin: 600, bouns: 200, price: 35000 },
    { id: 4, coin: 1000, bouns: 350, price: 50000 },
  ]);

  useFocusEffect(
    useCallback(() => {
      _axios
        .get("/userinfo")
        .then((response) => {
          setMeExp(response.data.data.exp);
        })
        .catch((error) => {
          router.replace("/");
        });
    }, [])
  );

  // 링크로 접속 시 auth 인증 value가 없으면 Login 화면으로 리다이렉트
  const items = ({item, index}) => {
    if (index === 0){
      return (
        <View style={styles.items} href={`${pathname}/daycheck`}>
          <View style={styles.list}>
            <MaterialCommunityIcons name="calendar-heart" size={24} color="black" />
            <Text style={styles.salt}>일일 출석 체크하고 보너스 받기</Text>
          </View>
        </View>
      )
    } else if (index === 1){
      return (
        <View style={styles.items} href={`${pathname}/ads`}>
          <View style={styles.list}>
            <MaterialIcons name="movie-filter" size={24} color="black" />
            <Text style={styles.salt}>광고보고 보너스 받기</Text>
          </View>
        </View>
      )
    } else {
      return (
        <View style={styles.items} href={`${pathname}/${item.id}`}>
          <View style={styles.list}>
            <MaterialCommunityIcons name="sprinkler-variant" size={24} color="black" />
            <Text style={styles.salt}>{numConvert(item.coin)}</Text>
            <Text style={styles.saltbonus}>+{numConvert(item.bouns)}</Text>
            <Text style={styles.saltbonus}>개</Text>
          </View>
          <Text style={styles.price}>{numConvert(item.price)}원</Text>
        </View>
      )
    }
  }
  const numConvert = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  return (
  <>
    <View style={styles.me}>
      <MaterialCommunityIcons name="sprinkler-variant" size={'3em'} color="black" />
      <Text style={styles.meText}>{numConvert(meExp)}</Text>
    </View>
    <ScrollView>
      <FlatList
        data={saltList}
        keyExtractor={item => item.id}
        renderItem={items}
      />
    </ScrollView>
  </>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  me: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 15,
    marginTop: 15,
    marginBottom: 15,
  },
  meText: {
    fontSize: 72, // fontSize: 'em은 부모 요소의 값, 24이므로 3em인 72가 됨',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  items: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#DADADA',
    padding: 15,
    borderRadius: 15,
    marginVertical: 2,
    marginHorizontal: 10,
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  salt: {
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
    fontSize: 16,
  },
  saltbonus: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#888',
    marginLeft: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});