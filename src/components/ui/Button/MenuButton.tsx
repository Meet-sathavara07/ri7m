import React from "react";
import CircularButton from "./CircularButtons";
import * as Haptics from "expo-haptics";

const MenuButton = ({ onPress }) => {
  const handlePress = async () => {
    try {
      // Add haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // Call the callback to open the page/menu
      if (onPress) {
        onPress();
      }
    } catch (error) {
      console.error("Error opening menu:", error);
    }
  };

  return (
    <CircularButton
      iconName="ellipsis-horizontal"
      label="Menu"
      onPress={handlePress}
    />
  );
};

export default MenuButton;