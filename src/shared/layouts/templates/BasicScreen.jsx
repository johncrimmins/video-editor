import React from 'react';
import ScreenLayout from '../ScreenLayout';

/**
 * Basic screen template for simple screens like Home, Projects, Recordings
 * Provides standard layout with optional custom content styling
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Screen content
 * @param {string} props.className - Additional CSS classes for content
 * @param {Object} props.style - Additional inline styles for content
 */
const BasicScreen = ({ children, className = '', style = {} }) => {
  return (
    <ScreenLayout>
      <div className={`flex flex-col justify-start items-center w-full p-5 ${className}`} style={style}>
        {children}
      </div>
    </ScreenLayout>
  );
};

export default BasicScreen;
