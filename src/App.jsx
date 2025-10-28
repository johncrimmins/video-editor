import React, { useState } from 'react';
import VideoImportScreen from './screens/VideoImportScreen';
import VideoPreviewScreen from './screens/VideoPreviewScreen';
import TimelineScreen from './screens/TimelineScreen';

console.log('🎯 App.jsx: App component loading...');

function App() {
  console.log('🎯 App.jsx: App component rendering...');
  
  const [currentScreen, setCurrentScreen] = useState('import');
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  console.log('🎯 App.jsx: Current screen state:', currentScreen);
  console.log('🎯 App.jsx: Selected video file:', selectedVideoFile);

  const handleVideoSelected = (videoFile) => {
    console.log('🎯 App.jsx: handleVideoSelected called with video file:', videoFile);
    setSelectedVideoFile(videoFile);
    setCurrentScreen('preview');
    console.log('🎯 App.jsx: Switched to preview screen');
  };

  const handleBackToImport = () => {
    console.log('🎯 App.jsx: handleBackToImport called');
    setCurrentScreen('import');
    setSelectedVideoFile(null);
    console.log('🎯 App.jsx: Switched to import screen');
  };

  const handleGoToTimeline = () => {
    console.log('🎯 App.jsx: handleGoToTimeline called');
    setCurrentScreen('timeline');
    console.log('🎯 App.jsx: Switched to timeline screen');
  };

  const handleBackToPreview = () => {
    console.log('🎯 App.jsx: handleBackToPreview called');
    setCurrentScreen('preview');
    console.log('🎯 App.jsx: Switched to preview screen');
  };

  const renderCurrentScreen = () => {
    console.log('🎯 App.jsx: Rendering screen:', currentScreen);
    switch (currentScreen) {
      case 'import':
        console.log('🎯 App.jsx: Rendering VideoImportScreen...');
        return <VideoImportScreen onVideoSelected={handleVideoSelected} />;
      case 'preview':
        console.log('🎯 App.jsx: Rendering VideoPreviewScreen...');
        return <VideoPreviewScreen videoFile={selectedVideoFile} onBackToImport={handleBackToImport} onGoToTimeline={handleGoToTimeline} />;
      case 'timeline':
        console.log('🎯 App.jsx: Rendering TimelineScreen...');
        return <TimelineScreen videoFile={selectedVideoFile} onBackToPreview={handleBackToPreview} />;
      default:
        console.log('🎯 App.jsx: Rendering default VideoImportScreen...');
        return <VideoImportScreen onVideoSelected={handleVideoSelected} />;
    }
  };

  console.log('🎯 App.jsx: Returning JSX...');
  return (
    <div className="app">
      {renderCurrentScreen()}
    </div>
  );
}

console.log('🎯 App.jsx: App component defined, exporting...');
export default App;
