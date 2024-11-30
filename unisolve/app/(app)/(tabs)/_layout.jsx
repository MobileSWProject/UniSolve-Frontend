import React, { useCallback, useEffect } from "react";
import { View } from "react-native";
import { Tabs } from "expo-router";
import { TabBarIcon } from "../../../components/navigation/TabBarIcon";
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming, interpolateColor  } from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import { mainColor } from "../../../constants/Colors";

function AnimatedIcon({ name, color, focused }) {
  const scale = useSharedValue(focused ? 1.2 : 1); // 아이콘 크기
  const translateY = useSharedValue(0); // 원형 배경 위치 (Y축)
  const backgroundColor = useSharedValue(mainColor); // 배경 색상 애니메이션 값

  // 아이콘 크기 및 원형 배경 애니메이션
  useFocusEffect(
    useCallback(() => {
      // `focused` 값이 변경될 때마다 애니메이션 실행
      scale.value = withTiming(focused ? 1.35 : 1, { 
        duration: 300, 
        easing: Easing.out(Easing.ease),
      });

      // 원형 배경의 위치 애니메이션
      translateY.value = withTiming(focused ? -3 : 0, { duration: 200 });

      // 초기화하는 애니메이션 (같은 탭을 다시 눌렀을 때)
      return () => {
        scale.value = withTiming(1, { duration: 200 });
        translateY.value = withTiming(0, { duration: 200 });

        backgroundColor.value = withTiming(focused ? mainColor : "white", { duration: 200 });
      };
    }, [focused]) // `focused`가 변경될 때마다 애니메이션 실행
  );

  // 애니메이션 스타일 정의
  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    width: scale.value * 40, // 원형 배경 크기 (아이콘 크기에 비례)
    height: scale.value * 45,
    borderRadius: 50, // 원형 모양 (가로/세로 길이가 같아야 원)
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    transform: [
      { translateY: translateY.value }
    ],
    backgroundColor: interpolateColor(
      scale.value,   // scale 값에 따른 색상 변화
      [1, 1.01],     // 1 → 1.01
      ["transparent", mainColor] // transparent → mainColor
    ),
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Animated.View style={[animatedBackgroundStyle]} />
      <Animated.View style={[animatedIconStyle]}>
        <TabBarIcon name={name} color={color} />
      </Animated.View>
    </View>
  );
}

const BAR_HEIGHT = 54;

export default function TabsLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: mainColor }}>
      <Tabs
        initialRouteName="home"
        screenOptions={{
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "#CCC",
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "white",
            height: BAR_HEIGHT,
            borderRadius: 30,
            marginHorizontal: 15,
            marginBottom: 10,
          },
          tabBarLabelStyle: { opacity: 0, fontWeight: "bold", marginTop: 5 },
          tabBarHideOnKeyboard: true,
          tabBarLabelPosition: "below-icon",
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <AnimatedIcon name={focused ? "home-variant" : "home-variant-outline"} color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="community"
          options={{
            title: "Community",
            tabBarIcon: ({ color, focused }) => (
              <AnimatedIcon name={focused ? "chat-processing" : "chat-processing-outline"} color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="me"
          options={{
            title: "Me",
            tabBarIcon: ({ color, focused }) => (
              <AnimatedIcon name={focused ? "account" : "account-outline"} color={color} focused={focused} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
