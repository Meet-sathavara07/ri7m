/* eslint-disable import/namespace */
import React, { forwardRef, useImperativeHandle } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "@/src/Context/ThemeContext";
import { CommonActions } from "@react-navigation/native";
import SearchScreen from "../screens/search/SearchScreen";
import Recipe from "../native/Recipe";
import RecipeDetail from "../native/RecipeDetail";
import { useNavigation } from "expo-router";
import SearchRecipes from "@/src/components/units/SerachBar/SearchRecipes";

const Stack = createStackNavigator();

// eslint-disable-next-line react/display-name
const SearchNavigator = forwardRef((props, ref) => {
  const { theme } = useTheme();
    const navigation = useNavigation();
  
  // Instead of using useNavigation, we'll use the ref prop passed to the component
  useImperativeHandle(ref, () => ({
    resetToMainSearch: () => {
      // Access navigation from the ref when the method is called
      if (ref.current && ref.current.navigation) {
        ref.current.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "SearchMain" }],
          })
        );
      }
    },
  }));

  return (
    
    <Stack.Navigator
      screenOptions={{
        headerTintColor: theme.text,
        headerStyle: { backgroundColor: theme.background },
        cardStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen
        name="SearchMain"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Recipe" 
        component={Recipe} 
        options={{ title: "Recipes" }}
      />
      <Stack.Screen 
        name="RecipeDetail" 
        component={RecipeDetail} 
        options={({ route }) => ({ title: route.params?.item?.name || "Recipe Details" })}
      />
      <Stack.Screen 
        name="SearchRecipes" 
        component={SearchRecipes} 
        options={{
          headerShown: false, // Optional: Since we added our own back button
        }}
      />
    </Stack.Navigator>
  );
});

export default SearchNavigator;