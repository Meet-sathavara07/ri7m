import React, { useState } from "react";
import * as Haptics from "expo-haptics";
import CircularButton from "./CircularButtons";
import { useTheme } from "@/src/Context/ThemeContext";

const SaveButton = ({ onSave, initialSaved = false }) => {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const { theme } = useTheme();

  const handleSave = async () => {
    try {
      // Toggle saved state
      setIsSaved(!isSaved);
      
      // Call the callback if provided
      if (onSave) {
        onSave(!isSaved);
      }
      
      // Add haptic feedback
      await Haptics.impactAsync(
        isSaved
          ? Haptics.ImpactFeedbackStyle.Light
          : Haptics.ImpactFeedbackStyle.Medium
      );
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  return (
    <CircularButton
      iconName={isSaved ? "bookmark" : "bookmark-outline"}
      label={isSaved ? "Saved" : "Save"}
      onPress={handleSave}
      color={isSaved ? theme.primary : theme.icon}
    />
  );
};

export default SaveButton;