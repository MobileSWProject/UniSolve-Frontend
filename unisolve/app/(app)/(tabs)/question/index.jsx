import { Link, usePathname } from "expo-router";
import { Text, View } from "react-native";

export default function Question() {
  const pathname = usePathname();

  return (
    <View>
      <Text>Question</Text>
      <Link href={`${pathname}/subPage`}>Go To SubPage</Link>
    </View>
  );
}
