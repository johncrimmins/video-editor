import React, { useState } from 'react';
import VideoImportScreen from './screens/VideoImportScreen';
import VideoPreviewScreen from './screens/VideoPreviewScreen';
import TimelineScreen from './screens/TimelineScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('import');
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);

  const handleVideoSelected = (videoFile) => {
    setSelectedVideoFile(videoFile);
    setCurrentScreen('preview');
  };

  const handleBackToImport = () => {
    setCurrentScreen('import');
    setSelectedVideoFile(null);
  };

  const handleGoToTimeline = () => {
    setCurrentScreen('timeline');
  };

  const handleBackToPreview = () => {
    setCurrentScreen('preview');
  };

  const handleDeleteClip = () => {
    setSelectedVideoFile(null);
    setCurrentScreen('import');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'import':
        return <VideoImportScreen onVideoSelected={handleVideoSelected} />;
      case 'preview':
        return <VideoPreviewScreen videoFile={selectedVideoFile} onBackToImport={handleBackToImport} onGoToTimeline={handleGoToTimeline} />;
      case 'timeline':
        return <TimelineScreen videoFile={selectedVideoFile} onBackToPreview={handleBackToPreview} onDeleteClip={handleDeleteClip} />;
      default:
        return <VideoImportScreen onVideoSelected={handleVideoSelected} />;
    }
  };

  return (
    <div className="app">
      {renderCurrentScreen()}
    </div>
  );
}

export default App;
