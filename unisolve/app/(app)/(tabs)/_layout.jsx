import { useCallback } from "react";
import { Tabs } from "expo-router";
import { TabBarIcon } from "../../../components/navigation/TabBarIcon";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import { View, TouchableOpacity } from "react-native";
import { mainColor } from "../../../constants/Colors";

function AnimatedIcon({ name, color, focused }) {
  const scale = useSharedValue(1);
  useFocusEffect(
    useCallback(() => {
      scale.value = withTiming(focused ? 1.35 : 1, { duration: 200 }); // 아이콘을 누르면 점점 커짐
    }, [focused])
  );
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={[animatedStyle, {height: BAR_HEIGHT, marginBottom: -7, justifyContent: "center"}]}>
      <TabBarIcon name={name} color={color}/>
    </Animated.View>
  );
}

const BAR_HEIGHT = 54

export default function TabsLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: mainColor }}>
      <Tabs
        initialRouteName="home"
        screenOptions={{
          tabBarActiveTintColor: "opacity",
          tabBarInactiveTintColor: "#222",
          headerShown: false,
          
          tabBarStyle: {
            height: BAR_HEIGHT,
            shadowColor: "#000",
            borderRadius: 30,
            marginHorizontal: 20,
            marginBottom: 20,
            paddingBottom: 0,
            
            // bottom: 10,
            // position: "absolute",
          },
          tabBarLabelStyle: { opacity: 0, height: 0},
          // tabBarIconStyle: { marginBottom: -5, },
          tabBarHideOnKeyboard: true,
          tabBarLabelPosition: "below-icon",
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => ( <AnimatedIcon name={focused ? "home-variant" : "home-variant-outline"} color={color} focused={focused} /> ),
            // tabBarButton: (props) => ( <TouchableOpacity {...props} onPress={() => { props.onPress(); }} />
            // ),
          }}
        />
        <Tabs.Screen
          name="community"
          options={{
            title: "Community",
            tabBarIcon: ({ color, focused }) => ( <AnimatedIcon name={focused ? "chat-processing" : "chat-processing-outline"} color={color} focused={focused} /> ),
            // tabBarButton: (props) => ( <TouchableOpacity {...props} onPress={() => { props.onPress(); }} /> ),
          }}
        />
        <Tabs.Screen
          name="me"
          options={{
            title: "Me",
            tabBarIcon: ({ color, focused }) => ( <AnimatedIcon name={focused ? "account" : "account-outline"} color={color} focused={focused} /> ),
            // tabBarButton: (props) => ( <TouchableOpacity {...props} onPress={() => { props.onPress(); }} /> ),
          }}
        />
      </Tabs>
    </View>
  );
}
