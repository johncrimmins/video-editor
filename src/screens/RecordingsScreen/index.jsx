import React, { useEffect } from 'react';
import { BasicScreen } from '../../shared/layouts';
import { RecordingProvider } from '../../contexts/RecordingContext';
import { useNavigation } from '../../contexts/NavigationContext';
import SourceSelector from './components/SourceSelector';
import RecordingControls from './components/RecordingControls';
import RecordingPreview from './components/RecordingPreview';
import { ErrorMessage } from '../../shared/ui';

/**
 * RecordingsScreen - Native screen recording functionality
 * Provides native screen recording using FFmpeg through Electron IPC
 * Now uses RecordingProvider for centralized state management
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

  return (
    <RecordingProvider onRecordingComplete={handleRecordingComplete}>
      <RecordingsScreenContent />
    </RecordingProvider>
  );
};

/**
 * RecordingsScreenContent - The actual screen content
 * Separated to allow RecordingProvider to wrap the content
 */
const RecordingsScreenContent = () => {
  const { navigate } = useNavigation();

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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
          {/* Left Column - Controls */}
          <div className="space-y-lg">
            <SourceSelector />
            <RecordingControls />
          </div>

          {/* Right Column - Preview */}
          <div>
            <RecordingPreview />
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
