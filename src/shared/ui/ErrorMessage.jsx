import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Shared ErrorMessage component for displaying error messages
 * @param {Object} props
 * @param {string} props.message - Error message to display
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 */
const ErrorMessage = ({ message, className = '', style = {}, ...props }) => {
  if (!message) {
    return null;
  }

  return (
    <div 
      className={cn(
        'mb-xl p-md bg-error-bg text-error rounded-sm border border-error',
        className
      )}
      style={style}
      {...props}
    >
      <strong>Error:</strong> {message}
    </div>
  );
};

export default ErrorMessage;

