import { ThemedText } from "@/src/components/ThemedText";
import { useTheme } from "@/src/Context/ThemeContext";
import React, { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function SearchScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    // Navigate to Post page with search query
    navigation.navigate("Post", { searchQuery: searchText });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["top"]}>
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
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchText ? (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Ionicons name="close-circle" size={18} color={theme.icon} />
          </TouchableOpacity>
        ) : null}
      </View>

      <TouchableOpacity
        style={[styles.recipeBox, { backgroundColor: theme.card }]}
        onPress={() => navigation.navigate("Post")}
      >
        <View style={styles.recipeBoxContent}>
          <Ionicons name="restaurant-outline" size={24} color={theme.icon} style={styles.recipeIcon} />
          <ThemedText style={styles.recipeText}>Explore Recipes</ThemedText>
          <Ionicons name="chevron-forward" size={24} color={theme.icon} />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
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
  recipeBox: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  recipeBoxContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  recipeIcon: {
    marginRight: 12,
  },
  recipeText: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
});