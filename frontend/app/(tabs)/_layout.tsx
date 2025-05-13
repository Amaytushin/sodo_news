import { Tabs } from "expo-router";
import { FontAwesome, AntDesign } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "Home page",
          title: "Нүүр",
          tabBarIcon: () => <FontAwesome size={28} name="home" color="purple" />,
        }}
      ></Tabs.Screen>

      <Tabs.Screen
        name="search"
        options={{
          headerTitle: "Search page",
          title: "Хайх",
          tabBarIcon: () => <FontAwesome size={28} name="search" color="purple" />,
        }}
      ></Tabs.Screen>
    </Tabs>
  );
}
