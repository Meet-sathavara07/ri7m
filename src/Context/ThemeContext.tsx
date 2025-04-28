
// src/themes/ThemeContext.js
import React = require('react');
import { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme, lightTheme } from '../theme/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Theme options
  const THEME_OPTIONS = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
  };

  const deviceTheme = useColorScheme();
  const [themeOption, setThemeOption] = useState(THEME_OPTIONS.SYSTEM);
  const [theme, setTheme] = useState(deviceTheme === 'dark' ? darkTheme : lightTheme);

  // Load the saved theme option on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedThemeOption = await AsyncStorage.getItem('themeOption');
        if (savedThemeOption) {
          setThemeOption(savedThemeOption);
        }
      } catch (error) {
        console.error('Failed to load theme option:', error);
      }
    };
    
    loadTheme();
  }, []);

  // Update the theme when the theme option or device theme changes
  useEffect(() => {
    let newTheme;
    
    if (themeOption === THEME_OPTIONS.SYSTEM) {
      newTheme = deviceTheme === 'dark' ? darkTheme : lightTheme;
    } else {
      newTheme = themeOption === THEME_OPTIONS.DARK ? darkTheme : lightTheme;
    }
    
    setTheme(newTheme);
  }, [themeOption, deviceTheme]);

  // Function to change the theme option
  const changeTheme = async (option) => {
    try {
      await AsyncStorage.setItem('themeOption', option);
      setThemeOption(option);
    } catch (error) {
      console.error('Failed to save theme option:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, themeOption, changeTheme, THEME_OPTIONS }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};