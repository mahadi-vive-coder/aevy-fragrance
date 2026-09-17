import React from 'react';

interface TakaProps {
  className?: string;
}

/**
 * Renders the authentic Bangladeshi Taka symbol (৳) with dedicated
 * Bengali typography support, preventing distortion in luxury serif font contexts
 * while preserving the parent font styling for numeric prices.
 */
export const Taka: React.FC<TakaProps> = ({ className = '' }) => {
  return <span className={`taka-symbol ${className}`}>৳</span>;
};

export default Taka;
