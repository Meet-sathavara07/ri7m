import { useTheme } from '@/src/Context/ThemeContext';
import React, { useRef, useState } from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// TabBar height should be consistent across the app
export const TAB_BAR_HEIGHT = 60;

export default function CustomTabBar({ activeTab, setActiveTab, tabs, onTabDoublePress }) {
  const { theme } = useTheme();
  const tabPosition = tabs.findIndex(tab => tab.name === activeTab);
  const tabWidth = width / tabs.length;
  const lastPressTimeRef = useRef({});
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(tabPosition * tabWidth, {
      damping: 15,
      stiffness: 120,
    }) }],
  }));

  const handleTabPress = (tabName) => {
    const now = new Date().getTime();
    const lastPressTime = lastPressTimeRef.current[tabName] || 0;
    const isDoublePress = (now - lastPressTime) < 300;
    
    // Update last press time
    lastPressTimeRef.current[tabName] = now;
    
    // If already on this tab and it's a double press, trigger the refresh
    if (activeTab === tabName && isDoublePress) {
      // Only trigger double press for Home and Activity tabs
      if (tabName === 'Home' || tabName === 'Activity') {
        onTabDoublePress?.(tabName);
      }
    } else if (activeTab === tabName && tabName === 'Profile') {
      // Special behavior for Profile tab: navigate back to main Profile
      onTabDoublePress?.('Profile');
    } else {
      // Normal tab switching behavior
      setActiveTab(tabName);
    }
  };

  return (
    <View style={[
      styles.tabBar,
      { 
        backgroundColor: theme.tabBar,
        borderTopColor: theme.borderTopColor,
        height: TAB_BAR_HEIGHT,
      }
    ]}>
      <Animated.View 
        style={[
          styles.indicator, 
          { width: tabWidth, backgroundColor: theme.indicator },
          animatedStyle
        ]} 
      />

      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        const IconComponent = tab.iconComponent;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabButton}
            onPress={() => handleTabPress(tab.name)}
          >
            <IconComponent
              name={tab.icon}
              size={tab.name === 'Profile' ? 26 : 28}
              color={isActive ? theme.iconActive : theme.iconInactive}
              />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    zIndex: 100, // Ensure the tab bar is always on top
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    height: 3,
    position: 'absolute',
    top: 0,
    left: 0,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  }
});