import React, { useRef, useEffect } from 'react';
import { convertToFileUrl } from '../../../shared/domains/video';

const VideoPreview = ({ videoFile, trimPoints }) => {
  const videoRef = useRef(null);
  
  // Get video URL using existing service
  const videoUrl = videoFile ? convertToFileUrl(videoFile.path) : null;
  
  // Update video currentTime when trim points change
  useEffect(() => {
    if (videoRef.current && trimPoints && trimPoints.inTime !== undefined) {
      videoRef.current.currentTime = trimPoints.inTime;
    }
  }, [trimPoints?.inTime]);
  
  if (!videoFile) {
    return null;
  }
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '10px',
      backgroundColor: '#f9f9f9',
      marginTop: '20px'
    }}>
      <h3 style={{ marginBottom: '10px', fontSize: '16px', color: '#333' }}>
        Video Preview
      </h3>
      <video 
        ref={videoRef}
        src={videoUrl}
        controls
        style={{
          width: '100%',
          maxWidth: '600px',
          height: 'auto',
          borderRadius: '4px'
        }}
        onError={(e) => {
          // Silently handle video errors
        }}
      />
      {trimPoints && (
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
          <div>In: {trimPoints.inTime?.toFixed(2)}s</div>
          <div>Out: {trimPoints.outTime?.toFixed(2)}s</div>
          <div>Duration: {(trimPoints.outTime - trimPoints.inTime)?.toFixed(2)}s</div>
        </div>
      )}
    </div>
  );
};

export default VideoPreview;

