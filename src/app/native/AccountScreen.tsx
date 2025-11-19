/* eslint-disable @typescript-eslint/no-unused-vars */
// AccountScreen.jsx
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/src/Context/ThemeContext";
import { ThemedText } from "@/src/components/ThemedText";
import { ThemeToggle } from "@/src/components/ThemeToggle";

export default function AccountScreen() {
  const { theme, themeOption, changeTheme, THEME_OPTIONS } = useTheme();

  return (
    <View >
      <ThemedText> accout</ThemedText>
      <ThemeToggle />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginVertical: 20,
  },
  themeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  themeButton: {
    flex: 1,
    marginHorizontal: 4,
  }
});