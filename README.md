# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

# Implementation Guide for Tab Bar Safe Area

This guide explains how to implement a centralized solution to prevent content from appearing behind the bottom tab bar.

## Core Concept

Instead of modifying each screen individually, we've created a context-based solution that:

1. Provides consistent spacing across all screens
2. Requires minimal changes to your existing components
3. Works with both Expo and React Native CLI
4. Is flexible enough to handle different types of content (scrollable, fixed, etc.)

## Implementation Steps

### 1. Setup Provider

First, wrap your app with the `BottomTabSafeAreaProvider`:

```jsx
// In RootLayout.js
import { BottomTabSafeAreaProvider } from "../components/wrappers/BottomTabSafeAreaProvider";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <BottomTabSafeAreaProvider>
        <ThemedApp />
      </BottomTabSafeAreaProvider>
    </ThemeProvider>
  );
}
```

### 2. Use Pre-made Wrapper Components

For most screens, simply replace your container components with our safe area wrappers:

```jsx
// Before:
<View style={styles.container}>
  {/* Your content */}
</View>

// After:
import { SafeScreenView } from "@/src/components/wrappers/ScreenWrappers";

<SafeScreenView style={styles.container}>
  {/* Your content */}
</SafeScreenView>
```

For scrollable content:

```jsx
// Before:
<ScrollView contentContainerStyle={styles.scrollContainer}>
  {/* Your content */}
</ScrollView>

// After:
import { SafeScrollView } from "@/src/components/wrappers/ScreenWrappers";

<SafeScrollView contentContainerStyle={styles.scrollContainer}>
  {/* Your content */}
</SafeScrollView>
```

For lists:

```jsx
// Before:
<FlatList
  data={data}
  contentContainerStyle={styles.listContainer}
  renderItem={renderItem}
/>

// After:
import { SafeFlatList } from "@/src/components/wrappers/ScreenWrappers";

<SafeFlatList
  data={data}
  contentContainerStyle={styles.listContainer}
  renderItem={renderItem}
/>
```

### 3. For Navigator Components (like ProfileNavigator)

When working with navigator components, wrap the root view in your navigator:

```jsx
// In your navigator component
import { SafeScreenView } from '@/src/components/wrappers/ScreenWrappers';

const ProfileNavigator = forwardRef((props, ref) => {
  // Your navigator logic...
  
  return (
    <SafeScreenView style={{ backgroundColor: theme.background }}>
      {renderScreen()}
    </SafeScreenView>
  );
});
```

### 4. For Bottom-Fixed Elements

For elements that should be fixed at the bottom but above the tab bar:

```jsx
import { SafeBottomView } from "@/src/components/wrappers/ScreenWrappers";

<SafeBottomView style={styles.bottomButtons}>
  <TouchableOpacity>
    <Text>Save</Text>
  </TouchableOpacity>
</SafeBottomView>
```

## Advanced Usage (Optional)

### Using the HOC for Existing Components

If you want to wrap existing components without modifying them directly:

```jsx
// In a separate file
import MyScreen from './MyScreen';
import { withSafeArea } from '../components/wrappers/withSafeArea';

export default withSafeArea(MyScreen);
```

### Using the Context Hook Directly

If you need more control, you can use the hook directly:

```jsx
import { useBottomTabSafeArea } from '@/src/components/wrappers/BottomTabSafeAreaProvider';

function MyCustomComponent() {
  const { styles: safeAreaStyles, tabBarHeight } = useBottomTabSafeArea();
  
  return (
    <View style={[styles.container, safeAreaStyles.container]}>
      {/* Custom logic using tab bar height */}
      <View style={{ marginBottom: tabBarHeight }}>
        {/* Your content */}
      </View>
    </View>
  );
}
```

## Key Files

1. `BottomTabSafeAreaProvider.js` - Context provider for tab bar spacing
2. `ScreenWrappers.js` - Ready-to-use wrapper components
3. `withSafeArea.js` - HOC for wrapping existing components

## Compatibility Notes

- Works with both Expo and React Native CLI
- Compatible with React Navigation (if you add it later)
- Handles both light and dark themes through your ThemeProvider