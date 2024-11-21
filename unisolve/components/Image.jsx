import { View, Image, Text, TouchableOpacity } from "react-native";
import { mainColor } from "../constants/Colors";
import { styles } from "../styles/form/FormStyle";
import { useTranslation } from 'react-i18next';
import "../i18n";

export default function InputProcess({ setVisible, image }) {
  const { t } = useTranslation();
  return (
    <>
      <Image source={{ uri: image.image }} style={styles.image} />
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={[styles.buttonSmall, { backgroundColor: "#ff0000" }]}
          onPress={() => { setVisible(false); image.setImage(null); }}
        >
          <Text style={styles.buttonTextSmall}>{t("Function.delete")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonSmall, { backgroundColor: mainColor }]}
          onPress={() => { setVisible(false); }}
        >
          <Text style={styles.buttonTextSmall}>{t("Function.confirm")}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
