import React from 'react';
import { cn } from '../../../lib/utils';

/**
 * Button component wrapper around shadcn/ui Button with custom variants
 * Maps existing button styles to shadcn variants
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - Button variant (primary, secondary, success, danger)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.type - Button type
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  style = {},
  onClick,
  disabled = false,
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary text-text hover:bg-primary-hover focus:ring-primary',
    secondary: 'bg-background-secondary text-text border border-border hover:bg-hover focus:ring-primary',
    success: 'bg-success text-text hover:bg-success/90 focus:ring-success',
    danger: 'bg-error text-text hover:bg-error/90 focus:ring-error',
    ghost: 'bg-transparent text-text-secondary hover:bg-hover focus:ring-primary',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base',
  };
  
  return (
    <button
      type={type}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      style={style}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
