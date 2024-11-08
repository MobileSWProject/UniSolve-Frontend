import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { animated, useSpring } from "react-spring";

const boxColor = "#c0c0c0";
const contentColor = "#d4d4d4";

export default function SkeletonList({ length = 10 }) {
  return (
    <>
      <View style={styles.container}>
        {Array.from({ length: length }, (_, i) => i).map((i) => (
          <Item
            key={i}
            index={i}
          />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    marginBottom: 30,
  },
});

const Item = ({ index = 0 }) => {
  const AnimatedView = animated(View);
  const [springs, api] = useSpring(() => ({ from: { opacity: 0.6 } }));

  useEffect(() => {
    api.start({
      from: { opacity: 0.6 },
      to: { opacity: 0.35 },
      loop: { reverse: true },
      config: { duration: 700 },
    });
  }, [api]);

  const seed = 540;
  const [minTitleWidth, maxTitleWidth] = [120, 180];
  const [minContentWidth, maxContentWidth] = [100, 200];

  // 넓이 계산 공식
  const titleWidth =
    (((Math.sin(seed * (index + 1)) + 1) * 10000) %
      (maxTitleWidth - minTitleWidth + 1)) +
    minTitleWidth;

  const contentWidth =
    (((Math.cos(seed * (index + 1)) + 1) * 10000) %
      (maxContentWidth - minContentWidth + 1)) +
    minContentWidth;

  return (
    <>
      <AnimatedView style={{ ...itemStyles.listItemBox, ...springs }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 2,
          }}
        >
          <View style={[itemStyles.content, { width: 110, height: 10 }]} />
          <View style={[itemStyles.content, { width: 60, height: 8 }]} />
        </View>
        <View style={[itemStyles.content, { width: titleWidth, height: 12 }]} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={[itemStyles.content, { width: contentWidth, height: 9 }]}
          />
          <View style={[itemStyles.content, { width: 22, height: 16 }]} />
        </View>
      </AnimatedView>
    </>
  );
};

const itemStyles = StyleSheet.create({
  listItemBox: {
    // backgroundColor: boxColor,
    borderRadius: 20,
    padding: 15,
    gap: 12,
    marginVertical: 2,
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: "#ffffff00",
    borderTopColor: "#fff",
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
  content: {
    backgroundColor: contentColor,
    borderRadius: 50,
  },
});
