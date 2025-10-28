import { useState } from 'react';

console.log('🎣 useTimeline.js: useTimeline hook loading...');

const useTimeline = (videoFile) => {
  console.log('🎣 useTimeline.js: useTimeline hook initializing...');
  console.log('🎣 useTimeline.js: videoFile:', videoFile);
  
  const [trimPoints, setTrimPoints] = useState({
    inTime: 0,
    outTime: videoFile?.duration || 0
  });
  
  const [isDragging, setIsDragging] = useState(false);
  
  console.log('🎣 useTimeline.js: Initial state - trimPoints:', trimPoints, 'isDragging:', isDragging);

  const updateTrimPoint = (type, value) => {
    console.log('🎣 useTimeline.js: updateTrimPoint called with type:', type, 'value:', value);
    
    setTrimPoints(prev => {
      const newPoints = { ...prev, [type]: value };
      console.log('🎣 useTimeline.js: Updated trim points:', newPoints);
      return newPoints;
    });
  };

  const startDragging = () => {
    console.log('🎣 useTimeline.js: startDragging called');
    setIsDragging(true);
  };

  const stopDragging = () => {
    console.log('🎣 useTimeline.js: stopDragging called');
    setIsDragging(false);
  };

  console.log('🎣 useTimeline.js: Returning hook values...');
  return {
    trimPoints,
    isDragging,
    updateTrimPoint,
    startDragging,
    stopDragging
  };
};

console.log('🎣 useTimeline.js: useTimeline hook defined, exporting...');
export default useTimeline;
