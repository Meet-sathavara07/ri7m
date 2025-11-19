import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ThemedApp from '../ThemedApp';
import { useCurrency } from '@/src/Context/CurrencyContext';
import RegionSelectionScreen from '../native/RegionSelectionScreen';

const Stack = createStackNavigator();

const OnboardingNavigator = () => {
  const { initialSetupDone, isLoading } = useCurrency();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // We can proceed when we know whether initial setup is done
    if (!isLoading) {
      setAppReady(true);
    }
  }, [isLoading]);

  if (!appReady) {
    // Show loading screen while we determine whether to show onboarding
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!initialSetupDone ? (
        // If initial setup not done, show region selection
        <Stack.Screen name="RegionSelection" component={RegionSelectionScreen} />
      ) : (
        // Otherwise go straight to main app
        <Stack.Screen name="MainApp" component={ThemedApp} />
      )}
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;