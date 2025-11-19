import React, { useState } from "react";
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Share,
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { ThemedText } from "@/src/components/ThemedText";
import { useTheme } from "@/src/Context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { SafeScreenView } from "@/src/components/wrappers/ScreenWrappers";
import { ActionButtons } from "@/src/components/ui/Button/CircularButtons";
import CardShadowWrapper from "@/src/components/ui/CardShadowWrapper";
import RecipeActions from "@/src/components/ui/Button/RecipeActions";
import PriceDisplay from "@/src/components/templates/price/PriceDisplay";

// Sub-components for better organization
const RecipeImage = ({ uri, onShare }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const { theme } = useTheme();

  return (
    <View style={styles.imageContainer}>
      {isLoading && (
        <View
          style={[styles.imagePlaceholder, { backgroundColor: theme.card }]}
        >
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      )}
      {error ? (
        <View
          style={[styles.imagePlaceholder, { backgroundColor: theme.card }]}
        >
          <Ionicons name="image-outline" size={50} color={theme.icon} />
        </View>
      ) : (
        <Image
          source={{ uri }}
          style={styles.image}
          onLoad={() => setIsLoading(false)}
          onError={() => setError(true)}
          accessibilityLabel="Recipe image"
        />
      )}
      <TouchableOpacity
        style={styles.shareButton}
        onPress={onShare}
        accessibilityLabel="Share recipe"
        accessibilityHint="Shares this recipe with others"
      >
        <Ionicons name="share-social" size={22} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const StatsCard = ({ prepTime, cookTime, rating, reviewCount, servings }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.statsContainer, { backgroundColor: theme.card }]}>
      <View style={styles.statItem}>
        <Ionicons name="time-outline" size={22} color={theme.icon} />
        <View style={styles.statText}>
          <ThemedText style={styles.statValue}>
            {prepTime + cookTime}
          </ThemedText>
          <ThemedText style={styles.statLabel}>minutes</ThemedText>
        </View>
      </View>

      <View style={[styles.statDivider, { backgroundColor: theme.border }]} />

      <View style={styles.statItem}>
        <Ionicons name="star-outline" size={22} color={theme.icon} />
        <View style={styles.statText}>
          <ThemedText style={styles.statValue}>{rating.toFixed(1)}</ThemedText>
          <ThemedText style={styles.statLabel}>
            {reviewCount} reviews
          </ThemedText>
        </View>
      </View>

      <View style={[styles.statDivider, { backgroundColor: theme.border }]} />

      <View style={styles.statItem}>
        <Ionicons name="restaurant-outline" size={22} color={theme.icon} />
        <View style={styles.statText}>
          <ThemedText style={styles.statValue}>{servings}</ThemedText>
          <ThemedText style={styles.statLabel}>servings</ThemedText>
        </View>
      </View>
    </View>
  );
};

