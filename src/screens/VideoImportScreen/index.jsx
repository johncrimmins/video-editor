import React from 'react';
import ImportInterface from './components/ImportInterface';

console.log('📹 VideoImportScreen/index.jsx: VideoImportScreen loading...');

const VideoImportScreen = () => {
  console.log('📹 VideoImportScreen/index.jsx: VideoImportScreen component rendering...');
  
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

console.log('📹 VideoImportScreen/index.jsx: VideoImportScreen component defined, exporting...');
export default VideoImportScreen;
