import { useState } from 'react';

const useTimeline = (videoFile) => {
  // Fail fast - throw error if duration is invalid
  if (!videoFile?.duration || videoFile.duration <= 0) {
    const error = new Error(`Invalid video duration: ${videoFile?.duration}. Video must have a valid duration greater than 0.`);
    console.error('🎣 useTimeline: Invalid video duration:', error.message);
    throw error;
  }
  
  const initialOutTime = videoFile.duration;
  
  const [trimPoints, setTrimPoints] = useState({
    inTime: 0,
    outTime: initialOutTime
  });
  
  const [isDragging, setIsDragging] = useState(false);

  const updateTrimPoint = (type, value) => {
    setTrimPoints(prev => {
      const newPoints = { ...prev, [type]: value };
      return newPoints;
    });
  };

  const startDragging = () => {
    setIsDragging(true);
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  return {
    trimPoints,
    isDragging,
    updateTrimPoint,
    startDragging,
    stopDragging
  };
};

export default useTimeline;
