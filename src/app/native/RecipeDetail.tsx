import React from "react";
import { View, ScrollView, Image, StyleSheet, TouchableOpacity, Text, Share } from "react-native";
import { ThemedText } from "@/src/components/ThemedText";
import { useTheme } from "@/src/Context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import {
    SafeAreaProvider,
    useSafeAreaInsets,
  } from 'react-native-safe-area-context';
  
export default function RecipeDetail({ route }) {
  const { recipe } = route.params;
  const { theme } = useTheme();

  const insets = useSafeAreaInsets();


  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this delicious ${recipe.name} recipe! It takes ${recipe.prepTimeMinutes + recipe.cookTimeMinutes} minutes to make.`,
        title: recipe.name,
      });
    } catch (error) {
      console.error('Error sharing recipe:', error);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: recipe.image }} style={styles.image} />
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={handleShare}
        >
          <Ionicons name="share-social" size={22} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.titleSection}>
          <ThemedText style={styles.title}>{recipe.name}</ThemedText>
          
          <View style={styles.tagContainer}>
            {Array.isArray(recipe.mealType) ? (
              recipe.mealType.map((type, index) => (
                <View key={index} style={[styles.tag, { backgroundColor: theme.tagBg || '#e0e0e0' }]}>
                  <ThemedText style={styles.tagText}>{type}</ThemedText>
                </View>
              ))
            ) : (
              <View style={[styles.tag, { backgroundColor: theme.tagBg || '#e0e0e0' }]}>
                <ThemedText style={styles.tagText}>{recipe.mealType}</ThemedText>
              </View>
            )}
            {recipe.cuisine && (
              <View style={[styles.tag, { backgroundColor: theme.tagBg || '#e0e0e0' }]}>
                <ThemedText style={styles.tagText}>{recipe.cuisine}</ThemedText>
              </View>
            )}
          </View>
        </View>

        <View style={[styles.statsContainer, { backgroundColor: theme.card }]}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={22} color={theme.icon} />
            <View style={styles.statText}>
              <ThemedText style={styles.statValue}>{recipe.prepTimeMinutes + recipe.cookTimeMinutes}</ThemedText>
              <ThemedText style={styles.statLabel}>minutes</ThemedText>
            </View>
          </View>
          
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          
          <View style={styles.statItem}>
            <Ionicons name="star-outline" size={22} color={theme.icon} />
            <View style={styles.statText}>
              <ThemedText style={styles.statValue}>{recipe.rating.toFixed(1)}</ThemedText>
              <ThemedText style={styles.statLabel}>{recipe.reviewCount} reviews</ThemedText>
            </View>
          </View>
          
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          
          <View style={styles.statItem}>
            <Ionicons name="restaurant-outline" size={22} color={theme.icon} />
            <View style={styles.statText}>
              <ThemedText style={styles.statValue}>{recipe.servings}</ThemedText>
              <ThemedText style={styles.statLabel}>servings</ThemedText>
            </View>
          </View>
        </View>

        <View style={[styles.timeSection, { backgroundColor: theme.card }]}>
          <View style={styles.timeItem}>
            <ThemedText style={styles.timeLabel}>Prep Time</ThemedText>
            <ThemedText style={styles.timeValue}>{recipe.prepTimeMinutes} min</ThemedText>
          </View>
          <View style={[styles.timeDivider, { backgroundColor: theme.border }]} />
          <View style={styles.timeItem}>
            <ThemedText style={styles.timeLabel}>Cook Time</ThemedText>
            <ThemedText style={styles.timeValue}>{recipe.cookTimeMinutes} min</ThemedText>
          </View>
          <View style={[styles.timeDivider, { backgroundColor: theme.border }]} />
          <View style={styles.timeItem}>
            <ThemedText style={styles.timeLabel}>Total Time</ThemedText>
            <ThemedText style={styles.timeValue}>{recipe.prepTimeMinutes + recipe.cookTimeMinutes} min</ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Ingredients</ThemedText>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={[styles.bullet, { backgroundColor: theme.accent || '#FF6B6B' }]} />
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
              <View key={index} style={styles.instructionItem}>
                <View style={[styles.instructionNumberContainer, { backgroundColor: theme.accent || '#FF6B6B' }]}>
                  <Text style={styles.instructionNumber}>{index + 1}</Text>
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

        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: theme.accent || '#FF6B6B' }]}
        >
          <Ionicons name="bookmark-outline" size={20} color="white" style={styles.saveIcon} />
          <Text style={styles.saveButtonText}>Save Recipe</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  shareButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 75,

    
  },
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
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
    alignItems: "center",
    marginBottom: 10,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 16,
    flex: 1,
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
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  instructionText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  saveIcon: {
    marginRight: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  }
});