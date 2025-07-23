import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@/src/Context/ThemeContext";
import PriceFormatter from "./PriceFormatter";
import ThemedText from "./ThemedText"; // Assuming you have this component

const PriceBadge = ({ item, style = {} }) => {
  const { theme } = useTheme();

  return (
    <View 
      style={[
        styles.priceBadge,
        { backgroundColor: theme.cardBackground },
        style
      ]}
    >
      {/* Use PriceFormatter to convert and format the price */}
      <PriceFormatter
        priceInUSD={item.price}
        TextComponent={ThemedText}
        style={styles.priceText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  priceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  priceText: {
    fontWeight: "600",
  }
});

export default PriceBadge;