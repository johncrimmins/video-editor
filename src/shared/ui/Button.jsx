import React from 'react';
import { colors, borderRadius, fontSizes, spacing } from './theme';

/**
 * Shared Button component with variants
 * @param {Object} props
 * @param {string} props.variant - Button variant: 'primary', 'secondary', 'success', 'danger'
 * @param {string} props.size - Button size: 'sm', 'md', 'lg'
 * @param {boolean} props.disabled - Disabled state
 * @param {Function} props.onClick - Click handler
 * @param {React.ReactNode} props.children - Button content
 * @param {Object} props.style - Additional inline styles
 */
const Button = ({ 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  onClick,
  children,
  style = {},
  ...props
}) => {
  const getVariantStyles = () => {
    const variants = {
      primary: {
        backgroundColor: disabled ? colors.secondary : colors.primary,
        color: 'white',
      },
      secondary: {
        backgroundColor: colors.secondary,
        color: 'white',
      },
      success: {
        backgroundColor: colors.success,
        color: 'white',
      },
      danger: {
        backgroundColor: colors.danger,
        color: 'white',
      },
    };
    return variants[variant] || variants.primary;
  };

  const getSizeStyles = () => {
    const sizes = {
      sm: {
        padding: `${spacing.sm} ${spacing.md}`,
        fontSize: fontSizes.sm,
      },
      md: {
        padding: `${spacing.md} ${spacing.lg}`,
        fontSize: fontSizes.sm,
      },
      lg: {
        padding: `${spacing.lg} ${spacing.xl}`,
        fontSize: fontSizes.md,
      },
    };
    return sizes[size] || sizes.md;
  };

  const baseStyles = {
    border: 'none',
    borderRadius: borderRadius.sm,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.2s',
    opacity: disabled ? 0.5 : 1,
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...style,
  };

  const handleMouseOver = (e) => {
    if (!disabled && variant === 'primary') {
      e.target.style.backgroundColor = colors.primaryHover;
    }
  };

  const handleMouseOut = (e) => {
    if (!disabled && variant === 'primary') {
      e.target.style.backgroundColor = colors.primary;
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={baseStyles}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

