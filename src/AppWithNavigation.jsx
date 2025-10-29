import React from 'react';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { SidebarProvider } from './contexts/SidebarContext';
import HomeScreen from './screens/HomeScreen';
import ProjectsScreen from './screens/ProjectsScreen';
import RecordingsScreen from './screens/RecordingsScreen';
import VideoImportScreen from './screens/VideoImportScreen';
import VideoPreviewScreen from './screens/VideoPreviewScreen';
import TimelineScreen from './screens/TimelineScreen';

function AppContent() {
  const { currentScreen, selectedVideoFile, setSelectedVideoFile, navigate } = useNavigation();
  
  // Restore video from sessionStorage on mount
  React.useEffect(() => {
    const savedVideo = sessionStorage.getItem('currentVideo');
    if (savedVideo && !selectedVideoFile) {
      try {
        const videoData = JSON.parse(savedVideo);
        setSelectedVideoFile(videoData);
      } catch (error) {
        // Invalid data, clear it
        sessionStorage.removeItem('currentVideo');
      }
    }
  }, [selectedVideoFile, setSelectedVideoFile]);
  
  // Save video to sessionStorage whenever it changes
  React.useEffect(() => {
    if (selectedVideoFile) {
      sessionStorage.setItem('currentVideo', JSON.stringify(selectedVideoFile));
    } else {
      sessionStorage.removeItem('currentVideo');
    }
  }, [selectedVideoFile]);
  
  // Handle video selection from import screen
  const handleVideoSelected = (videoFile) => {
    setSelectedVideoFile(videoFile);
    navigate('preview');
  };
  
  // Handle video import from editor empty state
  const handleVideoImported = (videoFile) => {
    setSelectedVideoFile(videoFile);
    // Stay on editor screen, it will automatically show timeline
  };
  
  // Handle navigation back to import
  const handleBackToImport = () => {
    navigate('import');
    setSelectedVideoFile(null);
  };
  
  // Handle navigation to timeline
  const handleGoToTimeline = () => {
    navigate('timeline');
  };
  
  // Handle navigation back to preview
  const handleBackToPreview = () => {
    navigate('preview');
  };
  
  // Handle delete clip
  const handleDeleteClip = () => {
    setSelectedVideoFile(null);
    navigate('import');
  };
  
  // Render the appropriate screen based on currentScreen
  switch (currentScreen) {
    case 'home':
      return <HomeScreen />;
    
    case 'projects':
      return <ProjectsScreen />;
    
    case 'recordings':
      return <RecordingsScreen />;
    
    case 'editor':
      return (
        <TimelineScreen
          videoFile={selectedVideoFile}
          onBackToPreview={handleBackToPreview}
          onDeleteClip={handleDeleteClip}
          onVideoImported={handleVideoImported}
        />
      );
    
    case 'import':
      return <VideoImportScreen onVideoSelected={handleVideoSelected} />;
    
    case 'preview':
      return (
        <VideoPreviewScreen
          videoFile={selectedVideoFile}
          onBackToImport={handleBackToImport}
          onGoToTimeline={handleGoToTimeline}
        />
      );
    
    case 'timeline':
      return (
        <TimelineScreen
          videoFile={selectedVideoFile}
          onBackToPreview={handleBackToPreview}
          onDeleteClip={handleDeleteClip}
        />
      );
    
    default:
      return <HomeScreen />;
  }
}

function AppWithNavigation() {
  return (
    <NavigationProvider>
      <SidebarProvider>
        <AppContent />
      </SidebarProvider>
    </NavigationProvider>
  );
}

export default AppWithNavigation;

