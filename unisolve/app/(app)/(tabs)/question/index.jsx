import { Link, usePathname, useRouter } from "expo-router";
import { Text, View } from "react-native";
import styles from "../../../../styles/tabs/question/IndexStyles";
import MainButton from "../../../../components/tabs/question/MainButton";

export default function Question() {
  const router = useRouter();

  // 버튼을 눌렀을 때 동작할 함수를 모아놓았습니다.
  const BtnHandleFunctions = {
    takePhoto: () => {
      console.log("사진 촬영하기로 이동");
    },
    attachPhoto: () => {
      console.log("사진 첨부하기로 이동");
    },
    askQuestionImmediately: () => {
      console.log("바로 질문하기로 이동");
    },
  };

  return (
    <View style={styles.container}>
      <MainButton
        text={"사진 촬영하기"}
        onPress={BtnHandleFunctions.takePhoto}
      />
      <MainButton
        text={"사진 첨부하기"}
        onPress={BtnHandleFunctions.attachPhoto}
      />
      <MainButton
        text={"바로 질문하기"}
        onPress={BtnHandleFunctions.askQuestionImmediately}
      />
      {/* <Link href={`${pathname}/subPage`}>Go To SubPage</Link> */}
    </View>
  );
}
