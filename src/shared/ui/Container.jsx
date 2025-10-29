import React from 'react';
import { colors, borderRadius, spacing } from './theme';

/**
 * Shared Container component for consistent card/container styling
 * @param {Object} props
 * @param {string} props.variant - Container variant: 'card', 'dashed', 'solid'
 * @param {React.ReactNode} props.children - Container content
 * @param {Object} props.style - Additional inline styles
 */
const Container = ({ 
  variant = 'card',
  children,
  style = {},
  ...props
}) => {
  const getVariantStyles = () => {
    const variants = {
      card: {
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.md,
        backgroundColor: colors.light,
        padding: spacing.xl,
      },
      dashed: {
        border: `2px dashed ${colors.border}`,
        borderRadius: borderRadius.md,
        backgroundColor: colors.light,
        padding: spacing.xxxl,
        textAlign: 'center',
      },
      solid: {
        border: `2px solid ${colors.primary}`,
        borderRadius: borderRadius.md,
        backgroundColor: colors.light,
        padding: spacing.xl,
      },
    };
    return variants[variant] || variants.card;
  };

  const baseStyles = {
    ...getVariantStyles(),
    ...style,
  };

  return (
    <div style={baseStyles} {...props}>
      {children}
    </div>
  );
};

export default Container;

