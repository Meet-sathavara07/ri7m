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
  TextInput
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

export default function Recipe({ route, navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const { theme } = useTheme();
  
  // Get searchQuery from route params
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
        recipe.ingredients.some(ingredient => 
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
    navigation.navigate('RecipeDetail', { recipe });
  };

  const renderItems = ({ item }) => (
    <TouchableOpacity 
      style={[styles.productItem, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={() => handleRecipePress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <ThemedText style={styles.productName}>{item.name}</ThemedText>
        
        <View style={styles.cookInfo}>
          <View style={styles.cookInfoItem}>
            <Ionicons name="time-outline" size={16} color={theme.icon} />
            <ThemedText style={styles.cookInfoText}>
              {item.prepTimeMinutes + item.cookTimeMinutes} min
            </ThemedText>
          </View>
          
          <View style={styles.cookInfoItem}>
            <Ionicons name="restaurant-outline" size={16} color={theme.icon} />
            <ThemedText style={styles.cookInfoText}>
              {item.servings} serv
            </ThemedText>
          </View>
        </View>
        
        <View style={styles.ratingContainer}>
          <ThemedText style={styles.ratingText}>
            {item.rating.toFixed(1)}{" "}
          </ThemedText>
          <View style={styles.starWrapper}>{renderStars(item.rating)}</View>
          <ThemedText style={styles.ratingText}>({item.reviewCount})</ThemedText>
        </View>
        
        <View style={styles.tagContainer}>
          {item.cuisine && (
            <View style={[styles.tag, { backgroundColor: theme.tagBg  }]}>
              <ThemedText style={styles.cuisineText}>{item.cuisine}:-</ThemedText>
            </View>
          )}{Array.isArray(item.mealType) ? (
            item.mealType.slice(0, 2).map((type, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: theme.tagBg || '#e0e0e0' }]}>
                <ThemedText style={styles.tagText}>{type}</ThemedText>
              </View>
            ))
          ) : (
            <View style={[styles.tag, { backgroundColor: theme.tagBg || '#e0e0e0' }]}>
              <ThemedText style={styles.tagText}>{item.mealType}</ThemedText>
            </View>
          )}
          
        </View>
      </View>
    </TouchableOpacity>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={60} color={theme.iconInactive} />
      <ThemedText style={styles.emptyText}>No recipes found</ThemedText>
      <ThemedText style={styles.emptySubtext}>
        Try searching for different ingredients or meal types
      </ThemedText>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
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
          <TouchableOpacity onPress={() => {
            setSearchInput("");
            filterRecipes(recipes, "");
          }}>
            <Ionicons name="close-circle" size={18} color={theme.icon} />
          </TouchableOpacity>
        ) : null}
      </View>
      
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.accent || "#0000ff"} />
          <ThemedText style={styles.loadingText}>Loading recipes...</ThemedText>
        </View>
      ) : (
        <>
          <ThemedText style={styles.resultsCount}>
            {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'} found
          </ThemedText>
          <FlatList
            data={filteredRecipes}
            renderItem={renderItems}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.productList}
            ListEmptyComponent={ListEmptyComponent}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
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
  resultsCount: {
    fontSize: 14,
    marginBottom: 10,
    opacity: 0.7,
  },
  productList: {
    paddingBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  productItem: {
    flexDirection: "row",
    padding: 6,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  productImage: {
    width: 110,
    height: 110,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  cookInfo: {
    flexDirection: "row",
  },
  cookInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  cookInfoText: {
    fontSize: 14,
    marginLeft: 4,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  cuisineText: {
    fontSize: 16,
    fontWeight: "500",
  },Text: {
    fontSize: 12,
    fontWeight: "500",
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
  }
});