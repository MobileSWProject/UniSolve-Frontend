import { Tabs } from "expo-router";
import { TabBarIcon } from "../../../components/navigation/TabBarIcon";
import { mainColor } from "../../../constants/Colors";

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="home/index"
      screenOptions={{
        tabBarActiveTintColor: mainColor,
        tabBarInactiveTintColor: "#000",
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          elevation: 0,
          backgroundColor: "#fff",
          height: 50,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home-variant" : "home-variant-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="question"
        options={{
          title: "Question",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "comment-question" : "comment-question-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "chat-processing" : "chat-processing-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: "Me",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "account" : "account-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
