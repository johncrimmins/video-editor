import React from 'react';
import Sidebar from '../HomeScreen/components/Sidebar';
import Header from '../HomeScreen/components/Header';
import VideoPlayer from './components/VideoPlayer';
import { useSidebar } from '../../contexts/SidebarContext';
import { darkTheme } from '../../shared/ui/darkTheme';

console.log('🎬 VideoPreviewScreen/index.jsx: VideoPreviewScreen loading...');

const VideoPreviewScreen = ({ videoFile, onBackToImport, onGoToTimeline }) => {
  const { sidebarWidth } = useSidebar();
  
  console.log('🎬 VideoPreviewScreen/index.jsx: VideoPreviewScreen component rendering...');
  console.log('🎬 VideoPreviewScreen/index.jsx: videoFile prop:', videoFile);
  console.log('🎬 VideoPreviewScreen/index.jsx: onBackToImport prop:', onBackToImport);
  console.log('🎬 VideoPreviewScreen/index.jsx: onGoToTimeline prop:', onGoToTimeline);
  console.log('🎬 VideoPreviewScreen/index.jsx: sidebarWidth:', sidebarWidth);
  
  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={{
        ...styles.mainArea,
        marginLeft: `${sidebarWidth}px`,
      }}>
        <Header />
        <div style={styles.content}>
          <VideoPlayer videoFile={videoFile} onBackToImport={onBackToImport} onGoToTimeline={onGoToTimeline} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    backgroundColor: darkTheme.background,
    overflow: 'hidden',
  },
  mainArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'margin-left 0.3s ease',
  },
  content: {
    marginTop: '60px',
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

console.log('🎬 VideoPreviewScreen/index.jsx: VideoPreviewScreen component defined, exporting...');
export default VideoPreviewScreen;
