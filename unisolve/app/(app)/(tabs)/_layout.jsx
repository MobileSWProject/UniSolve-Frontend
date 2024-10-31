import { useCallback } from "react";
import { Tabs } from "expo-router";
import { TabBarIcon } from "../../../components/navigation/TabBarIcon";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat } from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import { mainColor } from "../../../constants/Colors";

function AnimatedIcon({ name, color, focused }) {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      scale.value = 1;
      translateX.value = 0;
      scale.value = withTiming(focused ? 1.5 : 1, { duration: 200 });
      if (focused) {
        translateX.value = withRepeat( withTiming(3, { duration: 100 }), 4, true );
      }
    }, [focused])
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: translateX.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TabBarIcon name={name} color={color} />
    </Animated.View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="home/index"
      screenOptions={{
        tabBarActiveTintColor: mainColor,
        tabBarInactiveTintColor: "#222",
        headerShown: false,
        tabBarStyle: {
          height: 60,
          shadowColor: "#000",
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 5,
        },
        tabBarIconStyle: {
          marginBottom: -5,
        },
        tabBarHideOnKeyboard: true,
        tabBarLabelPosition: "below-icon",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon
              name={focused ? "home-variant" : "home-variant-outline"}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="question"
        options={{
          title: "Question",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon
              name={focused ? "comment-question" : "comment-question-outline"}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon
              name={focused ? "chat-processing" : "chat-processing-outline"}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: "Me",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon
              name={focused ? "account" : "account-outline"}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
