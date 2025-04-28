// src/components/ThemeToggle.js
import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import { Sun, Moon, Smartphone, Check } from 'react-native-feather';

export const ThemeToggle = () => {
  const { themeOption, changeTheme, THEME_OPTIONS, theme } = useTheme();
  const { primary, background, text, iconActive } = theme;
  
  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <Text style={[styles.heading, { color: text }]}>Set Theme</Text>
      
      {/* Light Theme Option */}
      <TouchableOpacity
        style={[
          styles.optionContainer, 
          { 
            backgroundColor: background === '#ffffff' ? '#F5F5F5' : '#222222',
            marginBottom: 8
          }
        ]}
        onPress={() => changeTheme(THEME_OPTIONS.LIGHT)}
        activeOpacity={0.7}
      >
        <View style={styles.contentRow}>
          <Sun width={22} height={22} color={text} />
          <Text style={[styles.optionText, { color: text }]}>Light</Text>
          {themeOption === THEME_OPTIONS.LIGHT && (
            <View style={[styles.checkContainer, { backgroundColor: text }]}>
              <Check width={14} height={14} color={background} strokeWidth={3} />
            </View>
          )}
        </View>
      </TouchableOpacity>
      
      {/* Dark Theme Option */}
      <TouchableOpacity
        style={[
          styles.optionContainer, 
          { 
            backgroundColor: background === '#ffffff' ? '#F5F5F5' : '#222222',
            marginBottom: 8
          }
        ]}
        onPress={() => changeTheme(THEME_OPTIONS.DARK)}
        activeOpacity={0.7}
      >
        <View style={styles.contentRow}>
          <Moon width={22} height={22} color={text} />
          <Text style={[styles.optionText, { color: text }]}>Dark</Text>
          {themeOption === THEME_OPTIONS.DARK && (
            <View style={[styles.checkContainer, { backgroundColor: text }]}>
              <Check width={14} height={14} color={background} strokeWidth={3} />
            </View>
          )}
        </View>
      </TouchableOpacity>
      
      {/* System Theme Option */}
      <TouchableOpacity
        style={[
          styles.optionContainer, 
          { 
            backgroundColor: background === '#ffffff' ? '#F5F5F5' : '#222222'
          }
        ]}
        onPress={() => changeTheme(THEME_OPTIONS.SYSTEM)}
        activeOpacity={0.7}
      >
        <View style={styles.contentRow}>
          <Smartphone width={22} height={22} color={text} />
          <Text style={[styles.optionText, { color: text }]}>System</Text>
          {themeOption === THEME_OPTIONS.SYSTEM && (
            <View style={[styles.checkContainer, { backgroundColor: text }]}>
              <Check width={14} height={14} color={background} strokeWidth={3} />
            </View>
          )}
        </View>
      </TouchableOpacity>
      
      <Text style={[styles.description, { color: text }]}>
        {themeOption === THEME_OPTIONS.LIGHT && 'Using light mode for your app appearance'}
        {themeOption === THEME_OPTIONS.DARK && 'Using dark mode for your app appearance'}
        {themeOption === THEME_OPTIONS.SYSTEM && 'Following your device system settings'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  optionContainer: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginLeft: 16,
  },
  checkContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    marginTop: 16,
    fontSize: 14,
    opacity: 0.8,
  }
});