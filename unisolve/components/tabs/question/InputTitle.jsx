// import { useState } from "react";

import { StyleSheet, Text } from "react-native";

export default function InputTitle({ title = "title" }) {
  // 로직들
  // const [state, setState] = useState("");

  // return jsx
  return <Text style={styles.text}>{title}</Text>;
}

const styles = StyleSheet.create({
  text: { color: "black", fontWeight: "600", fontSize: 18 },
});
