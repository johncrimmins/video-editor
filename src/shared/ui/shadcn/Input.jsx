import React from 'react';
import { cn } from '../../../lib/utils';

/**
 * Input component wrapper around shadcn/ui Input
 * For future form components
 * 
 * @param {Object} props
 * @param {string} props.type - Input type
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.required - Required state
 */
const Input = ({ 
  type = 'text',
  placeholder = '',
  value,
  onChange,
  className = '', 
  style = {},
  disabled = false,
  required = false,
  ...props 
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={cn(
        'flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200 ease-in-out',
        className
      )}
      style={style}
      {...props}
    />
  );
};

export default Input;
