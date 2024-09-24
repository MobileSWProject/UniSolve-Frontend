// import { useState } from "react";

import { Platform, StyleSheet, TextInput } from "react-native";
import { mainColor } from "../../../constants/Colors";

export default function InputBox({
  width = "full",
  height = 100,
  multiline = false,
  style = {},
  setState,
}) {
  // 로직들
  // const [state, setState] = useState("");

  // return jsx
  return (
    <TextInput
      style={[styles.contentInput, { width, height }, style]}
      multiline={multiline}
      onChangeText={(text) => setState(text)}
    />
  );
}

const styles = StyleSheet.create({
  contentInput: {
    color: "black",
    borderColor: "black",
    borderWidth: 2,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
  },
});
