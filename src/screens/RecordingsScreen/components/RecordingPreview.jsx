import React, { memo } from 'react';
import { Card, CardContent } from '../../../shared/ui/shadcn';
import { RecordingStatus, RecordingIndicator } from '../../../shared/ui/recording';
import { useRecordingContext } from '../../../contexts/RecordingContext';
import LiveVideoPreview from './LiveVideoPreview';

/**
 * RecordingPreview - Component for showing live recording preview
 * Now uses RecordingContext and reusable recording components
 * Memoized to prevent unnecessary re-renders
 */
const RecordingPreview = memo(() => {
  const { 
    currentStream, 
    isRecording, 
    formattedDuration 
  } = useRecordingContext();

  if (!currentStream) {
    return (
      <Card variant="card">
        <CardContent className="p-lg">
          <div className="text-center py-xl">
            <div className="text-6xl mb-md opacity-30">📹</div>
            <p className="text-text-secondary">
              {isRecording ? 'Starting recording...' : 'No active recording'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="card">
      <CardContent className="p-lg">
        <div className="flex items-center justify-between mb-md">
          <h3 className="text-lg font-semibold text-text">Live Preview</h3>
          <RecordingStatus 
            isRecording={isRecording} 
            duration={formattedDuration}
          />
        </div>
        
        <div className="relative bg-black rounded-lg overflow-hidden">
          <LiveVideoPreview
            srcObject={currentStream}
            autoPlay
            muted
            className="w-full h-auto max-h-96"
            style={{ 
              transform: 'scaleX(-1)', // Mirror the preview
              objectFit: 'cover'
            }}
          />
          
          <RecordingIndicator />
        </div>
        
        <div className="mt-md text-sm text-text-secondary">
          <p>Preview shows what's being recorded in real-time</p>
        </div>
      </CardContent>
    </Card>
  );
});

RecordingPreview.displayName = 'RecordingPreview';

export default RecordingPreview;
