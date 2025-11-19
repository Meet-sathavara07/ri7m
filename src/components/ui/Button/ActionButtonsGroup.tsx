import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/src/Context/ThemeContext";

const ActionButtonsGroup = ({ children, horizontal = true }) => {
  const { theme } = useTheme();

  return (
    <View style={[
      styles.container, 
      horizontal ? styles.horizontal : styles.vertical,
      { backgroundColor: theme.card }
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    margin: 8,
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  vertical: {
    flexDirection: "column",
    alignItems: "center",
  },
});

export default ActionButtonsGroup;