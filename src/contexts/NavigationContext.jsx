import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

export function NavigationProvider({ children }) {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  
  const navigate = (screen, data = {}) => {
    // Handle navigation with optional data
    if (data.videoFile) {
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

