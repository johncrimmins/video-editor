import React from 'react';
import { VideoScreen } from '../../shared/layouts';
import VideoPlayer from './components/VideoPlayer';

/**
 * VideoPreviewScreenV2 - Migrated version using VideoScreen template
 * Maintains exact same functionality as original VideoPreviewScreen
 */
const VideoPreviewScreenV2 = ({ videoFile, onBackToImport, onGoToTimeline }) => {
  console.log('🎬 VideoPreviewScreenV2: VideoPreviewScreenV2 component rendering...');
  console.log('🎬 VideoPreviewScreenV2: videoFile prop:', videoFile);
  console.log('🎬 VideoPreviewScreenV2: onBackToImport prop:', onBackToImport);
  console.log('🎬 VideoPreviewScreenV2: onGoToTimeline prop:', onGoToTimeline);
  
  return (
    <VideoScreen>
      <VideoPlayer videoFile={videoFile} onBackToImport={onBackToImport} onGoToTimeline={onGoToTimeline} />
    </VideoScreen>
  );
};

export default VideoPreviewScreenV2;
