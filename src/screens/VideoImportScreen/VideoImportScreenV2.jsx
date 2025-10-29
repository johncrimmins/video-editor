import React from 'react';
import { VideoScreen } from '../../shared/layouts';
import ImportInterface from './components/ImportInterface';

/**
 * VideoImportScreenV2 - Migrated version using VideoScreen template
 * Maintains exact same functionality as original VideoImportScreen
 */
const VideoImportScreenV2 = ({ onVideoSelected }) => {
  console.log('📹 VideoImportScreenV2: VideoImportScreenV2 component rendering...');
  console.log('📹 VideoImportScreenV2: onVideoSelected prop:', onVideoSelected);
  
  return (
    <VideoScreen>
      <ImportInterface onVideoSelected={onVideoSelected} />
    </VideoScreen>
  );
};

export default VideoImportScreenV2;
