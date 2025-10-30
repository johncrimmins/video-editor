import React from 'react';
import { Card, CardContent } from '../../../shared/ui/shadcn';
import LiveVideoPreview from './LiveVideoPreview';

/**
 * RecordingPreview - Component for showing live recording preview
 */
const RecordingPreview = ({ 
  currentStream, 
  isRecording, 
  recordingDuration,
  formattedDuration 
}) => {
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
          {isRecording && (
            <div className="flex items-center space-x-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-red-500 font-mono">{formattedDuration}</span>
            </div>
          )}
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
          
          {isRecording && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
              ● REC
            </div>
          )}
        </div>
        
        <div className="mt-md text-sm text-text-secondary">
          <p>Preview shows what's being recorded in real-time</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecordingPreview;
