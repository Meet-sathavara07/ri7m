import { ThemedText } from "@/src/components/ThemedText";
import CardShadowWrapper from "@/src/components/ui/CardShadowWrapper";
import { useTheme } from "@/src/Context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeScreenView } from "../../wrappers/ScreenWrappers";

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

export default function SearchRecipes({ route, navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const { theme } = useTheme();

  // Store preprocessed recipes with stable shuffled tags
  const [processedRecipes, setProcessedRecipes] = useState([]);

  const searchQuery = route?.params?.searchQuery || "";

  useEffect(() => {
    // Set search input from params if available
    if (searchQuery) {
      setSearchInput(searchQuery);
    }

    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          "https://gist.githubusercontent.com/Meet-sathavara07/576074de04af49d4e3202a432a266e4c/raw/07ecf49915cf8a06afe350b680bb7ab899a70914/gistfile1.txt"
        );

        // Process recipes to create stable shuffled tags
        const processed = response.data.recipes.map((recipe) => {
          // Start with cuisine as the first item
          const cuisine = recipe.cuisine;

          // Create array of mealTypes and tags without including cuisine
          const mealTypes = Array.isArray(recipe.mealType)
            ? recipe.mealType
            : [recipe.mealType];
          const tags = (recipe.tags || []).filter((tag) => tag !== cuisine); // Remove cuisine from tags if present

          // Combine mealTypes and tags and shuffle them together
          const otherTags = [...mealTypes, ...tags].filter(Boolean); // Remove empty values
          const shuffledOtherTags = shuffleArray(otherTags);

          // Combine cuisine with shuffled tags
          const allTags = cuisine
            ? [cuisine, ...shuffledOtherTags]
            : shuffledOtherTags;

          return {
            ...recipe,
            // Store the pre-shuffled tags string to avoid re-shuffling on renders
            metaTagsString: allTags.join(", "),
          };
        });

        setRecipes(processed);
        setProcessedRecipes(processed);

        // Initially filter with the search query from route params
        filterRecipes(processed, searchQuery);
      } catch (error) {
        console.error("Error in fetching:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipes();
  }, [searchQuery]);
  useEffect(() => {
    filterRecipes(processedRecipes, searchInput);
  }, [searchInput, processedRecipes]);

  const filterRecipes = (recipeList, query) => {
    if (!query) {
      setFilteredRecipes([]);
      return;
    }

    const queryLower = query.toLowerCase();
    const filtered = recipeList.filter(
      (recipe) =>
        recipe.name.toLowerCase().includes(queryLower) ||
        (Array.isArray(recipe.mealType)
          ? recipe.mealType.some((type) =>
              type.toLowerCase().includes(queryLower)
            )
          : recipe.mealType.toLowerCase().includes(queryLower)) ||
        recipe.cuisine?.toLowerCase().includes(queryLower) ||
        (Array.isArray(recipe.tags)
          ? recipe.tags.some((tag) => tag.toLowerCase().includes(queryLower))
          : false) ||
        recipe.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(queryLower)
        )
    );
    setFilteredRecipes(filtered);
  };

  const handleSearch = () => {
    filterRecipes(processedRecipes, searchInput);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderStars = (rating) => {
    // Determine star color based on rating
    let starColor;
    if (rating >= 3.5) {
      starColor = "#4CAF50"; // Green
    } else if (rating >= 2.8) {
      starColor = "#FFC107"; // Yellow
    } else {
      starColor = "#F44336"; // Red
    }

    const fullStars = Math.floor(rating); // Number of full stars
    const decimal = rating % 1; // Get decimal part
    let stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        // Full Star
        stars.push(
          <Text key={i} style={[styles.fullStar, { color: starColor }]}>
            ★
          </Text>
        );
      } else if (i === fullStars) {
        // Handle decimal part in current position
        if (decimal >= 0.8) {
          // Full Star if decimal is 0.8 or above
          stars.push(
            <Text key={i} style={[styles.fullStar, { color: starColor }]}>
              ★
            </Text>
          );
        } else if (decimal >= 0.3) {
          stars.push(
            <View key={i} style={styles.halfStarContainer}>
              {/* Empty Star as background */}
              <Text style={styles.emptyStar}>★</Text>
              {/* Colored Star covering 50% */}
              <View style={styles.halfOverlay}>
                <Text style={[styles.fullStar, { color: starColor }]}>★</Text>
              </View>
            </View>
          );
        } else {
          // Empty Star for decimals ≤ 0.2
          stars.push(
            <Text key={i} style={styles.emptyStar}>
              ★
            </Text>
          );
        }
      } else {
        // Empty Star for remaining slots
        stars.push(
          <Text key={i} style={styles.emptyStar}>
            ★
          </Text>
        );
      }
    }

    return <View style={styles.starRow}>{stars}</View>;
  };

  const handleRecipePress = (recipe) => {
    navigation.navigate("RecipeDetail", { recipe });
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
        <View>
          <Image
            source={{ uri: item.image }}
            style={styles.recipeImage}
            resizeMode="cover"
          />

          <View style={styles.recipeContent}>
            <View style={styles.recipeHeader}>
              <ThemedText style={styles.recipeName} numberOfLines={1}>
                {item.name}
              </ThemedText>
            </View>

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

            <View style={styles.recipeMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={14} color={theme.icon} />
                <ThemedText style={styles.metaText}>
                  {item.prepTimeMinutes + item.cookTimeMinutes} min
                </ThemedText>
              </View>

              <View style={[styles.metaItem, { flex: 1, minWidth: 0 }]}>
                <Ionicons
                  name="restaurant-outline"
                  size={14}
                  color={theme.icon}
                />
                <ThemedText
                  style={[styles.metaText, { flex: 1 }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {/* Use the pre-generated stable tags string */}
                  {item.metaTagsString}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </CardShadowWrapper>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={60} color={theme.iconInactive} />
      <ThemedText style={styles.emptyText}>
        {searchInput ? "No recipes found" : "Start typing to search recipes"}
      </ThemedText>
      <ThemedText style={styles.emptySubtext}>
        {searchInput
          ? "Try searching for different ingredients, cuisines, or meal types"
          : "Search by name, ingredients, cuisine or meal type"}
      </ThemedText>
    </View>
  );

  return (
    <SafeScreenView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.backButton}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={theme.icon} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Search Recipes</ThemedText>
      </View>

      <View
        style={[
          styles.searchContainer,
          { borderColor: theme.border, backgroundColor: theme.background },
        ]}
      >
        <Ionicons
          name="search"
          size={18}
          color={theme.icon}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search by name, ingredients, cuisine..."
          placeholderTextColor={theme.iconInactive}
          value={searchInput}
          onChangeText={setSearchInput}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoFocus={true}
        />
        {searchInput ? (
          <TouchableOpacity
            onPress={() => {
              setSearchInput("");
              setFilteredRecipes([]);
            }}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Ionicons name="close-circle" size={20} color={theme.icon} />
          </TouchableOpacity>
        ) : null}
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.loading} />
          <ThemedText style={styles.loadingText}>Loading recipes...</ThemedText>
        </View>
      ) : (
        <>
          {filteredRecipes.length > 0 && (
            <View style={styles.resultsHeader}>
              <ThemedText style={styles.resultsCount}>
                {filteredRecipes.length}{" "}
                {filteredRecipes.length === 1 ? "Recipe" : "Recipes"} Found
              </ThemedText>
            </View>
          )}

          <FlatList
            data={filteredRecipes}
            renderItem={renderItems}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.recipeList}
            ListEmptyComponent={ListEmptyComponent}
            showsVerticalScrollIndicator={false}
            initialNumToRender={4}
            maxToRenderPerBatch={8}
            windowSize={5}
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: Platform.OS === "ios" ? 10 : 0,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    padding: 0,
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
    height: 300,
  },
  recipeImage: {
    width: "100%",
    height: "70%",
  },
  recipeContent: {
    padding: 10,
    height: "25%",
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
    flexWrap: "wrap",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    marginLeft: 6,
    opacity: 0.8,
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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    flex: 1,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    opacity: 0.7,
    paddingHorizontal: 40,
  },
});
