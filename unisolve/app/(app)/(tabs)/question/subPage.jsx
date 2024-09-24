import { useRouter } from "expo-router";
import { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ImageContext } from "./_layout";

export default function QuestionSubPage() {
  const router = useRouter();
  const { image } = useContext(ImageContext);
  console.log(image);

  return (
    <View>
      <Text>Question Sub Page</Text>
      <TouchableOpacity onPress={() => router.back()}>
        <Text>Back</Text>
      </TouchableOpacity>
    </View>
  );
}
