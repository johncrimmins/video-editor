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
  return (
    <Card variant="card" className="mb-lg">
      <CardContent className="p-lg">
        <div className="flex items-center justify-between mb-md">
          <h3 className="text-lg font-semibold text-text">Recording Source</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={onLoadSources}
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
              onClick={onLoadSources}
              disabled={isLoading}
            >
              Load Sources
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {sources.map((source) => (
              <div
                key={source.id}
                className={`p-md border-2 rounded-lg cursor-pointer transition-all ${
                  selectedSource?.id === source.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => onSourceSelect(source)}
              >
                <div className="flex items-center space-x-md">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    {source.thumbnailURL ? (
                      <img
                        src={source.thumbnailURL}
                        alt={source.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        📺
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-text truncate">{source.name}</h4>
                    <p className="text-sm text-text-secondary">
                      {source.name.includes('Screen') ? 'Screen' : 'Window'}
                    </p>
                  </div>
                  {selectedSource?.id === source.id && (
                    <div className="text-primary">✓</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SourceSelector;
