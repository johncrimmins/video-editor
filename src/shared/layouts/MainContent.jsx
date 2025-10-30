import React from 'react';

/**
 * Main content area component that provides consistent styling
 * and layout for screen content
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 */
const MainContent = ({ children, className = '', style = {} }) => {
  return (
    <div 
      className={`flex-1 min-h-0 overflow-hidden ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default MainContent;
