// src/components/wrappers/ScreenWrappers.js
import React from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import { useBottomTabSafeArea } from "../../Context/BottomTabSafeAreaProvider";

/**
 * SafeAreaView wrapper - adds bottom padding to avoid tab bar
 * Use this for basic screen containers
 */
export const SafeScreenView = ({ children, style, ...props }) => {
  const { styles: safeAreaStyles } = useBottomTabSafeArea();

  return (
    <View
      style={[styles.container, safeAreaStyles.container, style]}
      {...props}
    >
      {children}
    </View>
  );
};

/**
 * SafeScrollView wrapper - adds bottom padding for ScrollViews
 * Use this instead of regular ScrollView to avoid tab bar
 */
export const SafeScrollView = ({
  children,
  contentContainerStyle,
  ...props
}) => {
  const { styles: safeAreaStyles } = useBottomTabSafeArea();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContainer,
        safeAreaStyles.scrollViewContent,
        contentContainerStyle,
      ]}
      {...props}
    >
      {children}
    </ScrollView>
  );
};

/**
 * SafeFlatList wrapper - adds bottom padding for FlatLists
 * Use this instead of regular FlatList to avoid tab bar
 */
export const SafeFlatList = ({ contentContainerStyle, ...props }) => {
  const { styles: safeAreaStyles } = useBottomTabSafeArea();

  return (
    <FlatList
      contentContainerStyle={[
        styles.listContainer,
        safeAreaStyles.listContainer,
        contentContainerStyle,
      ]}
      {...props}
    />
  );
};

/**
 * SafeBottomView wrapper - for components that should be positioned above the tab bar
 * Use this for fixed position components at the bottom of the screen
 */
export const SafeBottomView = ({ children, style, ...props }) => {
  const { styles: safeAreaStyles } = useBottomTabSafeArea();

  return (
    <View
      style={[styles.bottomView, safeAreaStyles.bottomFixedElement, style]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  listContainer: {
    flexGrow: 1,
  },
  bottomView: {
    width: "100%",
  },
});

export default {
  SafeScreenView,
  SafeScrollView,
  SafeFlatList,
  SafeBottomView,
};
