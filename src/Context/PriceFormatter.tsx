import React from 'react';
import { Text } from 'react-native';
import { useCurrency } from './CurrencyContext';

/**
 * A reusable price display component that handles currency conversion and formatting
 * @param {Object} props
 * @param {number} props.priceInUSD - The price amount in USD to display
 * @param {Object} props.style - Style object for the text component
 * @param {React.ComponentType} props.TextComponent - Custom text component
 * @param {Object} props.formatOptions - Formatting options for Intl.NumberFormat
 * @param {boolean} props.showCurrencyCode - Whether to show the currency code (USD, INR, etc.)
 */
const PriceFormatter = ({ 
  priceInUSD, 
  style = {}, 
  TextComponent = Text,
  formatOptions = {},
  showCurrencyCode = false,
}) => {
  const { formatPrice, isLoading, currencyCode } = useCurrency();
  
  // Handle loading state
  if (isLoading) {
    return <TextComponent style={style}>...</TextComponent>;
  }
  
  // Format the price with appropriate currency
  let formattedPrice = formatPrice(priceInUSD, formatOptions);
  
  // Add currency code if requested
  if (showCurrencyCode) {
    formattedPrice = `${formattedPrice} ${currencyCode}`;
  }
  
  return (
    <TextComponent style={style}>
      {formattedPrice}
    </TextComponent>
  );
};

export default PriceFormatter;