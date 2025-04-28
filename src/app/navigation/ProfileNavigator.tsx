// ProfileNavigator.js
import React, { forwardRef, useImperativeHandle } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "../screens/profile/ProfileScreen";
import AccountScreen from "../native/AccountScreen";
import SettingScreen from "../native/SettingScreen";
import { useTheme } from "@/src/Context/ThemeContext";
import { CommonActions, useNavigation } from "@react-navigation/native";

const Stack = createStackNavigator();

// eslint-disable-next-line react/display-name
const ProfileNavigator = forwardRef((props, ref) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  useImperativeHandle(ref, () => ({
    resetToMainProfile: () => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "ProfileMain" }],
        })
      );
    },
  }));

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: theme.text,
        headerStyle: { backgroundColor: theme.background },
        cardStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Settings" component={SettingScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
    </Stack.Navigator>
  );
});

export default ProfileNavigator;
