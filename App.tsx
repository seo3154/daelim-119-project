import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "./screens/main-screen";
import TestScreen from "./screens/test/test-screen";
import EmergencyRoomScreen from "./screens/emergency-room/emergency-room-screen";
import FirstAidScreen from "./screens/first-aid/first-aid-screen";
import BookmarkScreen from "./screens/bookmark/bookmark-screen";
import EmergencyConditionSearchScreen from "./screens/emergency-condition-search/emergency-condition-search-screen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="TestScreen" component={TestScreen} />
        <Stack.Screen
          name="EmergencyRoomScreen"
          component={EmergencyRoomScreen}
        />
        <Stack.Screen name="FirstAidScreen" component={FirstAidScreen} />
        <Stack.Screen name="BookmarkScreen" component={BookmarkScreen} />
        <Stack.Screen
          name="EmergencyConditionSearchScreen"
          component={EmergencyConditionSearchScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
