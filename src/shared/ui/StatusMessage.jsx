import React from 'react';
import { darkTheme as colors, borderRadius, spacing } from './darkTheme';

/**
 * Shared StatusMessage component for displaying success/error status messages
 * @param {Object} props
 * @param {boolean} props.success - Whether the status is success (true) or error (false)
 * @param {string} props.message - Status message to display
 * @param {Object} props.style - Additional inline styles
 */
const StatusMessage = ({ success = true, message, style = {}, ...props }) => {
  const baseStyles = {
    padding: spacing.md,
    backgroundColor: success ? colors.successBg : colors.errorBg,
    color: success ? colors.successText : colors.error,
    borderRadius: borderRadius.sm,
    fontSize: spacing.md,
    ...style,
  };

  if (!message) {
    return null;
  }

  return (
    <div style={baseStyles} {...props}>
      {message}
    </div>
  );
};

export default StatusMessage;

