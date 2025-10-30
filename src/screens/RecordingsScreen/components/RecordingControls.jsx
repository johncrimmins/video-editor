import React from 'react';
import { Card, CardContent } from '../../../shared/ui/shadcn';
import { Button, ErrorMessage } from '../../../shared/ui';

/**
 * RecordingControls - Component for recording start/stop controls and status
 */
const RecordingControls = ({
  isRecording,
  isLoading,
  error,
  recordingDuration,
  formattedDuration,
  formattedSize,
  onStartRecording,
  onStopRecording,
  onCancelRecording,
  onClearError,
  selectedSource
}) => {
  const handleStartRecording = () => {
    if (!selectedSource) {
      alert('Please select a recording source first');
      return;
    }
    onStartRecording('screen');
  };

  return (
    <Card variant="card" className="mb-lg">
      <CardContent className="p-lg">
        <div className="flex items-center justify-between mb-md">
          <h3 className="text-lg font-semibold text-text">Recording Controls</h3>
          {isRecording && (
            <div className="flex items-center space-x-sm">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-text-secondary">Recording</span>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-md">
            <ErrorMessage message={error} />
            <Button
              variant="secondary"
              size="sm"
              onClick={onClearError}
              className="mt-sm"
            >
              Dismiss
            </Button>
          </div>
        )}

        {isRecording ? (
          <div className="space-y-md">
            {/* Recording Status */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-500 font-medium">Recording in progress</p>
                  <p className="text-sm text-text-secondary">
                    Duration: {formattedDuration} | Size: {formattedSize}
                  </p>
                </div>
                <div className="text-2xl font-mono text-red-500">
                  {formattedDuration}
                </div>
              </div>
            </div>

            {/* Recording Controls */}
            <div className="flex space-x-md">
              <Button
                variant="destructive"
                size="lg"
                onClick={onStopRecording}
                disabled={isLoading}
                className="flex-1"
              >
                ⏹️ Stop Recording
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={onCancelRecording}
                disabled={isLoading}
              >
                ❌ Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-md">
            {/* Ready to Record */}
            <div className="text-center py-lg">
              <div className="text-6xl mb-md opacity-50">🎥</div>
              <p className="text-text-secondary mb-md">
                {selectedSource 
                  ? `Ready to record ${selectedSource.name}`
                  : 'Select a recording source to begin'
                }
              </p>
            </div>

            {/* Start Recording Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartRecording}
              disabled={isLoading || !selectedSource}
              className="w-full"
            >
              {isLoading ? 'Preparing...' : '🎬 Start Recording'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecordingControls;
