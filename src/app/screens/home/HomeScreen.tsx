import { ThemedText } from "@/src/components/ThemedText";
import { ThemeToggle } from "@/src/components/ThemeToggle";
import { useTheme } from "@/src/Context/ThemeContext";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
    const { theme, themeOption, changeTheme, THEME_OPTIONS } = useTheme();
  
  return (
    <SafeAreaView>
      <View>
        <ThemedText>HomeScreen</ThemedText>
        <ThemeToggle />
      </View>
    </SafeAreaView>
  );
}
