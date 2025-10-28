import React from 'react';
import ImportInterface from './components/ImportInterface';

const VideoImportScreen = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <ImportInterface />
    </div>
  );
};

export default VideoImportScreen;
