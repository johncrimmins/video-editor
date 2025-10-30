import React, { memo } from 'react';
import { Card, CardContent } from '../../../shared/ui/shadcn';
import { Button } from '../../../shared/ui';
import { SourceGrid } from '../../../shared/ui/recording';
import { useRecordingContext } from '../../../contexts/RecordingContext';

/**
 * SourceSelector - Component for selecting recording sources (screens/windows)
 * Now uses RecordingContext and reusable SourceGrid component
 * Memoized to prevent unnecessary re-renders
 */
const SourceSelector = memo(() => {
  const { 
    sources, 
    selectedSource, 
    setSelectedSource, 
    isLoading, 
    loadSources 
  } = useRecordingContext();
  
  const handleLoadSources = () => {
    loadSources();
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
          <SourceGrid
            sources={sources}
            selectedSource={selectedSource}
            onSourceSelect={setSelectedSource}
          />
        )}
      </CardContent>
    </Card>
  );
});

SourceSelector.displayName = 'SourceSelector';

export default SourceSelector;