export default function RecipeDetail({ route }) {
  const { recipe } = route.params;
  const { theme } = useTheme();
  const [isSaved, setIsSaved] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const insets = useSafeAreaInsets();
  const { width } = Dimensions.get("window");

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this delicious ${recipe.name} recipe! It takes ${
          recipe.prepTimeMinutes + recipe.cookTimeMinutes
        } minutes to make.`,
        title: recipe.name,
        url: recipe.image, // Some platforms support URL
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Error sharing recipe:", error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const toggleSave = async () => {
    try {
      // Here you would typically call an API or update your state management
      setIsSaved(!isSaved);
      await Haptics.impactAsync(
        isSaved
          ? Haptics.ImpactFeedbackStyle.Light
          : Haptics.ImpactFeedbackStyle.Medium
      );
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  return (
    <Animated.ScrollView
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          opacity: fadeAnim,
        },
      ]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
    >
      <RecipeImage uri={recipe.image} onShare={handleShare} />

      <SafeScreenView style={styles.content}>
        <View style={styles.titleSection}>
          <ThemedText style={styles.title}>{recipe.name}</ThemedText>

          <View style={styles.tagContainer}>
            {Array.isArray(recipe.mealType) ? (
              recipe.mealType.map((type, index) => (
                <View
                  key={index}
                  style={[styles.tag, { backgroundColor: theme.primary }]}
                >
                  <ThemedText style={[styles.tagText, { color: theme.instructionNumber }]}>{type}</ThemedText>
                </View>
              ))
            ) : (
              <View style={[styles.tag, { backgroundColor: theme.bullet }]}>
                <ThemedText
                  style={[styles.tagText, { color: theme.instructionNumber }]}
                >
                  {recipe.mealType}
                </ThemedText>
              </View>
            )}
            {recipe.cuisine && (
              <View style={[styles.tag, { backgroundColor: theme.bullet }]}>
                <ThemedText
                  style={[styles.tagText, { color: theme.instructionNumber }]}
                >
                  {recipe.cuisine}
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        <StatsCard
          prepTime={recipe.prepTimeMinutes}
          cookTime={recipe.cookTimeMinutes}
          rating={recipe.rating}
          reviewCount={recipe.reviewCount}
          servings={recipe.servings}
        />

        <View style={[styles.timeSection, { backgroundColor: theme.card }]}>
          <View style={styles.timeItem}>
            <ThemedText style={styles.timeLabel}>Prep Time</ThemedText>
            <ThemedText style={styles.timeValue}>
              {recipe.prepTimeMinutes} min
            </ThemedText>
          </View>
          <View
            style={[styles.timeDivider, { backgroundColor: theme.border }]}
          />
          <View style={styles.timeItem}>
            <ThemedText style={styles.timeLabel}>Cook Time</ThemedText>
            <ThemedText style={styles.timeValue}>
              {recipe.cookTimeMinutes} min
            </ThemedText>
          </View>
          <View
            style={[styles.timeDivider, { backgroundColor: theme.border }]}
          />
          <View style={styles.timeItem}>
            <ThemedText style={styles.timeLabel}>Total Time</ThemedText>
            <ThemedText style={styles.timeValue}>
              {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min
            </ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Ingredients</ThemedText>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={`ingredient-${index}`} style={styles.ingredientItem}>
                <View
                  style={[styles.bullet, { backgroundColor: theme.bullet }]}
                />
                <ThemedText style={styles.ingredientText}>
                  {ingredient}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Instructions</ThemedText>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            {recipe.instructions.map((instruction, index) => (
              <View key={`instruction-${index}`} style={styles.instructionItem}>
                <View
                  style={[
                    styles.instructionNumberContainer,
                    { backgroundColor: theme.bullet },
                  ]}
                >
                  <Text
                    style={[
                      styles.instructionNumber,
                      { color: theme.instructionNumber },
                    ]}
                  >
                    {index + 1}
                  </Text>
                </View>
                <ThemedText style={styles.instructionText}>
                  {instruction}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        {recipe.difficulty && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Difficulty</ThemedText>
            <View style={[styles.card, { backgroundColor: theme.card }]}>
              <ThemedText style={styles.difficultyText}>
                {recipe.difficulty}
              </ThemedText>
            </View>
          </View>
        )}
        <View style={styles.boxShadow}>
          {/* <PriceDisplay
            price={recipe.price}
            formatOptions={{
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }}
          /> */}
          <RecipeActions
            recipe={recipe}
            onSave={toggleSave}
            isSaved={isSaved}
            onShare={handleShare}
          />
        </View>
      </SafeScreenView>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    height: 300,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  shareButton: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    lineHeight: 32,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  statDivider: {
    width: 1,
    height: 30,
  },
  statText: {
    marginLeft: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  timeSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  timeItem: {
    flex: 1,
    alignItems: "center",
  },
  timeDivider: {
    width: 1,
    height: "100%",
  },
  timeLabel: {
    fontSize: 12,
    marginBottom: 4,
    opacity: 0.7,
  },
  boxShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  timeValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    padding: 16,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
    marginTop: 7,
  },
  ingredientText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 24,
  },
  instructionItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  instructionNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  instructionNumber: {
    fontSize: 14,
    fontWeight: "bold",
  },
  instructionText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 24,
  },
  difficultyText: {
    fontSize: 16,
  },
  starRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  fullStar: {
    color: "gold",
    fontSize: 18,
  },
  emptyStar: {
    color: "gray",
    fontSize: 18,
  },
  saveButton: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveIcon: {
    marginRight: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
