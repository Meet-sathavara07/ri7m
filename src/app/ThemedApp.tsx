import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import CustomTabBar from "../components/units/TabBar/CustomTabBar";
import { SafeScrollView } from "../components/wrappers/ScreenWrappers";
import { tabs } from "../config/tabConfig";
import { ThemeProvider, useTheme } from "../Context/ThemeContext";

const ThemedApp = () => {
    const { theme, themeOption } = useTheme();
    const [activeTab, setActiveTab] = useState("Home");
    const [refreshing, setRefreshing] = useState(false);
    const navigationRef = useRef(null);
    const profileNavigatorRef = useRef();
    const [keyboardVisible, setKeyboardVisible] = useState(false);
  
    useEffect(() => {
      // You could add analytics tracking here or other side effects
    }, [activeTab]);
  
    const handleRefresh = () => {
      setRefreshing(true);
  
      // Simulate refresh - replace with actual data fetching
      setTimeout(() => {
        setRefreshing(false);
      }, 1500);
    };
  
    const handleTabDoublePress = (tabName:any) => {
      if (tabName === "Home" || tabName === "Activity") {
        handleRefresh();
      } else if (tabName === "Profile") {
        // Reset profile to main screen
        if (profileNavigatorRef.current) {
          profileNavigatorRef.current.resetToMainProfile();
        }
      }
    };
  
    const renderScreen = () => {
      const activeScreen = tabs.find((tab) => tab.name === activeTab);
  
      if (!activeScreen?.component) return null;
  
      const ScreenComponent = activeScreen.component;
  
      if (activeTab === "Home" || activeTab === "Activity") {
        return (
          <SafeScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[theme.indicator]}
                tintColor={theme.text}
              />
            }
          >
            <ScreenComponent navigationRef={navigationRef} />
          </SafeScrollView>
        );
      }
  
      if (activeTab === "Profile") {
        return <ScreenComponent ref={profileNavigatorRef} />;
      }
  
      return <ScreenComponent navigationRef={navigationRef} />;
    };
  
    return (
      <View style={styles.container}>
        <StatusBar
          style={themeOption === "DARK" ? "light" : "dark"}
          backgroundColor={theme.background}
        />
  
        {/* Main Screen Content */}
        <View style={[styles.content, { backgroundColor: theme.background }]}>
          {renderScreen()}
        </View>
  
        {/* Custom Tab Bar */}
  
        <CustomTabBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={tabs}
          onTabDoublePress={handleTabDoublePress}
        />
      </View>
    );
  };

export default ThemedApp

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
  });
  