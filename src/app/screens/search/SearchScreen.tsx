import { ThemedText } from "@/src/components/ThemedText";
import {
  SafeScreenView,
  SafeScrollView,
} from "@/src/components/wrappers/ScreenWrappers";
import { useTheme } from "@/src/Context/ThemeContext";
import { darkTheme } from "@/src/theme/theme";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;

export default function SearchScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const { primary, background, text, iconActive } = theme;

  const scaleValues = useRef({
    search: new Animated.Value(1),
    recipe: new Animated.Value(1),
    quotes: new Animated.Value(1),
    products: new Animated.Value(1),
    posts: new Animated.Value(1),
    cart: new Animated.Value(1),
  }).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const animatePress = (key) => {
    Animated.sequence([
      Animated.timing(scaleValues[key], {
        toValue: 0.96,
        duration: 80,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleValues[key], {
        toValue: 1,
        duration: 120,
        easing: Easing.out(Easing.elastic(1)),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSearchPress = () => {
    animatePress("search");
    setTimeout(() => {
      navigation.navigate("SearchRecipes", { searchQuery: searchText });
    }, 200);
  };

  const navigateTo = (screen, key) => {
    animatePress(key);
    setTimeout(() => {
      navigation.navigate(screen);
    }, 200);
  };

  const renderCard = (key, icon, title, subtitle, bgColor, screen) => (
    <Animated.View
      style={[
        styles.card,
        styles.boxShadow(theme),
        { backgroundColor: background },
        { borderColor: theme.border },
        {
          transform: [{ scale: scaleValues[key] }],
          opacity: fadeAnim,
          marginBottom: 16,
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.background }]}
        onPress={() => navigateTo(screen, key)}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[bgColor, theme.background]}
          start={[0, 0]}
          end={[1, 0]}
          style={[styles.cardGradient]}
        >
          <View style={[styles.cardContent]}>
            <View
              style={[styles.iconContainer, { backgroundColor: background }]}
            >
              {icon}
            </View>
            <View style={styles.cardTextContainer}>
              <ThemedText style={[styles.cardTitle, { color: theme.text }]}>
                {title}
              </ThemedText>
              <ThemedText style={[styles.cardSubtitle, { color: theme.text }]}>
                {subtitle}
              </ThemedText>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={theme.icon}
              style={styles.arrowIcon}
            />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top"]}
    >
      <SafeScreenView
        style={[styles.container, { backgroundColor: theme.background }]}
        edges={["bottom"]}
      >
        <SafeScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Search Bar */}
          <Animated.View
            style={[
              {
                transform: [{ scale: scaleValues.search }],
                opacity: fadeAnim,
              },
            ]}
          >
            <View
              style={[
                styles.searchContainer,
                {
                  borderColor: theme.border,
                },
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
                placeholder="Search recipes, products, posts..."
                placeholderTextColor={theme.iconInactive}
                value={searchText}
                onChangeText={setSearchText}
                returnKeyType="search"
                onSubmitEditing={handleSearchPress}
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText("")}>
                  <Ionicons name="close-circle" size={18} color={theme.icon} />
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>

          {/* Quick Access Cards */}
          <View style={styles.cardsContainer}>
            {renderCard(
              "recipe",
              <Ionicons name="restaurant" size={24} color={theme.icon} />,
              "Food & Recipes",
              "Explore a variety of foods",
              theme.background,
              "Recipe"
            )}

            {renderCard(
              "quotes",
              <MaterialCommunityIcons name="comment-quote" size={20} color={theme.icon} />,
              "Quotes",
              "Read some wisdom",
              theme.background,
              "Quotes"
            )}

            {renderCard(
              "products",
              <FontAwesome name="shopping-bag" size={20} color={theme.icon} />,
              "Products",
              "Shop high-quality items",
              theme.background,
              "Products"
            )}

            {renderCard(
              "posts",
              <Ionicons name="newspaper" size={20} color={theme.icon} />,
              "Community Posts",
              "See what others are sharing",
              theme.background,
              "Posts"
            )}

            {renderCard(
              "cart",
              <Ionicons name="cart" size={20} color={theme.icon} />,
              "Your Cart",
              "Review your items",
              theme.background,
              "Cart"
            )}
          </View>

          {/* Recent Searches Section */}
          <Animated.View style={{ opacity: fadeAnim }}>
            <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
              Recent Searches
            </ThemedText>
            <View style={styles.recentContainer}>
              {["Pasta", "Vegetarian", "Chicken", "Desserts"].map(
                (item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.recentItem,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                      },
                    ]}
                    onPress={() => setSearchText(item)}
                  >
                    <ThemedText style={{ color: theme.textSecondary }}>
                      {item}
                    </ThemedText>
                  </TouchableOpacity>
                )
              )}
            </View>
          </Animated.View>
        </SafeScrollView>
      </SafeScreenView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
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
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 4,
    lineHeight: 34, // Added lineHeight for better text display
  },
  headerSubtitle: {
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
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
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  cardsContainer: {
    marginBottom: 24,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
  },
  cardGradient: {
    padding: 16,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
  },
  arrowIcon: {
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  recentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  recentItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
});
