import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function HomeSubPage() {
  const router = useRouter();

  return (
    <View>
      <Text>질문하기 구현중...(여기에 질문하기 페이지 추가)</Text> 
      <TouchableOpacity onPress={() => router.back()}>
        <Text>Back</Text>
      </TouchableOpacity>
    </View>
  );
}
