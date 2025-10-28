import React, { useState } from 'react';
import VideoImportScreen from './screens/VideoImportScreen';

console.log('🎯 App.jsx: App component loading...');

function App() {
  console.log('🎯 App.jsx: App component rendering...');
  
  const [currentScreen, setCurrentScreen] = useState('import');
  console.log('🎯 App.jsx: Current screen state:', currentScreen);

  const renderCurrentScreen = () => {
    console.log('🎯 App.jsx: Rendering screen:', currentScreen);
    switch (currentScreen) {
      case 'import':
        console.log('🎯 App.jsx: Rendering VideoImportScreen...');
        return <VideoImportScreen />;
      default:
        console.log('🎯 App.jsx: Rendering default VideoImportScreen...');
        return <VideoImportScreen />;
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
