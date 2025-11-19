import React, { useState } from "react";
import * as Haptics from "expo-haptics";
import CircularButton from "./CircularButtons";
import { useTheme } from "@/src/Context/ThemeContext";
import { ThemedText } from "../../ThemedText";

const LikeButton = ({ onLike, initialLiked = false }) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const { theme } = useTheme();

  const handleLike = async () => {
    try {
      // Toggle liked state
      setIsLiked(!isLiked);
      
      // Call the callback if provided
      if (onLike) {
        onLike(!isLiked);
      }
      
      // Add haptic feedback
      await Haptics.impactAsync(
        isLiked
          ? Haptics.ImpactFeedbackStyle.Light
          : Haptics.ImpactFeedbackStyle.Medium
      );
    } catch (error) {
      console.error("Error liking:", error);
    }
  };

  return (
    <CircularButton
      iconName={isLiked ? "heart" : "heart-outline"}
      label={isLiked ? "Liked" : "Like"}
      onPress={handleLike}
      color={isLiked ? "#FF0000" : theme.icon}
    />
  );
};

export default LikeButton;