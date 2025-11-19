import { ThemedText } from "@/src/components/ThemedText";
import CardShadowWrapper from "@/src/components/ui/CardShadowWrapper";
import { useTheme } from "@/src/Context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeScreenView } from "../../components/wrappers/ScreenWrappers";
import PriceDisplay from "@/src/components/templates/price/PriceDisplay";
import { darkTheme } from "@/src/theme/theme";

// Utility function to shuffle an array (Fisher-Yates algorithm)
const shuffleArray = (array) => {
  // Create a copy of the array to avoid mutating the original
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function Recipe({ navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalRecipesCount, setTotalRecipesCount] = useState(0);
  const loadingRef = useRef(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          "https://gist.githubusercontent.com/Meet-sathavara07/576074de04af49d4e3202a432a266e4c/raw/07ecf49915cf8a06afe350b680bb7ab899a70914/gistfile1.txt"
        );

        // Store total available recipes count
        const allRecipes = response.data.recipes;
        setTotalRecipesCount(allRecipes.length);

        // Get initial batch (first 10 recipes or less if there are fewer)
        const initialBatch = allRecipes.slice(0, 10);

        // Process recipes to create stable shuffled tags
        const processed = initialBatch.map((recipe) => {
          // Start with cuisine as the first item
          const cuisine = recipe.cuisine;

          // Create array of mealTypes and tags without including cuisine
          const mealTypes = Array.isArray(recipe.mealType)
            ? recipe.mealType
            : [recipe.mealType];
          const tags = (recipe.tags || []).filter((tag) => tag !== cuisine);
          const shuffledOtherTags = shuffleArray(
            [...mealTypes, ...tags].filter(Boolean)
          );
          const allTags = cuisine
            ? [cuisine, ...shuffledOtherTags]
            : shuffledOtherTags;

          return {
            ...recipe,
            metaTagsString: allTags.join(", "),
            tagsArray: allTags.slice(0, 3), // Store first 3 tags for chip display
          };
        });

        setRecipes(processed);

        // Check if we have loaded all available recipes
        if (processed.length >= allRecipes.length) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error in fetching:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const renderStars = (rating) => {
    let starColor;
    if (rating >= 3.5) {
      starColor = "#4CAF50"; // Green
    } else if (rating >= 2.8) {
      starColor = "#FFC107"; // Yellow
    } else {
      starColor = "#F44336"; // Red
    }

    const fullStars = Math.floor(rating);
    const decimal = rating % 1;
    let stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Text key={i} style={[styles.fullStar, { color: starColor }]}>
            ★
          </Text>
        );
      } else if (i === fullStars) {
        if (decimal >= 0.8) {
          stars.push(
            <Text key={i} style={[styles.fullStar, { color: starColor }]}>
              ★
            </Text>
          );
        } else if (decimal >= 0.3) {
          stars.push(
            <View key={i} style={styles.halfStarContainer}>
              <Text style={styles.emptyStar}>★</Text>
              <View style={styles.halfOverlay}>
                <Text style={[styles.fullStar, { color: starColor }]}>★</Text>
              </View>
            </View>
          );
        } else {
          stars.push(
            <Text key={i} style={styles.emptyStar}>
              ★
            </Text>
          );
        }
      } else {
        stars.push(
          <Text key={i} style={styles.emptyStar}>
            ★
          </Text>
        );
      }
    }

    return <View style={styles.starRow}>{stars}</View>;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "#4CAF50";
      case "medium":
        return "#FFC107";
      case "hard":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  const handleRecipePress = (recipe) => {
    navigation.navigate("RecipeDetail", { recipe });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await axios.get(
        "https://gist.githubusercontent.com/Meet-sathavara07/576074de04af49d4e3202a432a266e4c/raw/07ecf49915cf8a06afe350b680bb7ab899a70914/gistfile1.txt"
      );

      // Get total available recipes
      const allRecipes = response.data.recipes;
      setTotalRecipesCount(allRecipes.length);

      // Get initial batch (first 10 recipes or less if there are fewer)
      const initialBatch = allRecipes.slice(0, 10);

      const refreshedRecipes = initialBatch.map((recipe) => {
        const cuisine = recipe.cuisine;
        const mealTypes = Array.isArray(recipe.mealType)
          ? recipe.mealType
          : [recipe.mealType];
        const tags = (recipe.tags || []).filter((tag) => tag !== cuisine);
        const shuffledOtherTags = shuffleArray(
          [...mealTypes, ...tags].filter(Boolean)
        );
        const allTags = cuisine
          ? [cuisine, ...shuffledOtherTags]
          : shuffledOtherTags;
        return {
          ...recipe,
          metaTagsString: allTags.join(", "),
          tagsArray: allTags.slice(0, 3),
        };
      });

      setRecipes(refreshedRecipes);

      // Reset hasMore based on if there are more recipes available
      setHasMore(refreshedRecipes.length < allRecipes.length);
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const loadMore = async () => {
    // Extra safety using both state and ref to prevent multiple calls
    if (isLoadingMore || !hasMore || loadingRef.current) return;

    // Set loading ref to prevent multiple simultaneous calls
    loadingRef.current = true;
    setIsLoadingMore(true);

    try {
      // Since the API doesn't actually support pagination, we need to
      // implement client-side pagination
      const response = await axios.get(
        "https://gist.githubusercontent.com/Meet-sathavara07/576074de04af49d4e3202a432a266e4c/raw/07ecf49915cf8a06afe350b680bb7ab899a70914/gistfile1.txt"
      );

      // Get all recipes from the response
      const allAvailableRecipes = response.data.recipes;

      // Check if we've already loaded all recipes (or more)
      if (recipes.length >= allAvailableRecipes.length) {
        // No more recipes to load
        setHasMore(false);
        return;
      }

      // Calculate how many more recipes we can add (up to 10 more)
      const remainingCount = allAvailableRecipes.length - recipes.length;
      const countToAdd = Math.min(10, remainingCount);

      // Get the next batch of recipes
      const nextBatch = allAvailableRecipes.slice(
        recipes.length,
        recipes.length + countToAdd
      );

      // Process the new recipes
      const newRecipes = nextBatch.map((recipe) => {
        const cuisine = recipe.cuisine;
        const mealTypes = Array.isArray(recipe.mealType)
          ? recipe.mealType
          : [recipe.mealType];
        const tags = (recipe.tags || []).filter((tag) => tag !== cuisine);
        const shuffledOtherTags = shuffleArray(
          [...mealTypes, ...tags].filter(Boolean)
        );
        const allTags = cuisine
          ? [cuisine, ...shuffledOtherTags]
          : shuffledOtherTags;
        return {
          ...recipe,
          metaTagsString: allTags.join(", "),
          tagsArray: allTags.  slice(0, 3),
        };
      });

      // Check if this is the last batch
      if (recipes.length + newRecipes.length >= allAvailableRecipes.length) {
        setHasMore(false);
      }

      // Add the new recipes to the existing list
      setRecipes((prev) => [...prev, ...newRecipes]);
    } catch (error) {
      console.error("Error loading more:", error);
    } finally {
      setIsLoadingMore(false);
      loadingRef.current = false;
    }
  };

  const handleSearchPress = () => {
    // Check if the screen exists in the navigation stack
    try {
      navigation.navigate("SearchRecipes");
    } catch (error) {
      console.log("Navigation error:", error);
      // Alert the user or handle the error appropriately
      alert(
        "Search functionality is not available at the moment. Please try again later."
      );
    }
  };

  const renderItems = ({ item }) => (
    <CardShadowWrapper style={{ backgroundColor: theme.background }}>
      <TouchableOpacity
        style={[
          styles.recipeCard,
          {
            backgroundColor: theme.background,
            borderColor: theme.border,
          },
        ]}
        onPress={() => handleRecipePress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.recipeImage}
            resizeMode="cover"
          />
          <View />

          {/* Price Badge */}
          <View
            style={[
              styles.priceBadge,
              styles.boxShadow(theme),

              { backgroundColor: theme.background , },
            ]}
          >
            <PriceDisplay
              price={item.price}
              TextComponent={ThemedText}
              style={styles.priceText}
            />
          </View>
        </View>

        <View style={styles.recipeContent}>
          <View style={styles.recipeHeader}>
            <ThemedText style={styles.recipeName} numberOfLines={1}>
              {item.name}
            </ThemedText>

            {/* Difficulty Indicator */}
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(item.difficulty) },
              ]}
            >
              <ThemedText style={styles.difficultyText}>
                {item.difficulty}
              </ThemedText>
            </View>
          </View>

          <View style={styles.ratingPriceContainer}>
            <View style={styles.ratingContainer}>
              <ThemedText style={styles.ratingText}>
                {item.rating.toFixed(1)}{" "}
              </ThemedText>
              <View style={styles.starWrapper}>{renderStars(item.rating)}</View>
              <ThemedText style={styles.ratingText}>
                {" "}
                ({item.reviewCount})
              </ThemedText>
            </View>
          </View>

          {/* Tags Chips */}
          <View style={styles.tagsContainer}>
            {item.tagsArray?.map((tag, index) => (
              <View
                key={index}
                style={[styles.tag, { backgroundColor: theme.cardBackground }]}
              >
                <ThemedText style={styles.tagText}>{tag}</ThemedText>
              </View>
            ))}
          </View>

          <View style={styles.recipeMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="timer" size={14} color={theme.icon} />
              <ThemedText style={styles.metaText}>
                {item.prepTimeMinutes + item.cookTimeMinutes} min
              </ThemedText>
            </View>

            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={14} color={theme.icon} />
              <ThemedText style={styles.metaText}>
                {item.servings} {item.servings === 1 ? "serving" : "servings"}
              </ThemedText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </CardShadowWrapper>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.loading} />
      </View>
    );
  };

  return (
    <SafeScreenView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Search Button (now just navigates to search screen) */}
      <TouchableOpacity
        style={[
          styles.searchButton,
          { borderColor: theme.border, backgroundColor: theme.background },
        ]}
        onPress={handleSearchPress}
      >
        <Ionicons
          name="search"
          size={18}
          color={theme.icon}
          style={styles.searchIcon}
        />
        <ThemedText style={styles.searchButtonText}>
          Search recipes...
        </ThemedText>
      </TouchableOpacity>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.loading} />
          <ThemedText style={styles.loadingText}>
            Loading delicious recipes...
          </ThemedText>
        </View>
      ) : (
        <>
          <View style={styles.resultsHeader}>
            <ThemedText style={styles.resultsCount}>
              {recipes.length} of {totalRecipesCount}{" "}
              {totalRecipesCount === 1 ? "Recipe" : "Recipes"}
            </ThemedText>
            <TouchableOpacity
              style={[styles.filterButton, { borderColor: theme.border }]}
            >
              <Ionicons name="filter" size={18} color={theme.icon} />
              <ThemedText>Filters</ThemedText>
            </TouchableOpacity>
          </View>

          <FlatList
            data={recipes}
            renderItem={renderItems}
            keyExtractor={(item, index) =>
              item?.id?.toString() || index.toString()
            }
            contentContainerStyle={styles.recipeList}
            showsVerticalScrollIndicator={false}
            initialNumToRender={4}
            maxToRenderPerBatch={8}
            windowSize={5}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <ThemedText style={styles.emptyText}>
                  No recipes found
                </ThemedText>
              </View>
            }
            ListFooterComponent={renderFooter}
          />
        </>
      )}
    </SafeScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 20,
    paddingTop: Platform.OS === "ios" ? 10 : 0, // Only add extra padding for iOS if needed
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 10,
    marginTop: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchButtonText: {
    fontSize: 16,
    opacity: 0.6,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: "600",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  recipeList: {
    paddingBottom: 24,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    opacity: 0.7,
  },
  recipeCard: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 0.1,
  },
  imageContainer: {
    position: "relative",
    height: 180,
  },
  recipeImage: {
    width: "100%",
    height: "100%",
  },

  priceBadge: {
    position: "absolute",
    top:   8,
    right: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
   boxShadow: (theme: any) => {
      const commonStyles = {
        borderRadius: 16,
        backgroundColor: theme.background, // Use theme background color
      };
  
      if (Platform.OS === "ios") {
        return {
          ...commonStyles,
          shadowColor: theme.primary, // Use theme primary color for shadow
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: theme === darkTheme ? 0.5 : 0.2, // Adjust opacity based on theme
          shadowRadius: 6,
        };
      } else {
        return {
          ...commonStyles,
          elevation: 4,
          shadowColor: theme.primary, // Use theme primary color for shadow
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: theme === darkTheme ? 0.4 : 0.1, // Adjust opacity based on theme
          shadowRadius: 6,
        };
      }
    },
  priceText: {
    fontSize: 16,
    fontWeight: "semibold",
  },
  recipeContent: {
    padding: 10,
  },
  recipeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recipeName: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    marginRight: 12,
  },
  recipeMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "grey",
    paddingTop: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    marginLeft: 10,
  },
  metaText: {
    fontSize: 14,
    marginLeft: 6,
    opacity: 0.8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
  },

  ratingPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 1,
  },
  starRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  fullStar: {
    color: "#E08231",
    fontSize: 18,
  },
  emptyStar: {
    color: "gray",
    fontSize: 18,
  },
  halfStarContainer: {
    position: "relative",
    width: 20,
    overflow: "hidden",
  },
  halfOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "40%",
    height: "100%",
    overflow: "hidden",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "semibold",
  },
  starWrapper: {
    marginBottom: 2,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: "600",
  },

  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
  },
});
