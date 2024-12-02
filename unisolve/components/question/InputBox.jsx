import { Platform, StyleSheet, TextInput } from "react-native";

export default function InputBox({
  width = "full",
  height = 100,
  multiline = false,
  style = {},
  setState,
}) {
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
