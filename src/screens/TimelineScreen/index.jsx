import React, { useState } from 'react';
import TimelineCanvas from './components/TimelineCanvas';
import VideoPreview from './components/VideoPreview';
import ControlPanel from './components/ControlPanel';
import useTimeline from './hooks/useTimeline';
import useTrim from './hooks/useTrim';

const TimelineScreen = ({ videoFile, onBackToPreview, onDeleteClip }) => {
  // Check for invalid video duration before proceeding
  if (!videoFile?.duration || videoFile.duration <= 0) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '20px', color: '#d63031' }}>
          ⚠️ Invalid Video Duration
        </h2>
        <div style={{
          padding: '20px',
          border: '2px solid #d63031',
          borderRadius: '8px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          maxWidth: '500px',
          marginBottom: '20px'
        }}>
          <p style={{ marginBottom: '10px' }}>
            <strong>Error:</strong> Could not extract video duration (got: {videoFile?.duration || 'undefined'} seconds)
          </p>
          <p style={{ marginBottom: '0' }}>
            This usually means the video file is corrupted or in an unsupported format.
          </p>
        </div>
        <button
          onClick={onBackToPreview}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Back to Preview
        </button>
      </div>
    );
  }
  
  const { trimPoints, updateTrimPoint } = useTimeline(videoFile);
  const { applyTrim } = useTrim(videoFile, trimPoints);
  const [currentVideoFile, setCurrentVideoFile] = useState(videoFile);
  
  const handleApplyTrim = async () => {
    try {
      const result = await applyTrim();
      
      // Update video file with trimmed version
      if (result.outputPath) {
        setCurrentVideoFile({
          ...currentVideoFile,
          path: result.outputPath,
          name: result.outputPath.split('/').pop()
        });
      }
    } catch (error) {
      console.error('⏰ TimelineScreen: Trim error:', error);
      throw error;
    }
  };
  
  const handleDeleteClip = () => {
    if (onDeleteClip) {
      onDeleteClip();
    }
  };
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'flex-start', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      overflow: 'auto'
    }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>
        Timeline Editor
      </h2>
      
      {currentVideoFile ? (
        <div style={{ width: '100%', maxWidth: '800px' }}>
          <TimelineCanvas videoFile={currentVideoFile} trimPoints={trimPoints} updateTrimPoint={updateTrimPoint} />
          <VideoPreview videoFile={currentVideoFile} trimPoints={trimPoints} />
          <ControlPanel 
            videoFile={currentVideoFile} 
            trimPoints={trimPoints}
            onApplyTrim={handleApplyTrim}
            onDeleteClip={handleDeleteClip}
            onBackToPreview={onBackToPreview}
          />
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
    </div>
  );
};

export default TimelineScreen;
