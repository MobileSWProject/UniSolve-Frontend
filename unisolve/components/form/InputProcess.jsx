import { View, Text, TouchableOpacity } from "react-native";
import { mainColor } from "../../constants/Colors";
import { styles } from "../../styles/form/FormStyle";
import { useTranslation } from 'react-i18next';
import "../../i18n";

export default function InputProcess({ setVisible, type, onPress, content, cancel, disabled }) {
  const { t } = useTranslation();
  
  return (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity
        disabled={cancel ? cancel : false}
        style={[styles.buttonSmall, { backgroundColor: cancel ? "gray" : mainColor }]}
        onPress={() => { setVisible(false); }}
      >
        <Text style={styles.buttonTextSmall}>{t("Function.cancel")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={disabled ? disabled : false}
        style={[styles.buttonSmall, { backgroundColor: disabled ? "gray" : type ? "#FF0000" : mainColor }]}
        onPress={onPress}
      >
        <Text style={styles.buttonTextSmall}>{content}</Text>
      </TouchableOpacity>
    </View>
  );
}