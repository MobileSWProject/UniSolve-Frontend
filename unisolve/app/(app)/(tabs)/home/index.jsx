import { Link, usePathname } from "expo-router";
import { Text, View } from "react-native";

export default function Home() {
  const pathname = usePathname();

  return (
    <View>
      <Text>Home</Text>
      <Link href={`${pathname}/subPage`}>test</Link>
    </View>
  );
}
