import React from 'react';
import ScreenLayout from '../ScreenLayout';

/**
 * Video screen template for Import and Preview screens
 * Provides layout optimized for video-related content
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Screen content
 * @param {string} props.className - Additional CSS classes for content
 * @param {Object} props.style - Additional inline styles for content
 */
const VideoScreen = ({ children, className = '', style = {} }) => {
  return (
    <ScreenLayout>
      <div className={`flex flex-col justify-center items-center w-full h-full p-5 ${className}`} style={style}>
        {children}
      </div>
    </ScreenLayout>
  );
};

export default VideoScreen;
