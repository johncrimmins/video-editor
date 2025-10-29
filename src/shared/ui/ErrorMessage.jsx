import React from 'react';
import { colors, borderRadius, spacing } from './theme';

/**
 * Shared ErrorMessage component for displaying error messages
 * @param {Object} props
 * @param {string} props.message - Error message to display
 * @param {Object} props.style - Additional inline styles
 */
const ErrorMessage = ({ message, style = {}, ...props }) => {
  const baseStyles = {
    marginBottom: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.errorBg,
    color: colors.error,
    borderRadius: borderRadius.sm,
    border: `1px solid ${colors.errorBorder}`,
    ...style,
  };

  if (!message) {
    return null;
  }

  return (
    <div style={baseStyles} {...props}>
      <strong>Error:</strong> {message}
    </div>
  );
};

export default ErrorMessage;

