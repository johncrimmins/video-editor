console.log('🔧 timelineUtils.js: timelineUtils loading...');

/**
 * Format time in seconds to readable string
 * @param {number} seconds - Time in seconds
 * @returns {string} - Formatted time string
 */
const formatTime = (seconds) => {
  console.log('🔧 timelineUtils.js: formatTime called with seconds:', seconds);
  
  if (!seconds || seconds < 0) {
    console.log('🔧 timelineUtils.js: Invalid seconds, returning 0:00');
    return '0:00';
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formatted = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  
  console.log('🔧 timelineUtils.js: Formatted time:', formatted);
  return formatted;
};

/**
 * Calculate clip width based on duration and timeline width
 * @param {number} duration - Clip duration in seconds
 * @param {number} totalDuration - Total video duration in seconds
 * @param {number} timelineWidth - Timeline width in pixels
 * @returns {number} - Clip width in pixels
 */
const calculateClipWidth = (duration, totalDuration, timelineWidth) => {
  console.log('🔧 timelineUtils.js: calculateClipWidth called with duration:', duration, 'totalDuration:', totalDuration, 'timelineWidth:', timelineWidth);
  
  if (!totalDuration || totalDuration <= 0 || !timelineWidth || timelineWidth <= 0) {
    console.log('🔧 timelineUtils.js: Invalid parameters, returning 0');
    return 0;
  }
  
  const width = (duration / totalDuration) * timelineWidth;
  console.log('🔧 timelineUtils.js: Calculated clip width:', width);
  return width;
};

/**
 * Clamp value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Clamped value
 */
const clamp = (value, min, max) => {
  console.log('🔧 timelineUtils.js: clamp called with value:', value, 'min:', min, 'max:', max);
  
  const clamped = Math.min(Math.max(value, min), max);
  console.log('🔧 timelineUtils.js: Clamped value:', clamped);
  return clamped;
};

/**
 * Get default timeline dimensions
 * @returns {Object} - Object with width and height
 */
const getDefaultTimelineDimensions = () => {
  console.log('🔧 timelineUtils.js: getDefaultTimelineDimensions called');
  
  const dimensions = {
    width: 800,
    height: 100
  };
  
  console.log('🔧 timelineUtils.js: Default dimensions:', dimensions);
  return dimensions;
};

console.log('🔧 timelineUtils.js: timelineUtils defined, exporting...');
export {
  formatTime,
  calculateClipWidth,
  clamp,
  getDefaultTimelineDimensions
};
