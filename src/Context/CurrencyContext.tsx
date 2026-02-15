import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const USER_CURRENCY_KEY = 'user_preferred_currency';
const USER_LOCALE_KEY = 'user_preferred_locale';
const INITIAL_SETUP_DONE_KEY = 'currency_initial_setup_done';

// Define available currencies with conversion rates (relative to USD)
// https://open.er-api.com/v6/latest/INR
export const AVAILABLE_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', conversionRate: 1 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', conversionRate: 83.11 }, 
  { code: 'EUR', symbol: '€', name: 'Euro', conversionRate: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', conversionRate: 0.78 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', conversionRate: 111.32 },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', conversionRate: 1.35 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', conversionRate: 1.47 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', conversionRate: 7.1 },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', conversionRate: 5.12 },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', conversionRate: 92.65 },
];

// Create context
const CurrencyContext = createContext();

/**
 * Provider component for currency context with manual currency selection
 */
export const CurrencyProvider = ({ children }) => {
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [isLoading, setIsLoading] = useState(true);
  const [initialSetupDone, setInitialSetupDone] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState(AVAILABLE_CURRENCIES[0]);

  // Initialize currency preferences
  useEffect(() => {
    const initPreferences = async () => {
      try {
        // Check if initial setup is done
        const setupDone = await AsyncStorage.getItem(INITIAL_SETUP_DONE_KEY);
        
        if (setupDone === 'true') {
          setInitialSetupDone(true);
          
          // Get stored currency preference
          const storedCurrency = await AsyncStorage.getItem(USER_CURRENCY_KEY);
          
          if (storedCurrency) {
            setCurrencyCode(storedCurrency);
            // Find the currency object
            const currency = AVAILABLE_CURRENCIES.find(c => c.code === storedCurrency);
            if (currency) {
              setCurrentCurrency(currency);
            }
          }
        } else {
          setInitialSetupDone(false);
        }
      } catch (error) {
        console.error('Error initializing currency settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initPreferences();
  }, []);

  /**
   * Format a price amount from USD to the selected currency
   * @param {number} amountInUSD - The amount to format (in USD)
   * @param {Object} options - Additional formatting options
   * @returns {string} Formatted price string
   */
  const formatPrice = (amountInUSD, options = {}) => {
    if (amountInUSD == null) return '';
    
    try {
      // Convert from USD to target currency
      const convertedAmount = amountInUSD * currentCurrency.conversionRate;
      
      // Determine locale based on currency for better formatting
      const localeMap = {
        'USD': 'en-US',
        'INR': 'en-IN',
        'EUR': 'de-DE', // Using German locale for Euro
        'GBP': 'en-GB',
        'JPY': 'ja-JP',
        'CAD': 'en-CA',
        'AUD': 'en-AU',
        'CNY': 'zh-CN',
        'BRL': 'pt-BR',
        'RUB': 'ru-RU',
      };
      
      const locale = localeMap[currentCurrency.code] || 'en-US';
      
      // Format the converted amount
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currentCurrency.code,
        minimumFractionDigits: options.minimumFractionDigits !== undefined ? options.minimumFractionDigits : 2,
        maximumFractionDigits: options.maximumFractionDigits !== undefined ? options.maximumFractionDigits : 2,
      }).format(convertedAmount);
    } catch (error) {
      console.error('Error formatting currency:', error);
      // Fallback formatting
      return `${currentCurrency.symbol} ${(amountInUSD * currentCurrency.conversionRate).toFixed(2)}`;
    }
  };

  /**
   * Change the user's preferred currency
   * @param {string} newCurrencyCode - ISO currency code
   */
  const changeCurrency = async (newCurrencyCode) => {
    try {
      setCurrencyCode(newCurrencyCode);
      await AsyncStorage.setItem(USER_CURRENCY_KEY, newCurrencyCode);
      
      // Update current currency object
      const currency = AVAILABLE_CURRENCIES.find(c => c.code === newCurrencyCode);
      if (currency) {
        setCurrentCurrency(currency);
      }
      
      // Mark setup as complete if not already
      if (!initialSetupDone) {
        setInitialSetupDone(true);
        await AsyncStorage.setItem(INITIAL_SETUP_DONE_KEY, 'true');
      }
    } catch (error) {
      console.error('Error saving currency preference:', error);
    }
  };

  // Get raw conversion rate for a given amount
  const getConversionRate = () => currentCurrency.conversionRate;

  // Convert a price without formatting
  const convertPrice = (amountInUSD) => {
    if (amountInUSD == null) return 0;
    return amountInUSD * currentCurrency.conversionRate;
  };

  const value = {
    formatPrice,
    currencyCode,
    changeCurrency,
    isLoading,
    initialSetupDone,
    availableCurrencies: AVAILABLE_CURRENCIES,
    currentCurrency,
    getConversionRate,
    convertPrice
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

/**
 * Hook to access currency context
 */
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};