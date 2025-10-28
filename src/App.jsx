import React, { useState } from 'react';
import VideoImportScreen from './screens/VideoImportScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('import');

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'import':
        return <VideoImportScreen />;
      default:
        return <VideoImportScreen />;
    }
  };

  return (
    <div className="app">
      {renderCurrentScreen()}
    </div>
  );
}

export default App;
