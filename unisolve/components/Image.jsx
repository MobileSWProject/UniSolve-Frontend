import { View, Image, Text, TouchableOpacity } from "react-native";
import { mainColor } from "../constants/Colors";
import { styles } from "../styles/form/FormStyle";

export default function InputProcess({ visible, setVisible, image }) {
  return (
    <>
      <Image source={{ uri: image.image }} style={styles.image} />
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={[styles.buttonSmall, { backgroundColor: "#ff0000" }]}
          onPress={() => { setVisible(false); image.setImage(null); }}
        >
          <Text style={styles.buttonTextSmall}>삭제</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonSmall, { backgroundColor: mainColor }]}
          onPress={() => { setVisible(false); }}
        >
          <Text style={styles.buttonTextSmall}>닫기</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
