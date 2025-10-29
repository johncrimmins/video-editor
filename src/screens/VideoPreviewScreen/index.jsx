import React from 'react';
import { VideoScreen } from '../../shared/layouts';
import VideoPlayer from './components/VideoPlayer';

/**
 * VideoPreviewScreen - Modern version using VideoScreen template
 * Provides video preview functionality with player controls
 */
const VideoPreviewScreen = ({ videoFile, onBackToImport, onGoToTimeline }) => {
  return (
    <VideoScreen>
      <VideoPlayer videoFile={videoFile} onBackToImport={onBackToImport} onGoToTimeline={onGoToTimeline} />
    </VideoScreen>
  );
};

export default VideoPreviewScreen;
