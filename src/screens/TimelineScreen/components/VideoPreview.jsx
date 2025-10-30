import React from 'react';
import { VideoElement } from '../../../shared/ui';

const VideoPreview = ({ videoFile, trimPoints }) => {
  if (!videoFile) {
    return null;
  }
  
  return (
    <div className="w-full h-full flex justify-center items-center">
      {/* Video player with purple border like screenshot */}
      <div className="relative w-full h-full max-w-4xl flex items-center justify-center">
        <div className="border-4 border-primary rounded-lg overflow-hidden bg-black max-h-full">
          <VideoElement 
            videoFile={videoFile}
            trimPoints={trimPoints}
            onError={(e) => {
              // Silently handle video errors
            }}
          />
        </div>
        
        {/* Trim info overlay */}
        {trimPoints && (
          <div className="absolute bottom-2 right-2 bg-black/70 px-3 py-1 rounded text-xs text-text-secondary">
            <span>In: {trimPoints.inTime?.toFixed(2)}s</span>
            <span className="mx-2">|</span>
            <span>Out: {trimPoints.outTime?.toFixed(2)}s</span>
            <span className="mx-2">|</span>
            <span>Duration: {(trimPoints.outTime - trimPoints.inTime)?.toFixed(2)}s</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPreview;

