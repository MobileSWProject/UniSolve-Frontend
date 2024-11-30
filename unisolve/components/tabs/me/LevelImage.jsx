import { Image } from "react-native";
import { getLevel } from "../../../utils/expUtils";
const images = [
  require(`../../../assets/icons/lv0.png`),
  require(`../../../assets/icons/lv1.png`),
  require(`../../../assets/icons/lv2.png`),
  require(`../../../assets/icons/lv3.png`),
  require(`../../../assets/icons/lv4.png`),
  require(`../../../assets/icons/lv5.png`),
  require(`../../../assets/icons/lv6.png`),
  require(`../../../assets/icons/lv7.png`),
  require(`../../../assets/icons/lv8.png`),
  require(`../../../assets/icons/lv9.png`),
  require(`../../../assets/icons/lvAI.png`),
];
export default function LevelImage({ exp, size = 120 }) {
  return (
    <Image
      source={images[exp === -1 ? 10 : getLevel(exp)]}
      style={{ width: size, height: size }}
    />
  );
}
