import React, { memo } from 'react';
import { Card, CardContent } from '../../../shared/ui/shadcn';
import { Button, ErrorMessage } from '../../../shared/ui';
import { RecordingStatus, RecordingDuration } from '../../../shared/ui/recording';
import { useRecordingContext } from '../../../contexts/RecordingContext';

/**
 * RecordingControls - Component for recording start/stop controls and status
 * Now uses RecordingContext and reusable recording components
 * Memoized to prevent unnecessary re-renders
 */
const RecordingControls = memo(() => {
  const {
    isRecording,
    isLoading,
    error,
    formattedDuration,
    formattedSize,
    startRecording,
    stopRecording,
    cancelRecording,
    clearError,
    selectedSource
  } = useRecordingContext();

  const handleStartRecording = () => {
    if (!selectedSource) {
      alert('Please select a recording source first');
      return;
    }
    startRecording('screen');
  };

  return (
    <Card variant="card" className="mb-lg">
      <CardContent className="p-lg">
        <div className="flex items-center justify-between mb-md">
          <h3 className="text-lg font-semibold text-text">Recording Controls</h3>
          <RecordingStatus isRecording={isRecording} />
        </div>

        {error && (
          <div className="mb-md">
            <ErrorMessage message={error} />
            <Button
              variant="secondary"
              size="sm"
              onClick={clearError}
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
                <RecordingDuration duration={formattedDuration} />
              </div>
            </div>

            {/* Recording Controls */}
            <div className="flex space-x-md">
              <Button
                variant="destructive"
                size="lg"
                onClick={stopRecording}
                disabled={isLoading}
                className="flex-1"
              >
                ⏹️ Stop Recording
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={cancelRecording}
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
});

RecordingControls.displayName = 'RecordingControls';

export default RecordingControls;
