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


// import React, { useRef } from 'react';
// import { View, Pressable, Text, Dimensions, Platform } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
// import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
// import { Typography } from '@theme';
// import { Icon } from './Icon';

// const { width: screenWidth } = Dimensions.get('window');

// const ACTIVE_COLOR = '#177E00';
// const INACTIVE_COLOR = '#5C5C5C';
// const INDICATOR_HEIGHT = 5;
// const INDICATOR_WIDTH = 60;

// export const CustomTabBar: React.FC<BottomTabBarProps> = ({
//     state,
//     descriptors,
//     navigation,
// }) => {
//     const insets = useSafeAreaInsets();
//     const lastPressTimeRef = useRef<Record<string, number>>({});

//     const tabWidth = screenWidth / state.routes.length;
//     const indicatorOffset = (tabWidth - INDICATOR_WIDTH) / 2;
//     // Animated indicator style using react-native-reanimated
//     const indicatorAnimatedStyle = useAnimatedStyle(() => {
//         return {
//             transform: [
//                 {
//                     translateX: withSpring(
//                         state.index * tabWidth + indicatorOffset,
//                         {
//                             damping: 18,
//                             stiffness: 140,
//                             mass: 0.8,
//                         }
//                     ),
//                 },
//             ],
//         };
//     });

//     const getTabIcon = (routeName: string): { name: string; library: 'Custom' } => {
//         const iconMap: Record<string, string> = {
//             Home: 'home',
//             Time: 'date',
//             Logs: 'logs',
//             Leave: 'leave',
//             Team: 'team-meeting',
//         };

//         return {
//             name: iconMap[routeName] || 'home',
//             library: 'Custom',
//         };
//     };

//     const handleTabPress = (route: any, index: number) => {
//         const now = Date.now();
//         const lastPressTime = lastPressTimeRef.current[route.name] || 0;
//         const isDoublePress = (now - lastPressTime) < 350;

//         // Update last press time
//         lastPressTimeRef.current[route.name] = now;

//         const event = navigation.emit({
//             type: 'tabPress',
//             target: route.key,
//             canPreventDefault: true,
//         });

//         const isFocused = state.index === index;

//         if (!isFocused && !event.defaultPrevented) {
//             navigation.navigate(route.name, route.params);
//         } else if (isFocused && isDoublePress) {
//             // Handle double press for focused tab (could trigger refresh)
//             navigation.emit({
//                 type: 'tabLongPress',
//                 target: route.key,
//             });
//         }
//     };
//     return (
//         <View
//             style={{
//                 backgroundColor: '#FFFFFF',
//                 paddingBottom: Platform.OS === 'android' ? Math.max(insets.bottom, 8) : Math.max(insets.bottom, 20),
//                 paddingTop: 10,
//                 shadowColor: '#000',
//                 shadowOffset: {
//                     width: 0,
//                     height: -3,
//                 },
//                 shadowOpacity: 0.12,
//                 shadowRadius: 4,
//                 elevation: 6,
//                 borderTopWidth: 0.5,
//                 borderTopColor: '#E5E5E5',
//             }}
//         >
//             {/* Animated Tab Indicator */}
//             <Animated.View
//                 style={[
//                     {
//                         position: 'absolute',
//                         top: 0,
//                         width: INDICATOR_WIDTH,
//                         height: INDICATOR_HEIGHT,
//                         backgroundColor: ACTIVE_COLOR,
//                         opacity: 1,
//                         borderBottomLeftRadius: 20,
//                         borderBottomRightRadius: 20,
//                     },
//                     indicatorAnimatedStyle,
//                 ]}
//             />

//             {/* Tab Buttons */}
//             <View style={{ flexDirection: 'row' }}>
//                 {state.routes.map((route, index) => {
//                     const { options } = descriptors[route.key];
//                     const label = options.tabBarLabel !== undefined
//                         ? options.tabBarLabel
//                         : options.title !== undefined
//                             ? options.title
//                             : route.name;

//                     const isFocused = state.index === index;
//                     const { name: iconName, library } = getTabIcon(route.name);

//                     return (
//                         <Pressable
//                             key={route.key}
//                             accessibilityRole="button"
//                             accessibilityState={isFocused ? { selected: true } : {}}
//                             accessibilityLabel={options.tabBarAccessibilityLabel}
//                             testID={options.tabBarTestID}
//                             onPress={() => handleTabPress(route, index)}
//                             style={{
//                                 flex: 1,
//                                 alignItems: 'center',
//                                 paddingVertical: 14,
//                                 paddingHorizontal: 6,
//                             }}
//                         >
//                             {/* Icon */}
//                             <View style={{ marginBottom: 6 }}>
//                                 <Icon
//                                     name={iconName}
//                                     library={library}
//                                     size={24}
//                                     color={isFocused ? ACTIVE_COLOR : INACTIVE_COLOR}
//                                 />
//                             </View>

//                             {/* Label */}
//                             <Text
//                                 style={{
//                                     ...Typography.caption,
//                                     fontSize: 12,
//                                     fontFamily: "Poppins",
//                                     fontWeight: '500',
//                                     color: isFocused ? ACTIVE_COLOR : INACTIVE_COLOR,
//                                     textAlign: 'center',
//                                     opacity: isFocused ? 1 : 0.8,
//                                 }}
//                                 numberOfLines={1}
//                             >
//                                 {typeof label === 'string' ? label : route.name}
//                             </Text>
//                         </Pressable>
//                     );
//                 })}
//             </View>
//         </View>
//     );
// };

// export default CustomTabBar;
