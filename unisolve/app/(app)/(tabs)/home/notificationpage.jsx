import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function HomeSubPage() {
  const router = useRouter();

  return (
    <View>
      <Text>notification Page</Text>
      <TouchableOpacity onPress={() => router.back()}>
        <Text>Back</Text>
      </TouchableOpacity>
    </View>
  );
}
