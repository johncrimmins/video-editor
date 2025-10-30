import React from 'react';
import { darkTheme } from '../darkTheme';

/**
 * SourceThumbnail - Reusable thumbnail component for recording sources
 * Displays screen thumbnails or appropriate icons for different source types
 */
const SourceThumbnail = ({ 
  source, 
  isSelected = false, 
  onClick,
  className = ''
}) => {
  const isScreen = source.name.includes('Capture screen');
  const isCamera = source.name.includes('Camera');
  
  const thumbnailSize = {
    width: 80, // 20 * 4 (w-20)
    height: 80 // 20 * 4 (h-20)
  };

  return (
    <div
      className={`w-20 h-20 rounded-lg overflow-hidden bg-surface-dark flex-shrink-0 border border-border cursor-pointer transition-all ${
        isSelected 
          ? 'border-primary bg-primary/10' 
          : 'hover:border-primary/50'
      } ${className}`}
      onClick={onClick}
      style={{
        backgroundColor: darkTheme.backgroundSecondary,
        borderColor: isSelected ? darkTheme.primary : darkTheme.border
      }}
    >
      {source.thumbnail ? (
        <img
          src={source.thumbnail}
          alt={source.displayName || source.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-3xl">
          {isScreen ? '🖥️' : isCamera ? '📷' : '📺'}
        </div>
      )}
    </div>
  );
};

export default SourceThumbnail;
