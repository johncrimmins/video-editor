import React, { useEffect } from 'react';
import { BasicScreen } from '../../shared/layouts';
import { useRecording } from '../../shared/hooks';
import { useNavigation } from '../../contexts/NavigationContext';
import SourceSelector from './components/SourceSelector';
import RecordingControls from './components/RecordingControls';
import RecordingPreview from './components/RecordingPreview';
import { ErrorMessage } from '../../shared/ui';

/**
 * RecordingsScreen - Screen recording functionality
 * Provides screen recording, webcam recording, and audio capture
 */
const RecordingsScreen = () => {
  const { navigate } = useNavigation();
  
  // Handle recording completion - send to timeline
  const handleRecordingComplete = (videoFile) => {
    console.log('🎥 RecordingsScreen: Recording completed:', videoFile);
    console.log('🎥 RecordingsScreen: Video file details:', {
      name: videoFile.name,
      size: videoFile.size,
      type: videoFile.type,
      duration: videoFile.duration,
      hasBlob: !!videoFile.blob,
      hasUrl: !!videoFile.url
    });
    
    // Navigate to timeline with the recorded video
    console.log('🎥 RecordingsScreen: Navigating to editor with video file');
    navigate('editor', { videoFile });
  };

  const {
    isRecording,
    isLoading,
    error,
    recordingDuration,
    formattedDuration,
    formattedSize,
    sources,
    selectedSource,
    currentStream,
    loadSources,
    startRecording,
    stopRecording,
    cancelRecording,
    setSelectedSource,
    clearError
  } = useRecording(handleRecordingComplete);

  // Load sources on component mount
  useEffect(() => {
    loadSources();
  }, [loadSources]);

  return (
    <BasicScreen className="p-lg">
      <div className="max-w-4xl mx-auto space-y-lg">
        {/* Header */}
        <div className="text-center mb-xl">
          <h1 className="text-4xl font-semibold text-text mb-lg">
            Quick Recordings
          </h1>
          <p className="text-md text-text-secondary leading-relaxed">
            Record your screen, webcam, or both. Recordings are automatically added to your timeline.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-lg">
            <ErrorMessage message={error} />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
          {/* Left Column - Controls */}
          <div className="space-y-lg">
            <SourceSelector
              sources={sources}
              selectedSource={selectedSource}
              onSourceSelect={setSelectedSource}
              isLoading={isLoading}
              onLoadSources={loadSources}
            />
            
            <RecordingControls
              isRecording={isRecording}
              isLoading={isLoading}
              error={error}
              recordingDuration={recordingDuration}
              formattedDuration={formattedDuration}
              formattedSize={formattedSize}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              onCancelRecording={cancelRecording}
              onClearError={clearError}
              selectedSource={selectedSource}
            />
          </div>

          {/* Right Column - Preview */}
          <div>
            <RecordingPreview
              currentStream={currentStream}
              isRecording={isRecording}
              recordingDuration={recordingDuration}
              formattedDuration={formattedDuration}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center pt-lg border-t border-border">
          <p className="text-sm text-text-secondary mb-md">
            Recordings are automatically saved and added to your timeline for editing.
          </p>
          <button
            onClick={() => navigate('editor')}
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            Go to Timeline Editor →
          </button>
        </div>
      </div>
    </BasicScreen>
  );
};

export default RecordingsScreen;
