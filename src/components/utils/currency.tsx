// currencyUtils.js
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_CURRENCY_KEY = 'user_preferred_currency';

// Supported currencies with labels and symbols
export const CURRENCIES = {
  USD: { name: 'US Dollar', symbol: '$', rate: 1.0 },
  EUR: { name: 'Euro', symbol: '€', rate: 0.93 },
  GBP: { name: 'British Pound', symbol: '£', rate: 0.78 },
  JPY: { name: 'Japanese Yen', symbol: '¥', rate: 151.02 },
  INR: { name: 'Indian Rupee', symbol: '₹', rate: 83.50 },
  CAD: { name: 'Canadian Dollar', symbol: 'CA$', rate: 1.37 },
  AUD: { name: 'Australian Dollar', symbol: 'A$', rate: 1.51 },
  CNY: { name: 'Chinese Yuan', symbol: 'CN¥', rate: 7.23 },
  BRL: { name: 'Brazilian Real', symbol: 'R$', rate: 5.05 },
  ZAR: { name: 'South African Rand', symbol: 'R', rate: 18.32 },
};

export const useCurrency = () => {
  const [currency, setCurrency] = useState('USD');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCurrency = async () => {
      try {
        const savedCurrency = await AsyncStorage.getItem(USER_CURRENCY_KEY);
        if (savedCurrency && CURRENCIES[savedCurrency]) {
          setCurrency(savedCurrency);
        }
      } catch (error) {
        console.error('Failed to load currency', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrency();
  }, []);

  const changeCurrency = async (newCurrency) => {
    if (!CURRENCIES[newCurrency]) return;
    
    try {
      await AsyncStorage.setItem(USER_CURRENCY_KEY, newCurrency);
      setCurrency(newCurrency);
    } catch (error) {
      console.error('Failed to save currency', error);
    }
  };

  const formatPrice = (amount, options = {}) => {
    if (amount == null) return '';
    
    const currencyInfo = CURRENCIES[currency];
    const convertedAmount = amount * currencyInfo.rate;
    const locale = options.locale || 'en-US';
    
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: options.minimumFractionDigits ?? 2,
        maximumFractionDigits: options.maximumFractionDigits ?? 2,
      }).format(convertedAmount);
    } catch (error) {
      // Fallback formatting
      return `${currencyInfo.symbol}${convertedAmount.toFixed(2)}`;
    }
  };

  return {
    currency,
    currencies: Object.keys(CURRENCIES),
    currencyInfo: CURRENCIES[currency],
    changeCurrency,
    formatPrice,
    isLoading,
  };
};