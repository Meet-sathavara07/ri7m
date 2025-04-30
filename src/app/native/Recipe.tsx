import { ThemedText } from "@/src/components/ThemedText";
import { useTheme } from "@/src/Context/ThemeContext";
import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  View,
  Image,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { SafeScreenView } from "@/src/components/wrappers/ScreenWrappers";

export default function Recipe({ route, navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const { theme } = useTheme();

  const searchQuery = route?.params?.searchQuery || "";

  useEffect(() => {
    // Set search input from params if available
    if (searchQuery) {
      setSearchInput(searchQuery);
    }

    const fetchRecipes = async () => {
      try {
        const response = await axios.get("https://dummyjson.com/recipes");
        setRecipes(response.data.recipes);
        // Initially filter with the search query from route params
        filterRecipes(response.data.recipes, searchQuery);
      } catch (error) {
        console.error("Error in fetching:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipes();
  }, [searchQuery]);

  const filterRecipes = (recipeList, query) => {
    if (!query) {
      setFilteredRecipes(recipeList);
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
        recipe.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(queryLower)
        )
    );
    setFilteredRecipes(filtered);
  };

  const handleSearch = () => {
    filterRecipes(recipes, searchInput);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating); // Number of full stars
    const decimal = rating % 1; // Get decimal part
    let stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        // Full Star
        stars.push(
          <Text key={i} style={styles.fullStar}>
            ★
          </Text>
        );
      } else if (i === fullStars) {
        // Handle decimal part in current position
        if (decimal >= 0.8) {
          // Full Star if decimal is 0.8 or above
          stars.push(
            <Text key={i} style={styles.fullStar}>
              ★
            </Text>
          );
        } else if (decimal >= 0.3) {
          stars.push(
            <View key={i} style={styles.halfStarContainer}>
              {/* Empty Star as background */}
              <Text style={styles.emptyStar}>★</Text>
              {/* Gold Star covering 50% */}
              <View style={styles.halfOverlay}>
                <Text style={styles.fullStar}>★</Text>
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
    <TouchableOpacity
      style={[
        styles.recipeCard,
        { backgroundColor: theme.card,  },
      ]}
      onPress={() => handleRecipePress(item)}
      activeOpacity={0.8}
    >
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

          <View style={styles.metaItem}>
            <Ionicons name="restaurant-outline" size={14} color={theme.icon} />
            <ThemedText style={styles.metaText}>
              {item.servings} servings
            </ThemedText>
          </View>

          {item.cuisine && (
            <View style={styles.metaItem}>
              <Ionicons name="flag-outline" size={14} color={theme.icon} />
              <ThemedText style={styles.metaText}>{item.cuisine}</ThemedText>
            </View>
          )}
        </View>

        <View style={styles.tagsContainer}>
          {Array.isArray(item.mealType) ? (
            item.mealType.slice(0, 3).map((type, index) => (
              <View
                key={index}
                style={[styles.tag, { backgroundColor: theme.tagBg }]}
              >
                <ThemedText style={styles.tagText}>{type}</ThemedText>
              </View>
            ))
          ) : (
            <View style={[styles.tag, { backgroundColor: theme.tagBg }]}>
              <ThemedText style={styles.tagText}>{item.mealType}</ThemedText>
            </View>
          )}
        </View>

        <View style={styles.difficultyContainer}>
          <ThemedText style={styles.difficultyText}>Difficulty: </ThemedText>
          <View style={styles.difficultyLevel(item.difficulty)}>
            <ThemedText style={styles.difficultyLevelText}>
              {item.difficulty}
            </ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={60} color={theme.iconInactive} />
      <ThemedText style={styles.emptyText}>No recipes found</ThemedText>
      <ThemedText style={styles.emptySubtext}>
        Try searching for different ingredients, cuisines, or meal types
      </ThemedText>
    </View>
  );

  return (
    <SafeScreenView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Discover Recipes</ThemedText>
        {/* <ThemedText style={styles.headerSubtitle}>Find your next culinary adventure</ThemedText> */}
      </View>

      <View style={[styles.searchContainer, { borderColor: theme.border }]}>
        <Ionicons
          name="search"
          size={18}
          color={theme.icon}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search recipes..."
          placeholderTextColor={theme.iconInactive}
          value={searchInput}
          onChangeText={setSearchInput}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchInput ? (
          <TouchableOpacity
            onPress={() => {
              setSearchInput("");
              filterRecipes(recipes, "");
            }}
          >
            <Ionicons name="close-circle" size={20} color={theme.icon} />
          </TouchableOpacity>
        ) : null}
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.accent} />
          <ThemedText style={styles.loadingText}>
            Loading delicious recipes...
          </ThemedText>
        </View>
      ) : (
        <>
          <View style={styles.resultsHeader}>
            <ThemedText style={styles.resultsCount}>
              {filteredRecipes.length}{" "}
              {filteredRecipes.length === 1 ? "Recipe" : "Recipes"} Found
            </ThemedText>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="filter" size={18} color={theme.accent} />
              <ThemedText style={[styles.filterText, { color: theme.accent }]}>
                Filters
              </ThemedText>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredRecipes}
            renderItem={renderItems}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.recipeList}
            ListEmptyComponent={ListEmptyComponent}
            showsVerticalScrollIndicator={false}
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
    paddingTop: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
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
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
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
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  recipeImage: {
    width: "100%",
    height: 180,
  },
  recipeContent: {
    padding: 16,
  },
  recipeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  recipeName: {
    fontSize: 20,
    fontWeight: "700",
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
    marginBottom: 4,
  },
  metaText: {
    fontSize: 14,
    marginLeft: 6,
    opacity: 0.8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
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
  difficultyContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  difficultyText: {
    fontSize: 14,
    opacity: 0.8,
  },
  difficultyLevel: (level) => ({
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor:
      level === "Easy"
        ? "rgba(76, 175, 80, 0.2)"
        : level === "Medium"
        ? "rgba(255, 193, 7, 0.2)"
        : "rgba(244, 67, 54, 0.2)",
  }),
  difficultyLevelText: {
    fontSize: 12,
    fontWeight: "600",
    color: (level) =>
      level === "Easy" ? "#4CAF50" : level === "Medium" ? "#FFC107" : "#F44336",
  },
});
