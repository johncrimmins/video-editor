/**
 * Format time in seconds to readable string
 * @param {number} seconds - Time in seconds
 * @returns {string} - Formatted time string
 */
const formatTime = (seconds) => {
  if (!seconds || seconds < 0) {
    return '0:00';
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formatted = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  
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
  if (!totalDuration || totalDuration <= 0 || !timelineWidth || timelineWidth <= 0) {
    return 0;
  }
  
  const width = (duration / totalDuration) * timelineWidth;
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
  const clamped = Math.min(Math.max(value, min), max);
  return clamped;
};

/**
 * Get default timeline dimensions
 * @returns {Object} - Object with width and height
 */
const getDefaultTimelineDimensions = () => {
  const dimensions = {
    width: 800,
    height: 100
  };
  
  return dimensions;
};

export {
  formatTime,
  calculateClipWidth,
  clamp,
  getDefaultTimelineDimensions
};
