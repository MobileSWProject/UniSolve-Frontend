import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { mainColor } from "../../constants/Colors";
import { styles } from "../../styles/form/FormStyle";
import { useTranslation } from "react-i18next";
import "../../i18n";

export default function Input({
  title,
  subTitle,
  subTitleConfirm,
  placeholder,
  content,
  onChangeText,
  disabled,
  maxLength,
  secure,
  buttonDisabled,
  buttonOnPress,
  buttonText,
  textArea,
  comment,
}) {
  const { t } = useTranslation();

  function lastConvert(text) {
    if (/^[가-힣]$/.test(text.charAt(text.length - 1)) && (text.charAt(text.length - 1).charCodeAt(0) - 44032) % 28 !== 0) {
      return t("Function.input_final");
    }
    else {
      return t("Function.input_nofinal");
    }
  }
  return (
    <View style={{ width: "93%" }}>
      <Text style={[styles.textTo, !title ? { marginLeft: 0 } : null]}>
        {title}
        {
          subTitle ?
          <Text style={[styles.textTo, { fontSize: 12, color: subTitleConfirm && subTitleConfirm ? "blue" : "red"}]}>({subTitle})</Text> :
          null
        }
      </Text>
      <View style={styles.view}>
        <TextInput
          style={[styles.inputTo, title && textArea ? { height: 280 } : null, {width: comment ? "94%" : buttonOnPress ? "80%" : "100%"}]}
          placeholder={placeholder ? placeholder : `${title}${lastConvert(title)} ${t("Function.input")}`}
          value={content}
          onChangeText={onChangeText}
          disabled={disabled}
          maxLength={maxLength ? maxLength : null}
          secureTextEntry={secure ? secure : null}
          multiline={textArea ? true : false}
        />
        {
          buttonOnPress ?
          <TouchableOpacity disabled={buttonDisabled} style={[ styles.buttonSmall, { backgroundColor: buttonDisabled ? "gray" : mainColor }, ]} onPress={buttonOnPress} >
            <Text style={styles.buttonTextSmall}>{buttonText ? buttonText : t("Function.confirm")}</Text>
          </TouchableOpacity> :
          null
        }
      </View>
    </View>
  );
}
