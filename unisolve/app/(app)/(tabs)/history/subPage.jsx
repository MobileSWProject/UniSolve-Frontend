import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function HistorySubPage() {
  const router = useRouter();

  return (
    <View>
      <Text>History Sub Page</Text>
      <TouchableOpacity onPress={() => router.back()}>
        <Text>Back</Text>
      </TouchableOpacity>
    </View>
  );
}
