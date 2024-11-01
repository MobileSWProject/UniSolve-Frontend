import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { mainColor } from "../../constants/Colors";
import { styles } from "../../styles/form/FormStyle";

export default function Input({ title, subTitle, subTitleConfirm, placeholder, content, onChangeText, disabled, maxLength, secure, buttonDisabled, buttonOnPress, buttonText }) {
  function lastConvert(text) {
    if (/^[가-힣]$/.test(text.charAt(text.length - 1)) && (text.charAt(text.length - 1).charCodeAt(0) - 44032) % 28 !== 0) return "을";
    else return "를";
  }
  return (
    <>
      <Text style={styles.textTo}>
        {title}
        {
          subTitle ?
          <Text style={[styles.textTo, { fontSize: 12, color: subTitleConfirm && subTitleConfirm ? "blue" : "red" }]}>
            ({subTitle})
          </Text> :
          null
        }
      </Text>
      <View style={styles.view}>
        <TextInput
          style={styles.inputTo}
          placeholder={placeholder ? placeholder : `${title}${lastConvert(title)} 입력하세요.`}
          value={content}
          onChangeText={onChangeText}
          disabled={disabled}
          maxLength={maxLength ? maxLength : null}
          secureTextEntry={secure ? secure : null}
        />
        {
          buttonOnPress ?
          <TouchableOpacity
            disabled={buttonDisabled}
            style={[styles.buttonSmall, { backgroundColor: buttonDisabled ? "gray" : mainColor }]}
            onPress={buttonOnPress}
          >
            <Text style={styles.buttonTextSmall}>
              {buttonText ? buttonText : "확인"}
            </Text>
          </TouchableOpacity> : 
          null
        }
      </View>
    </>
  );
}