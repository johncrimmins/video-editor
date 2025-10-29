import React from 'react';
import { Card, VideoElement } from '../../../shared/ui';

const VideoPreview = ({ videoFile, trimPoints }) => {
  if (!videoFile) {
    return null;
  }
  
  return (
    <Card variant="card" className="mt-xl p-md">
      <h3 className="mb-md text-base text-text">
        Video Preview
      </h3>
      <VideoElement 
        videoFile={videoFile}
        trimPoints={trimPoints}
        onError={(e) => {
          // Silently handle video errors
        }}
      />
      {trimPoints && (
        <div className="mt-md text-xs text-text-secondary">
          <div>In: {trimPoints.inTime?.toFixed(2)}s</div>
          <div>Out: {trimPoints.outTime?.toFixed(2)}s</div>
          <div>Duration: {(trimPoints.outTime - trimPoints.inTime)?.toFixed(2)}s</div>
        </div>
      )}
    </Card>
  );
};

export default VideoPreview;

