import React from 'react';
import { VideoScreen } from '../../shared/layouts';
import ImportInterface from './components/ImportInterface';

/**
 * VideoImportScreen - Modern version using VideoScreen template
 * Provides video import functionality with file picker
 */
const VideoImportScreen = ({ onVideoSelected }) => {
  console.log('📹 VideoImportScreen: VideoImportScreen component rendering...');
  console.log('📹 VideoImportScreen: onVideoSelected prop:', onVideoSelected);
  
  return (
    <VideoScreen>
      <ImportInterface onVideoSelected={onVideoSelected} />
    </VideoScreen>
  );
};

export default VideoImportScreen;
