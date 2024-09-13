import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View>
        <Text type="title">This screen doesn't exist.</Text>
        <Link
          href="/"
          replace
        >
          <Text type="link">Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
