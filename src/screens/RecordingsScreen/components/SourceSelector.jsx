import React from 'react';
import { Card, CardContent } from '../../../shared/ui/shadcn';
import { Button } from '../../../shared/ui';

/**
 * SourceSelector - Component for selecting recording sources (screens/windows)
 */
const SourceSelector = ({ 
  sources, 
  selectedSource, 
  onSourceSelect, 
  isLoading, 
  onLoadSources 
}) => {
  const handleLoadSources = () => {
    onLoadSources();
  };
  
  return (
    <Card variant="card" className="mb-lg">
      <CardContent className="p-lg">
        <div className="flex items-center justify-between mb-md">
          <h3 className="text-lg font-semibold text-text">Recording Source</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLoadSources}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
        
        {sources.length === 0 ? (
          <div className="text-center py-lg">
            <p className="text-text-secondary mb-md">No recording sources available</p>
            <Button
              variant="primary"
              size="sm"
              onClick={handleLoadSources}
              disabled={isLoading}
            >
              Load Sources
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
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
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-dark flex-shrink-0 border border-border">
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
        )}
      </CardContent>
    </Card>
  );
};

export default SourceSelector;
