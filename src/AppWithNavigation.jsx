import React from 'react';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { SidebarProvider } from './contexts/SidebarContext';
import HomeScreen from './screens/HomeScreen';
import ProjectsScreen from './screens/ProjectsScreen';
import RecordingsScreen from './screens/RecordingsScreen';
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
  
  // Handle video import from editor
  const handleVideoImported = (videoFile) => {
    setSelectedVideoFile(videoFile);
    // Stay on editor screen, it will automatically show timeline
  };
  
  // Handle delete clip
  const handleDeleteClip = () => {
    setSelectedVideoFile(null);
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
          onDeleteClip={handleDeleteClip}
          onVideoImported={handleVideoImported}
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

