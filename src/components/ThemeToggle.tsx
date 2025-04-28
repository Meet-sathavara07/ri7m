
// src/components/ThemeToggle.js
import React from 'react';
import { Button, View as RNView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../Context/ThemeContext';

export const ThemeToggle = () => {
  const { themeOption, changeTheme, THEME_OPTIONS } = useTheme();
  
  return (
    <View style={styles.container}>
      <Text variant="h3">App Theme</Text>
      
      <RNView style={styles.buttonsContainer}>
        <Button
          title="Light"
          variant={themeOption === THEME_OPTIONS.LIGHT ? 'primary' : 'secondary'}
          onPress={() => changeTheme(THEME_OPTIONS.LIGHT)}
          style={styles.button}
        />
        
        <Button
          title="Dark"
          variant={themeOption === THEME_OPTIONS.DARK ? 'primary' : 'secondary'}
          onPress={() => changeTheme(THEME_OPTIONS.DARK)}
          style={styles.button}
        />
        
        <Button
          title="System"
          variant={themeOption === THEME_OPTIONS.SYSTEM ? 'primary' : 'secondary'}
          onPress={() => changeTheme(THEME_OPTIONS.SYSTEM)}
          style={styles.button}
        />
      </RNView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
});

