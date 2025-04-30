// src/components/wrappers/BottomTabSafeAreaProvider.js
import React, { createContext, useContext } from 'react';
import { StyleSheet } from 'react-native';

// Get the tab bar height from CustomTabBar
import { TAB_BAR_HEIGHT } from '@/src/components/units/TabBar/CustomTabBar';

// Constants
const EXTRA_BOTTOM_SPACING = 10; // Additional safety margin

// Create context
const BottomTabSafeAreaContext = createContext({
  styles: {},
  tabBarHeight: TAB_BAR_HEIGHT,
  bottomSpacing: TAB_BAR_HEIGHT + EXTRA_BOTTOM_SPACING
});

/**
 * Provider component for bottom tab safe area
 * This wraps your application and provides safe area styles to all components
 */
export const BottomTabSafeAreaProvider = ({ children }) => {
  // Calculate bottom spacing styles
  const bottomSpacing = TAB_BAR_HEIGHT + EXTRA_BOTTOM_SPACING;
  
  const safeAreaStyles = StyleSheet.create({
    // For container views
    container: {
      paddingBottom: bottomSpacing,
    },
    
    // For absolute positioned content
    absoluteContainer: {
      marginBottom: bottomSpacing,
    },
    
    // For ScrollView contentContainerStyle
    scrollViewContent: {
      paddingBottom: bottomSpacing,
      flexGrow: 1,
    },
    
    // For fixed positioned elements at bottom
    bottomFixedElement: {
      marginBottom: bottomSpacing,
    },
    
    // For FlatList/ScrollView
    listContainer: {
      paddingBottom: bottomSpacing,
    }
  });
  
  const contextValue = {
    styles: safeAreaStyles,
    tabBarHeight: TAB_BAR_HEIGHT,
    bottomSpacing
  };
  
  return (
    <BottomTabSafeAreaContext.Provider value={contextValue}>
      {children}
    </BottomTabSafeAreaContext.Provider>
  );
};

/**
 * Hook to access bottom tab safe area styles throughout the app
 */
export const useBottomTabSafeArea = () => {
  const context = useContext(BottomTabSafeAreaContext);
  
  if (!context) {
    throw new Error('useBottomTabSafeArea must be used within a BottomTabSafeAreaProvider');
  }
  
  return context;
};

export default BottomTabSafeAreaProvider;