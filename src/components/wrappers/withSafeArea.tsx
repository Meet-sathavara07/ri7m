// src/components/wrappers/withSafeArea.js
import React from "react";
import { StyleSheet, View } from "react-native";
import { useBottomTabSafeArea } from "../../Context/BottomTabSafeAreaProvider";

/**
 * Higher Order Component (HOC) to wrap any component with safe area padding
 * for the bottom tab bar
 *
 * @param {React.Component} WrappedComponent - The component to wrap
 * @param {Object} options - Configuration options
 * @returns {React.Component} - The wrapped component with bottom padding
 */
export const withSafeArea = (WrappedComponent, options = {}) => {
  // Default options
  const {
    containerStyle = {},
    preserveStyles = true,
    applyToProps = false,
  } = options;

  // Return a functional component
  const WithSafeArea = (props) => {
    const { styles: safeAreaStyles } = useBottomTabSafeArea();

    // If applyToProps is true, we pass the safe area styles to the wrapped component
    if (applyToProps) {
      return <WrappedComponent {...props} safeAreaStyles={safeAreaStyles} />;
    }

    // Otherwise, we wrap the component in a View with bottom padding
    return (
      <View
        style={[
          styles.container,
          safeAreaStyles.container,
          preserveStyles && props.style, // Only apply if preserveStyles is true
          containerStyle, // Additional container styles
        ]}
      >
        <WrappedComponent {...props} />
      </View>
    );
  };

  // Display name for debugging
  WithSafeArea.displayName = `withSafeArea(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithSafeArea;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default withSafeArea;

/*
Usage example:

// Option 1: Wrap your component when you export it
import MyScreen from './MyScreen';
import { withSafeArea } from '../components/wrappers/withSafeArea';

export default withSafeArea(MyScreen);

// Option 2: Pass safe area styles as props to your component
import { withSafeArea } from '../components/wrappers/withSafeArea';

const MyComponent = ({ safeAreaStyles }) => {
  return (
    <FlatList
      contentContainerStyle={[styles.list, safeAreaStyles.listContainer]}
      // ...
    />
  );
};

export default withSafeArea(MyComponent, { applyToProps: true });
*/
