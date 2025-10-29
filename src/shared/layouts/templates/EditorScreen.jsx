import React from 'react';
import ScreenLayout from '../ScreenLayout';

/**
 * Editor screen template for Timeline screen
 * Provides full-screen editor layout with video preview
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Screen content
 * @param {string} props.className - Additional CSS classes for content
 * @param {Object} props.style - Additional inline styles for content
 */
const EditorScreen = ({ children, className = '', style = {} }) => {
  return (
    <ScreenLayout>
      <div className={`flex flex-col justify-start items-center w-full p-5 overflow-auto ${className}`} style={style}>
        {children}
      </div>
    </ScreenLayout>
  );
};

export default EditorScreen;
