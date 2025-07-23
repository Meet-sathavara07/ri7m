import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/Context/ThemeContext";
import { ThemedText } from "../../ThemedText";

const CircularButton = ({ iconName, label, onPress, size = 55, color }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <View
        style={[
          styles.iconCircle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: theme.border,
          },
        ]}
      >
        <Ionicons name={iconName} size={24} color={color || theme.icon} />
      </View>
      <ThemedText style={styles.buttonLabel}>{label}</ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    padding: 8,
  },
  iconCircle: {
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  buttonLabel: {
    fontSize: 14,
    textAlign: "center",
  },
});

export default CircularButton;