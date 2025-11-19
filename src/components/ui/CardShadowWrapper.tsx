import { useTheme } from "@/src/Context/ThemeContext";
import { darkTheme } from "@/src/theme/theme";
import React from "react";
import { View, Platform, StyleSheet } from "react-native";

const CardShadowWrapper = ({ children, style }) => {
  const { theme } = useTheme();
  
  // Dynamically create styles based on the current theme
  const dynamicStyles = StyleSheet.create({
    wrapper: {
      marginHorizontal: 4,
      marginBottom: 20,
      borderRadius: 16,
    },
    shadowBox: {
      borderRadius: 16,
      backgroundColor: theme.background, // Use theme background color
      ...Platform.select({
        ios: {
          shadowColor: theme.primary, // Use theme primary color for shadow
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: theme === darkTheme ? 0.5 : 0.2, // Adjust opacity based on theme
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
          shadowColor: theme.primary, // Use theme primary color for shadow
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: theme === darkTheme ? 0.4 : 0.1, // Adjust opacity based on theme
          shadowRadius: 6,
        },
      }),
    },
  });

  return (
    <View style={[dynamicStyles.wrapper, style]}>
      <View style={dynamicStyles.shadowBox}>{children}</View>
    </View>
  );
};

export default CardShadowWrapper;