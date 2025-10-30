import React from 'react';
import SourceThumbnail from './SourceThumbnail';

/**
 * SourceGrid - Grid layout component for displaying recording sources
 * Provides consistent grid layout with responsive design
 */
const SourceGrid = ({ 
  sources = [], 
  selectedSource, 
  onSourceSelect,
  className = ''
}) => {
  if (sources.length === 0) {
    return (
      <div className={`text-center py-lg ${className}`}>
        <p className="text-text-secondary mb-md">No recording sources available</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-md ${className}`}>
      {sources.map((source) => {
        const isScreen = source.name.includes('Capture screen');
        const isCamera = source.name.includes('Camera');
        
        return (
          <div
            key={source.id}
            className={`p-md border-2 rounded-lg cursor-pointer transition-all ${
              selectedSource?.id === source.id
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => onSourceSelect(source)}
          >
            <div className="flex items-start space-x-md">
              {/* Thumbnail */}
              <SourceThumbnail
                source={source}
                isSelected={selectedSource?.id === source.id}
                onClick={() => onSourceSelect(source)}
              />
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-text truncate mb-1">
                  {source.displayName || source.name}
                </h4>
                <p className="text-sm text-text-secondary">
                  {isScreen ? 'Screen Capture' : isCamera ? 'Camera' : 'Video Source'}
                </p>
                {selectedSource?.id === source.id && (
                  <div className="mt-2 flex items-center text-primary text-sm">
                    <span className="mr-1">✓</span>
                    <span>Selected</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SourceGrid;
