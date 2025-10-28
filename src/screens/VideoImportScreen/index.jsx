import React from 'react';
import ImportInterface from './components/ImportInterface';

console.log('📹 VideoImportScreen/index.jsx: VideoImportScreen loading...');

const VideoImportScreen = ({ onVideoSelected }) => {
  console.log('📹 VideoImportScreen/index.jsx: VideoImportScreen component rendering...');
  console.log('📹 VideoImportScreen/index.jsx: onVideoSelected prop:', onVideoSelected);
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <ImportInterface onVideoSelected={onVideoSelected} />
    </div>
  );
};

console.log('📹 VideoImportScreen/index.jsx: VideoImportScreen component defined, exporting...');
export default VideoImportScreen;
