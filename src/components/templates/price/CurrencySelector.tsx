import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useCurrency } from '@/src/Context/CurrencyContext';
import { useTheme } from '@/src/Context/ThemeContext';

// Common currencies with their symbols and names
const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
];

/**
 * Component to allow users to select their preferred currency
 */
const CurrencySelector = () => {
  const { currencyCode, changeCurrency } = useCurrency();
  const { theme } = useTheme();

  const renderCurrencyItem = ({ item }) => {
    const isSelected = item.code === currencyCode;
    
    return (
      <TouchableOpacity
        style={[
          styles.currencyItem,
          isSelected && { backgroundColor: theme.primary + '20' }
        ]}
        onPress={() => changeCurrency(item.code)}
      >
        <View style={styles.currencyInfo}>
          <Text style={[styles.currencySymbol, { color: theme.text }]}>
            {item.symbol}
          </Text>
          <Text style={[styles.currencyCode, { color: theme.text }]}>
            {item.code}
          </Text>
        </View>
        <Text style={[styles.currencyName, { color: theme.textSecondary }]}>
          {item.name}
        </Text>
        {isSelected && (
          <View style={[styles.selectedIndicator, { backgroundColor: theme.primary }]} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>
        Select Currency
      </Text>
      <FlatList
        data={CURRENCIES}
        renderItem={renderCurrencyItem}
        keyExtractor={(item) => item.code}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    position: 'relative',
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  currencySymbol: {
    fontSize: 18,
    marginRight: 8,
    width: 24,
    textAlign: 'center',
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '600',
  },
  currencyName: {
    flex: 1,
    fontSize: 14,
  },
  selectedIndicator: {
    position: 'absolute',
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default CurrencySelector;