import React from "react";
import * as Haptics from "expo-haptics";
import { Share } from "react-native";
import CircularButton from "./CircularButtons";

const ShareButton = ({ title, message, url }) => {
  const handleShare = async () => {
    try {
      await Share.share({
        title: title || "Check this out!",
        message: message || "I thought you might find this interesting.",
        url: url
      });
      
      // Add haptic feedback on success
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Error sharing:", error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <CircularButton
      iconName="share-social"
      label="Share"
      onPress={handleShare}
    />
  );
};

export default ShareButton;