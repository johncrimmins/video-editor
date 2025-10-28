import React from 'react';
import TimelineCanvas from './components/TimelineCanvas';

console.log('⏰ TimelineScreen/index.jsx: TimelineScreen loading...');

const TimelineScreen = ({ videoFile, onBackToPreview }) => {
  console.log('⏰ TimelineScreen/index.jsx: TimelineScreen component rendering...');
  console.log('⏰ TimelineScreen/index.jsx: videoFile prop:', videoFile);
  console.log('⏰ TimelineScreen/index.jsx: onBackToPreview prop:', onBackToPreview);
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>
        Timeline Editor
      </h2>
      
      {videoFile ? (
        <div style={{ width: '100%', maxWidth: '800px' }}>
          <TimelineCanvas videoFile={videoFile} />
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          border: '2px dashed #ccc',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
          minWidth: '300px'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>
            No Video Selected
          </h3>
          <p style={{ color: '#666' }}>
            Please go back to the preview screen to select a video file.
          </p>
        </div>
      )}
      
      <button
        onClick={onBackToPreview}
        style={{
          marginTop: '20px',
          padding: '8px 16px',
          fontSize: '14px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Back to Preview
      </button>
    </div>
  );
};

console.log('⏰ TimelineScreen/index.jsx: TimelineScreen component defined, exporting...');
export default TimelineScreen;
