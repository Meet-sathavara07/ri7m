import { useEffect, useState } from 'react';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, NativeModules } from 'react-native';

// Storage keys for user preferences
const USER_CURRENCY_KEY = 'user_preferred_currency';
const USER_COUNTRY_KEY = 'user_country';

// Exchange rates for conversion from USD
const EXCHANGE_RATES = {
  USD: 1.0,
  EUR: 0.93,
  GBP: 0.78,
  JPY: 151.02,
  INR: 83.50,
  CAD: 1.37,
  AUD: 1.51,
  CNY: 7.23,
  RUB: 92.04,
  BRL: 5.05,
  ZAR: 18.32,
};

/**
 * More reliable device locale detection
 */
const getDeviceLocale = () => {
  try {
    // First try expo-localization
    if (Localization.locale) {
      return Localization.locale;
    }

    // Platform-specific fallbacks
    if (Platform.OS === 'ios') {
      return (
        NativeModules.SettingsManager?.settings?.AppleLocale ||
        NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ||
        'en-US'
      );
    } else if (Platform.OS === 'android') {
      return (
        NativeModules.I18nManager?.localeIdentifier ||
        NativeModules.I18nManager?.locale ||
        'en-US'
      );
    }
  } catch (error) {
    console.warn('Error detecting device locale:', error);
  }
  return 'en-US'; // Ultimate fallback
};

/**
 * Improved country detection
 */
const getDeviceCountry = () => {
  try {
    const locale = getDeviceLocale();
    if (!locale) return null;

    // Extract country code from locale (handles formats like en-US, en_US, etc.)
    const parts = locale.split(/[-_]/);
    if (parts.length > 1) {
      return parts[1].toUpperCase();
    }

    // Special cases for countries that might only have language code
    if (locale.toLowerCase() === 'en') return 'US';
    if (locale.toLowerCase() === 'ja') return 'JP';
    if (locale.toLowerCase() === 'zh') return 'CN';

    return null;
  } catch (error) {
    console.warn('Error detecting device country:', error);
    return null;
  }
};

export const useCurrencyFormatter = (options = {}) => {
  const [locale, setLocale] = useState(options.defaultLocale || getDeviceLocale());
  const [currencyCode, setCurrencyCode] = useState(options.defaultCurrency || 'USD');
  const [country, setCountry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [conversionRate, setConversionRate] = useState(1.0);
  const convertFromUSD = options.convertFromUSD !== false;

  useEffect(() => {
    const initCurrency = async () => {
      try {
        const [storedCurrency, storedCountry] = await Promise.all([
          AsyncStorage.getItem(USER_CURRENCY_KEY),
          AsyncStorage.getItem(USER_COUNTRY_KEY)
        ]);

        // Use stored country or detect new one
        let currentCountry = storedCountry;
        if (!currentCountry) {
          currentCountry = getDeviceCountry();
          if (currentCountry) {
            await AsyncStorage.setItem(USER_COUNTRY_KEY, currentCountry);
          }
        }
        setCountry(currentCountry);

        // Determine currency to use
        let currencyToUse = storedCurrency;
        if (!currencyToUse && currentCountry) {
          currencyToUse = getCurrencyFromCountry(currentCountry);
          if (currencyToUse) {
            await AsyncStorage.setItem(USER_CURRENCY_KEY, currencyToUse);
          }
        }

        if (currencyToUse) {
          setCurrencyCode(currencyToUse);
          if (convertFromUSD) {
            setConversionRate(EXCHANGE_RATES[currencyToUse] || 1.0);
          }
        }
      } catch (error) {
        console.error('Currency initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initCurrency();
  }, [options.defaultCurrency, convertFromUSD]);

  const formatPrice = (amount, formatOptions = {}) => {
    if (amount == null) return '';
    
    try {
      const currency = formatOptions.currency || currencyCode;
      let convertedAmount = amount;
      
      if (convertFromUSD && currency !== 'USD' && !formatOptions.skipConversion) {
        convertedAmount = amount * (EXCHANGE_RATES[currency] || 1.0);
      }
      
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: formatOptions.minimumFractionDigits ?? 2,
        maximumFractionDigits: formatOptions.maximumFractionDigits ?? 2,
        ...formatOptions
      }).format(convertedAmount);
    } catch (error) {
      console.warn('Formatting error, using fallback:', error);
      return `${currencyCode} ${amount.toFixed(2)}`;
    }
  };

  const changeCurrency = async (newCurrencyCode) => {
    try {
      setCurrencyCode(newCurrencyCode);
      await AsyncStorage.setItem(USER_CURRENCY_KEY, newCurrencyCode);
      if (convertFromUSD) {
        setConversionRate(EXCHANGE_RATES[newCurrencyCode] || 1.0);
      }
    } catch (error) {
      console.error('Error changing currency:', error);
    }
  };

  const changeCountry = async (newCountry) => {
    try {
      setCountry(newCountry);
      await AsyncStorage.setItem(USER_COUNTRY_KEY, newCountry);
      const newCurrency = getCurrencyFromCountry(newCountry);
      if (newCurrency) {
        await changeCurrency(newCurrency);
      }
    } catch (error) {
      console.error('Error changing country:', error);
    }
  };

  return {
    formatPrice,
    currencyCode,
    locale,
    country,
    changeCurrency,
    changeCountry,
    conversionRate,
    isLoading
  };
};

function getCurrencyFromCountry(countryCode) {
  const countryToCurrency = {
    'US': 'USD', 'GB': 'GBP', 'CA': 'CAD', 'AU': 'AUD', 'JP': 'JPY',
    'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'ES': 'EUR', 'NL': 'EUR',
    'BE': 'EUR', 'AT': 'EUR', 'GR': 'EUR', 'PT': 'EUR', 'FI': 'EUR',
    'IE': 'EUR', 'CN': 'CNY', 'RU': 'RUB', 'BR': 'BRL', 'IN': 'INR',
    'ZA': 'ZAR', 'MX': 'MXN', 'KR': 'KRW', 'SG': 'SGD', 'NZ': 'NZD',
    'CH': 'CHF', 'SE': 'SEK', 'DK': 'DKK', 'NO': 'NOK', 'PL': 'PLN',
    'TR': 'TRY', 'ID': 'IDR', 'TH': 'THB', 'VN': 'VND', 'MY': 'MYR',
    'PH': 'PHP', 'SA': 'SAR', 'AE': 'AED', 'IL': 'ILS', 'EG': 'EGP',
    'HK': 'HKD', 'TW': 'TWD', 'CO': 'COP', 'AR': 'ARS', 'CL': 'CLP',
    'PE': 'PEN', 'VE': 'VES', 'CR': 'CRC', 'PA': 'PAB', 'DO': 'DOP'
  };
  return countryToCurrency[countryCode] || 'USD';
}

export const CurrencyDisplay = ({ 
  amount, 
  style = {}, 
  textComponent: TextComponent,
  formatOptions = {},
}) => {
  const { formatPrice, isLoading } = useCurrencyFormatter();
  
  if (isLoading) {
    return <TextComponent style={style}>...</TextComponent>;
  }
  
  return (
    <TextComponent style={style}>
      {formatPrice(amount, formatOptions)}
    </TextComponent>
  );
};