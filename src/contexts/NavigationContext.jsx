import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

export function NavigationProvider({ children }) {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  
  const navigate = (screen, data = {}) => {
    console.log('🧭 NavigationContext: Navigating to', screen, 'with data:', data);
    
    // Handle navigation with optional data
    if (data.videoFile) {
      console.log('🧭 NavigationContext: Setting video file:', {
        name: data.videoFile.name,
        size: data.videoFile.size,
        type: data.videoFile.type,
        duration: data.videoFile.duration,
        hasPath: !!data.videoFile.path,
        hasUrl: !!data.videoFile.url,
        isRecorded: data.videoFile.isRecorded
      });
      setSelectedVideoFile(data.videoFile);
    }
    setCurrentScreen(screen);
  };
  
  const value = {
    currentScreen,
    selectedVideoFile,
    navigate,
    setSelectedVideoFile,
  };
  
  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}

