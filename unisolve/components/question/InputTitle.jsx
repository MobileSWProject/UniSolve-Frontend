import { StyleSheet, Text } from "react-native";

export default function InputTitle({ title = "title" }) {
  return <Text style={styles.text}>{title}</Text>;
}

const styles = StyleSheet.create({
  text: { color: "black", fontWeight: "600", fontSize: 18 },
});
