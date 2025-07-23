import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import ActionButtonsGroup from "./ActionButtonsGroup";
import SaveButton from "./SaveButton";
import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";
import BuyButton from "./BuyButton";
import MenuButton from "./MenuButton";
import { ThemedText } from "../../ThemedText";
import { useTheme } from "@/src/Context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const RecipeActions = ({ recipe }) => {
  const { theme } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [statusMessage, setStatusMessage] = useState("");

  const handleSave = (isSaved) => {
    console.log(`Recipe ${isSaved ? "saved" : "unsaved"}`);
    // Your save logic here
  };

  const handleLike = (isLiked) => {
    console.log(`Recipe ${isLiked ? "liked" : "unliked"}`);
    // Your like logic here
  };

 

  const openMenu = () => {
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  useEffect(() => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 500, // Slower animation (500ms)
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500, // Slower animation (500ms)
        useNativeDriver: true,
      }).start();
    }
  }, [menuVisible]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT * 0.4, 0], // Slide from bottom (40% of screen height)
  });

  return (
    <View style={styles.container}>
      {/* Main recipe actions */}
      <ActionButtonsGroup>
        <BuyButton price={recipe.price} />
        <MenuButton onPress={openMenu} />
      </ActionButtonsGroup>

      {/* Menu Modal */}
      <Modal visible={menuVisible} transparent={true} onRequestClose={closeMenu}>
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={[styles.modalOverlay]}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.modalContent,
                  {
                    backgroundColor: theme.background,
                    height: SCREEN_HEIGHT * 0.4, // Set height to 40% of screen
                    maxHeight: SCREEN_HEIGHT * 0.4, // Ensure max height is 40%
                    transform: [{ translateY }],
                  },
                ]}
              >
                <ActionButtonsGroup horizontal={true}>
                  <SaveButton onSave={handleSave} />
                  <LikeButton onLike={handleLike} />
                  <ShareButton
                    title={recipe.name}
                    message={`Check out this delicious ${recipe.name} recipe!`}
                    url={recipe.image}
                  />

                </ActionButtonsGroup>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
 
  modalContent: {
    flexDirection: "column",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
});

export default RecipeActions;
