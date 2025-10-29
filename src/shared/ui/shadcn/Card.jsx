import React from 'react';
import { cn } from '../../../lib/utils';

/**
 * Card component wrapper around shadcn/ui Card components
 * Replaces existing Container component functionality
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.variant - Card variant (card, dashed, solid)
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 */
const Card = ({ 
  children, 
  variant = 'card', 
  className = '', 
  style = {},
  ...props 
}) => {
  const baseClasses = 'rounded-lg border transition-all duration-200 ease-in-out';
  
  const variantClasses = {
    card: 'bg-card border-border shadow-sm',
    dashed: 'bg-transparent border-dashed border-2 border-border',
    solid: 'bg-background-secondary border-border',
  };
  
  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Card header component
 */
const CardHeader = ({ children, className = '', ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>
    {children}
  </div>
);

/**
 * Card title component
 */
const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={cn('text-lg font-semibold leading-none tracking-tight text-text', className)} {...props}>
    {children}
  </h3>
);

/**
 * Card description component
 */
const CardDescription = ({ children, className = '', ...props }) => (
  <p className={cn('text-sm text-text-secondary', className)} {...props}>
    {children}
  </p>
);

/**
 * Card content component
 */
const CardContent = ({ children, className = '', ...props }) => (
  <div className={cn('p-6 pt-0', className)} {...props}>
    {children}
  </div>
);

/**
 * Card footer component
 */
const CardFooter = ({ children, className = '', ...props }) => (
  <div className={cn('flex items-center p-6 pt-0', className)} {...props}>
    {children}
  </div>
);

// Export all components
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export default Card;
