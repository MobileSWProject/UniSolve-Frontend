import { Link, usePathname } from "expo-router";
import { Text, View } from "react-native";

export default function Community() {
  const pathname = usePathname();

  return (
    <View>
      <Text>Community</Text>
      <Link href={`${pathname}/subPage`}>Go To SubPage</Link>
    </View>
  );
}
