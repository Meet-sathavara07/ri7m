import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Animated,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useCurrency, AVAILABLE_CURRENCIES } from '@/src/Context/CurrencyContext';
import { useTheme } from '@/src/Context/ThemeContext';
import { Check, ChevronRight, Search } from 'react-native-feather';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { darkTheme } from '@/src/theme/theme';

const { width } = Dimensions.get('window');
const ITEM_HEIGHT = 80;

const FLAGS = {
  'USD': '🇺🇸',
  'INR': '🇮🇳',
  'EUR': '🇪🇺',
  'GBP': '🇬🇧',
  'JPY': '🇯🇵',
  'CAD': '🇨🇦',
  'AUD': '🇦🇺',
  'CNY': '🇨🇳',
  'BRL': '🇧🇷',
  'RUB': '🇷🇺',
};

const RegionSelectionScreen = ({ navigation }) => {
  const { changeCurrency, currencyCode } = useCurrency();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const filteredCurrencies = useMemo(() => {
    return AVAILABLE_CURRENCIES.filter(
      currency =>
        currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        currency.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleCurrencySelect = useCallback(async (code) => {
    try {
      setIsLoading(true);
      await Haptics.selectionAsync();
      await changeCurrency(code);
      
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.replace('MainApp');
      }
    } catch (error) {
      console.error('Currency change error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [changeCurrency, navigation]);

  const renderCurrencyItem = useCallback(
    ({ item, index }) => {
      const isSelected = item.code === currencyCode;
      const inputRange = [
        -1,
        0,
        ITEM_HEIGHT * index,
        ITEM_HEIGHT * (index + 2),
      ];

      const opacity = scrollY.interpolate({
        inputRange,
        outputRange: [1, 1, 1, 0],
      });

      const scale = scrollY.interpolate({
        inputRange,
        outputRange: [1, 1, 1, 0.9],
      });

      return (
        <Animated.View style={{ opacity, transform: [{ scale }] }}>
          <TouchableOpacity
            style={[
              styles.currencyItem,
              { 
                backgroundColor: theme.cardBackground,
                ...styles.boxShadow(theme), 
                borderColor: theme.border,
              }
            ]}
            onPress={() => handleCurrencySelect(item.code)}
            activeOpacity={0.7}
            disabled={isLoading}
          >
            <View style={styles.flagContainer}>
              <Text style={styles.flag}>{FLAGS[item.code]}</Text>
            </View>

            <View style={styles.currencyInfo}>
              <Text style={[styles.currencyName, { color: theme.text }]}>
                {item.name}
              </Text>
              <Text style={[styles.currencyCode, { color: theme.text }]}>
                {item.code}
              </Text>
            </View>

            <View style={styles.rightSection}>
              <Text style={[styles.currencySymbol, { color: theme.text }]}>
                {item.symbol}
              </Text>
              {isSelected ? (
                <View style={[styles.checkContainer, { backgroundColor: theme.primary }]}>
                  <Check width={16} height={16} color="#fff" strokeWidth={3} />
                </View>
              ) : (
                <ChevronRight width={20} height={20} color={theme.text} />
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      );
    },
    [currencyCode, theme, scrollY, handleCurrencySelect, isLoading]
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      
      <LinearGradient
        colors={[theme.primary + '20', 'transparent']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            Select Currency
          </Text>
          <Text style={[styles.subtitle, { color: theme.text }]}>
            Choose your preferred currency for transactions
          </Text>
          
          <View style={[styles.searchContainer, { backgroundColor: theme.Background }]}>
            <Search width={20} height={20} color={theme.text} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search currencies..."
              placeholderTextColor={theme.text}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
          </View>
        </View>
      </LinearGradient>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <Animated.FlatList
          data={filteredCurrencies}
          renderItem={renderCurrencyItem}
          keyExtractor={item => item.code}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.text }]}>
                No currencies found
              </Text>
            </View>
          }
        />
      )}

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.text }]}>
          You can change this anytime in settings
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 8,
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    height: ITEM_HEIGHT,
    borderWidth: 0.5,
    
  },
  flagContainer: {
   
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  flag: {
    fontSize: 28,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  currencyCode: {
    fontSize: 14,
    opacity: 0.7,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 12,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 12,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    opacity: 0.7,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
});

export default RegionSelectionScreen;