import React from 'react';
import { Text } from 'react-native';
import { useCurrencyFormatter } from './CurrencyFormatter';

/**
 * A reusable price display component that handles currency formatting
 * @param {Object} props
 * @param {number} props.price - The price amount to display (in base currency, usually USD)
 * @param {Object} props.style - Style object for the text component
 * @param {React.ComponentType} props.TextComponent - Custom text component (defaults to Text from react-native)
 * @param {Object} props.formatOptions - Additional formatting options for Intl.NumberFormat
 * @param {string} props.overrideCurrency - Optional currency code to override app's default
 */
const PriceDisplay = ({ 
  price, 
  style = {}, 
  TextComponent = Text,
  formatOptions = {},
  overrideCurrency = null,
}) => {
  const { formatPrice, isLoading } = useCurrencyFormatter();
  
  // Handle loading state
  if (isLoading) {
    return <TextComponent style={style}>...</TextComponent>;
  }
  
  // Apply currency override if provided
  const options = overrideCurrency 
    ? { ...formatOptions, currency: overrideCurrency }
    : formatOptions;
  
  return (
    <TextComponent style={style}>
      {formatPrice(price, options)}
    </TextComponent>
  );
};

export default PriceDisplay;