import { Link, usePathname } from "expo-router";
import { Text, View } from "react-native";

export default function History() {
  const pathname = usePathname();

  return (
    <View>
      <Text>History</Text>
      <Link href={`${pathname}/subPage`}>Go To SubPage</Link>
    </View>
  );
}
