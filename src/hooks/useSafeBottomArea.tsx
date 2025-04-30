// src/hooks/useSafeBottomArea.js
import { useMemo } from 'react';
import { StyleSheet, Platform, Dimensions } from 'react-native';

// Constants
const TAB_BAR_HEIGHT = 60; // Match this with your actual tab bar height
const EXTRA_BOTTOM_SPACING = 10; // Additional safety margin

/**
 * Custom hook to handle safe area spacing above the tab bar
 * @param {Object} options - Configuration options
 * @param {boolean} options.withExtraSpacing - Add extra padding beyond the tab bar height
 * @param {boolean} options.forScrollView - Get styles optimized for ScrollView
 * @returns {Object} Style objects and tab bar height
 */
export const useSafeBottomArea = (options = {}) => {
  const { withExtraSpacing = true, forScrollView = false } = options;
  
  const safeAreaStyles = useMemo(() => {
    const bottomSpacing = withExtraSpacing 
      ? TAB_BAR_HEIGHT + EXTRA_BOTTOM_SPACING
      : TAB_BAR_HEIGHT;
    
    return StyleSheet.create({
      // For container views
      container: {
        paddingBottom: bottomSpacing,
      },
      
      // For absolute positioned content
      absoluteContainer: {
        marginBottom: bottomSpacing,
      },
      
      // For ScrollView contentContainerStyle
      scrollViewContent: forScrollView ? {
        paddingBottom: bottomSpacing,
        flexGrow: 1,
      } : {},
      
      // For fixed positioned elements at bottom
      bottomFixedElement: {
        marginBottom: bottomSpacing,
      },
      
      // For FlatList/ScrollView
      listContainer: {
        paddingBottom: bottomSpacing,
      }
    });
  }, [withExtraSpacing, forScrollView]);

  return {
    styles: safeAreaStyles,
    tabBarHeight: TAB_BAR_HEIGHT,
    bottomSpacing: withExtraSpacing 
      ? TAB_BAR_HEIGHT + EXTRA_BOTTOM_SPACING
      : TAB_BAR_HEIGHT
  };
};

export default useSafeBottomArea;