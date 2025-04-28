import { ThemedText } from "@/src/components/ThemedText";
import { useTheme } from "@/src/Context/ThemeContext";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {

  return (
    <SafeAreaView>
      <ThemedText>SearchScreen</ThemedText>
    </SafeAreaView>
  );
}
