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
import { BottomTabSafeAreaProvider } from "../Context/BottomTabSafeAreaProvider";
import { ThemeProvider, useTheme } from "../Context/ThemeContext";
import { CurrencyProvider } from "../Context/CurrencyContext";
import OnboardingNavigator from "./navigation/OnboardingNavigator";
import "./global.css"

// Create a themed app component

// Root component that serves as the entry point
export default function RootLayout() {
  return (
    <ThemeProvider>
      <CurrencyProvider defaultCurrency="USD">
        <BottomTabSafeAreaProvider>
          <OnboardingNavigator />
        </BottomTabSafeAreaProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}
