import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * [lsw]
 * Question 탭의 메인화면에서 사용할
 * 버튼을 위한 컴포넌트입니다.
 */

export default function IndexButton({ text, onPress }) {
  // 로직들
  // const [state, setState] = useState("");

  // return jsx
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#d9d9d9",
    width: 240,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  text: {
    fontWeight: "900",
    fontSize: 24,
  },
});
