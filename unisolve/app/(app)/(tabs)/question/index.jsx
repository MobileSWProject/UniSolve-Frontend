import { Link, usePathname, useRouter } from "expo-router";
import { Text, View } from "react-native";
import styles from "../../../../styles/tabs/question/IndexStyles";
import MainButton from "../../../../components/tabs/question/MainButton";
import { useContext } from "react";
import { ImageContext } from "./_layout";
import * as ImagePicker from "expo-image-picker";

export default function Question() {
  // ImageContext에서 setImage를 가져옵니다.
  const { setImage } = useContext(ImageContext);

  // 라우팅을 위한 라우터와 현재 경로를 가져옵니다.
  const router = useRouter();
  const pathname = usePathname();

  // 버튼을 눌렀을 때 동작할 함수를 모아놓았습니다.
  const BtnHandleFunctions = {
    // 사진 촬영하기
    takePhoto: async () => {
      // 카메라 권한을 요청합니다.
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      // 카메라 권한 거부되었을 때
      if (status !== "granted") {
        console.log("Camera permissions not granted");
        return;
      }

      // 카메라를 실행하여 찍은 사진을 가져옵니다.
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      // 카메라 취소되지 않았을 때, 이미지를 setImage로 설정하고 다음 페이지로 이동시킵니다.
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        router.push(`${pathname}/subPage`);
      }
    },
    // 사진 첨부하기
    attachPhoto: async () => {
      // 앨범 권한을 요청합니다.
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      // 앨범 권한 거부되었을 때
      if (status !== "granted") {
        console.log("Media library permissions not granted");
        return;
      }
      // 앨범을 실행하여 사진을 가져옵니다.
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      // 사진 선택 취소되지 않았을 때, 이미지를 setImage로 설정하고 다음 페이지로 이동시킵니다.
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        router.push(`${pathname}/subPage`);
      }
    },
    // 바로 질문하기
    askQuestionImmediately: () => {
      setImage(null);
      router.push(`${pathname}/subPage`);
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
    </View>
  );
}
