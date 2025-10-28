import React from 'react';
import useVideoPlayer from '../hooks/useVideoPlayer';

console.log('🎥 VideoPlayer.jsx: VideoPlayer component loading...');

const VideoPlayer = ({ videoFile, onBackToImport, onGoToTimeline }) => {
  console.log('🎥 VideoPlayer.jsx: VideoPlayer component rendering...');
  console.log('🎥 VideoPlayer.jsx: videoFile prop:', videoFile);
  console.log('🎥 VideoPlayer.jsx: onBackToImport prop:', onBackToImport);
  console.log('🎥 VideoPlayer.jsx: onGoToTimeline prop:', onGoToTimeline);
  
  const { videoUrl, isVideoReady } = useVideoPlayer(videoFile);
  console.log('🎥 VideoPlayer.jsx: Hook state - videoUrl:', videoUrl, 'isVideoReady:', isVideoReady);

  const handleBackToImport = () => {
    console.log('🎥 VideoPlayer.jsx: Back to import button clicked');
    if (onBackToImport) {
      console.log('🎥 VideoPlayer.jsx: Calling onBackToImport');
      onBackToImport();
    } else {
      console.error('🎥 VideoPlayer.jsx: onBackToImport not provided');
    }
  };

  const handleGoToTimeline = () => {
    console.log('🎥 VideoPlayer.jsx: Go to timeline button clicked');
    if (onGoToTimeline) {
      console.log('🎥 VideoPlayer.jsx: Calling onGoToTimeline');
      onGoToTimeline();
    } else {
      console.error('🎥 VideoPlayer.jsx: onGoToTimeline not provided');
    }
  };

  if (!videoFile) {
    console.log('🎥 VideoPlayer.jsx: No video file provided, showing message');
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        border: '2px dashed #ccc',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        minWidth: '300px'
      }}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>
          No Video Selected
        </h2>
        <p style={{ color: '#666' }}>
          Please go back to the import screen to select a video file.
        </p>
      </div>
    );
  }

  if (!isVideoReady) {
    console.log('🎥 VideoPlayer.jsx: Video not ready, showing loading message');
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        border: '2px dashed #ccc',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        minWidth: '300px'
      }}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>
          Loading Video...
        </h2>
        <p style={{ color: '#666' }}>
          Preparing video for playback
        </p>
      </div>
    );
  }

  console.log('🎥 VideoPlayer.jsx: Rendering video element with URL:', videoUrl);
  return (
    <div style={{
      textAlign: 'center',
      padding: '20px',
      border: '2px solid #007bff',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      minWidth: '400px'
    }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>
        Video Preview
      </h2>
      <video 
        src={videoUrl}
        controls
        style={{
          width: '100%',
          maxWidth: '600px',
          height: 'auto',
          borderRadius: '4px'
        }}
        onLoadStart={() => console.log('🎥 VideoPlayer.jsx: Video load started')}
        onLoadedData={() => console.log('🎥 VideoPlayer.jsx: Video data loaded')}
        onError={(e) => console.error('🎥 VideoPlayer.jsx: Video error:', e)}
      />
      <p style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
        <strong>File:</strong> {videoFile.name}
      </p>
      <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
        <button
          onClick={handleGoToTimeline}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Go to Timeline
        </button>
        <button
          onClick={handleBackToImport}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Import
        </button>
      </div>
    </div>
  );
};

console.log('🎥 VideoPlayer.jsx: VideoPlayer component defined, exporting...');
export default VideoPlayer;
