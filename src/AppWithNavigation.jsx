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
  
  // Debug logging
  console.log('🔄 AppContent: Rendering with currentScreen:', currentScreen);
  console.log('🔄 AppContent: selectedVideoFile:', selectedVideoFile);
  
  // Handle video selection from import screen
  const handleVideoSelected = (videoFile) => {
    setSelectedVideoFile(videoFile);
    navigate('preview');
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
      console.log('🏠 AppContent: Rendering HomeScreen');
      return <HomeScreen />;
    
    case 'projects':
      console.log('📁 AppContent: Rendering ProjectsScreen');
      return <ProjectsScreen />;
    
    case 'recordings':
      console.log('🎥 AppContent: Rendering RecordingsScreen');
      return <RecordingsScreen />;
    
    case 'editor':
      console.log('✂️ AppContent: Rendering Editor/Timeline');
      console.log('✂️ AppContent: Has video file?', !!selectedVideoFile);
      // Editor can be accessed from home, so check if we have a video file
      // If not, show import screen first
      if (!selectedVideoFile) {
        console.log('✂️ AppContent: No video file, showing import screen');
        return <VideoImportScreen onVideoSelected={handleVideoSelected} />;
      }
      console.log('✂️ AppContent: Has video file, showing timeline');
      return (
        <TimelineScreen
          videoFile={selectedVideoFile}
          onBackToPreview={handleBackToPreview}
          onDeleteClip={handleDeleteClip}
        />
      );
    
    case 'import':
      console.log('📥 AppContent: Rendering VideoImportScreen');
      return <VideoImportScreen onVideoSelected={handleVideoSelected} />;
    
    case 'preview':
      console.log('👁️ AppContent: Rendering VideoPreviewScreen');
      return (
        <VideoPreviewScreen
          videoFile={selectedVideoFile}
          onBackToImport={handleBackToImport}
          onGoToTimeline={handleGoToTimeline}
        />
      );
    
    case 'timeline':
      console.log('⏱️ AppContent: Rendering TimelineScreen');
      return (
        <TimelineScreen
          videoFile={selectedVideoFile}
          onBackToPreview={handleBackToPreview}
          onDeleteClip={handleDeleteClip}
        />
      );
    
    default:
      console.log('❓ AppContent: Unknown screen, defaulting to HomeScreen');
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

