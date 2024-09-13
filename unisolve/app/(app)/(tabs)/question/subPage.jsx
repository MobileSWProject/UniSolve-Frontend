import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function QuestionSubPage() {
  const router = useRouter();

  return (
    <View>
      <Text>Question Sub Page</Text>
      <TouchableOpacity onPress={() => router.back()}>
        <Text>Back</Text>
      </TouchableOpacity>
    </View>
  );
}
