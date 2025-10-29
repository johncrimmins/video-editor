/**
 * Calculate timeline position from time
 * @param {number} time - Time in seconds
 * @param {number} duration - Total video duration in seconds
 * @param {number} timelineWidth - Width of timeline in pixels
 * @returns {number} - Position in pixels
 */
const timeToPosition = (time, duration, timelineWidth) => {
  if (!duration || duration <= 0) {
    return 0;
  }
  
  const position = (time / duration) * timelineWidth;
  return position;
};

/**
 * Calculate time from timeline position
 * @param {number} position - Position in pixels
 * @param {number} duration - Total video duration in seconds
 * @param {number} timelineWidth - Width of timeline in pixels
 * @returns {number} - Time in seconds
 */
const positionToTime = (position, duration, timelineWidth) => {
  if (!duration || duration <= 0 || !timelineWidth || timelineWidth <= 0) {
    return 0;
  }
  
  const time = (position / timelineWidth) * duration;
  return time;
};

/**
 * Validate trim points
 * @param {Object} trimPoints - Object with inTime and outTime
 * @param {number} duration - Total video duration in seconds
 * @returns {Object} - Validation result
 */
const validateTrimPoints = (trimPoints, duration) => {
  const { inTime, outTime } = trimPoints;
  
  if (inTime < 0) {
    return { isValid: false, error: 'In time cannot be negative' };
  }
  
  if (outTime > duration) {
    return { isValid: false, error: 'Out time cannot exceed video duration' };
  }
  
  if (inTime >= outTime) {
    return { isValid: false, error: 'In time must be less than out time' };
  }
  
  return { isValid: true };
};

export {
  timeToPosition,
  positionToTime,
  validateTrimPoints
};
