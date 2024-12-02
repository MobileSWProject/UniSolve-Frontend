import { Switch } from "react-native";
import { mainColor } from "../../constants/Colors";

export default function SwitchBtn({ disabled, trueColor, value, setValue }) {
  return (
    <Switch
      disabled={disabled}
      trackColor={{ false: "#767577", true: trueColor || mainColor }}
      thumbColor="white"
      ios_backgroundColor="#3e3e3e"
      onValueChange={setValue}
      value={value}
    />
  );
}
