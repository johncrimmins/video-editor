import React from 'react';
import VideoPlayer from './components/VideoPlayer';

console.log('🎬 VideoPreviewScreen/index.jsx: VideoPreviewScreen loading...');

const VideoPreviewScreen = ({ videoFile, onBackToImport, onGoToTimeline }) => {
  console.log('🎬 VideoPreviewScreen/index.jsx: VideoPreviewScreen component rendering...');
  console.log('🎬 VideoPreviewScreen/index.jsx: videoFile prop:', videoFile);
  console.log('🎬 VideoPreviewScreen/index.jsx: onBackToImport prop:', onBackToImport);
  console.log('🎬 VideoPreviewScreen/index.jsx: onGoToTimeline prop:', onGoToTimeline);
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <VideoPlayer videoFile={videoFile} onBackToImport={onBackToImport} onGoToTimeline={onGoToTimeline} />
    </div>
  );
};

console.log('🎬 VideoPreviewScreen/index.jsx: VideoPreviewScreen component defined, exporting...');
export default VideoPreviewScreen;
