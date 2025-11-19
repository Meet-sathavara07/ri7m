// useTabNavigation.js
import { useCallback, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';

export function useTabNavigation(initialTab = 'Home', tabsConfig) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const tabPosition = useSharedValue(tabsConfig.findIndex(tab => tab.name === initialTab));
  
  const navigateToTab = useCallback((tabName) => {
    const index = tabsConfig.findIndex(tab => tab.name === tabName);
    if (index !== -1) {
      setActiveTab(tabName);
      tabPosition.value = index;
    }
  }, [tabsConfig]);
  
  const getCurrentScreen = useCallback(() => {
    const activeScreen = tabsConfig.find(tab => tab.name === activeTab);
    return activeScreen?.component || null;
  }, [activeTab, tabsConfig]);
  
  return {
    activeTab,
    tabPosition,
    navigateToTab,
    getCurrentScreen
  };
}