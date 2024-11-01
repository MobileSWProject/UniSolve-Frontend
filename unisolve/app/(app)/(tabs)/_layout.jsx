import { useCallback, useState } from "react";
import { Tabs } from "expo-router";
import { TabBarIcon } from "../../../components/navigation/TabBarIcon";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import { View, Dimensions, TouchableOpacity } from "react-native";
import { mainColor } from "../../../constants/Colors";

const screenWidth = Dimensions.get("window").width;

function AnimatedIcon({ name, color, focused }) {
  const scale = useSharedValue(1);

  useFocusEffect(
    useCallback(() => {
      scale.value = withTiming(focused ? 1.2 : 1, { duration: 200 });
    }, [focused])
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TabBarIcon name={name} color={color} />
    </Animated.View>
  );
}

function TabUnderline({ index }) {
  const translateX = useSharedValue(0);
  const tabWidth = (screenWidth - 20) / 4;

  useFocusEffect(
    useCallback(() => {
      translateX.value = withTiming(index * tabWidth + (tabWidth - tabWidth * 0.4) / 2, { duration: 300 });
    }, [index, tabWidth])
  );

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }));

  return (
    <Animated.View
      style={[
        {
          height: 8,
          backgroundColor: mainColor,
          position: "absolute",
          bottom: 15,
          left: 10,
          borderRadius: 20,
          width: tabWidth * 0.4,
        },
        animatedStyle,
      ]}
    />
  );
}

export default function TabsLayout() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <View style={{ flex: 1 }}>
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
            borderRadius: 30,
            left: 10,
            right: 10,
            bottom: 10,
            position: "absolute",
          },
          tabBarLabelStyle: {
            opacity: 0,
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
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={() => {
                  props.onPress();
                  setSelectedIndex(0);
                }}
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
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={() => {
                  props.onPress();
                  setSelectedIndex(1);
                }}
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
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={() => {
                  props.onPress();
                  setSelectedIndex(2);
                }}
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
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={() => {
                  props.onPress();
                  setSelectedIndex(3);
                }}
              />
            ),
          }}
        />
      </Tabs>
      <TabUnderline index={selectedIndex} />
    </View>
  );
}
