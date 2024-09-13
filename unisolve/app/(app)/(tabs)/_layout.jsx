import { Tabs } from "expo-router";
import { TabBarIcon } from "../../../components/navigation/TabBarIcon";
import { mainColor } from "../../../constants/Colors";

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="tab1"
      screenOptions={{
        tabBarActiveTintColor: mainColor,
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tabs.Screen
        name="tab1"
        options={{
          title: "홈",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home-variant" : "home-variant-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tab2"
        options={{
          title: "질문하기",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "comment-question" : "comment-question-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tab3"
        options={{
          title: "커뮤니티",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "chat-processing" : "chat-processing-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tab4"
        options={{
          title: "히스토리",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={"history"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
