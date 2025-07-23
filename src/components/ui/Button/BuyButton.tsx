import React, { useState } from "react";
import * as Haptics from "expo-haptics";
import CircularButton from "./CircularButtons";
import { useTheme } from "@/src/Context/ThemeContext";
import { useCurrency } from "@/src/Context/CurrencyContext";

const BuyButton = ({ onBuy, price }) => {
  const { theme } = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);
  const { formatPrice } = useCurrency();

  const handleBuy = async () => {
    if (isProcessing) return; // Prevent multiple clicks
    
    try {
      setIsProcessing(true);
      // Add haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      
      // Call the callback if provided
      if (onBuy) {
        await onBuy(); // Assume onBuy is async for real-world use
      }
    } catch (error) {
      console.error("Error in buy action:", error);
      // Optionally show error feedback to the user
    } finally {
      setIsProcessing(false);
    }
  };

  // Use the currency formatter to convert and format the price from USD
  const formattedPrice = price != null ? formatPrice(price) : "Buy";

  return (
    <CircularButton
      iconName={isProcessing ? "hourglass-outline" : "cart-outline"}
      label={isProcessing ? "Processing..." : formattedPrice}
      onPress={handleBuy}
      color={theme.primary}
      disabled={isProcessing}
      accessibilityLabel={`Buy ingredients for ${formattedPrice}`}
    />
  );
};

export default BuyButton;