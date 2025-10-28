console.log('⚙️ timelineService.js: timelineService loading...');

/**
 * Calculate timeline position from time
 * @param {number} time - Time in seconds
 * @param {number} duration - Total video duration in seconds
 * @param {number} timelineWidth - Width of timeline in pixels
 * @returns {number} - Position in pixels
 */
const timeToPosition = (time, duration, timelineWidth) => {
  console.log('⚙️ timelineService.js: timeToPosition called with time:', time, 'duration:', duration, 'timelineWidth:', timelineWidth);
  
  if (!duration || duration <= 0) {
    console.log('⚙️ timelineService.js: Invalid duration, returning 0');
    return 0;
  }
  
  const position = (time / duration) * timelineWidth;
  console.log('⚙️ timelineService.js: Calculated position:', position);
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
  console.log('⚙️ timelineService.js: positionToTime called with position:', position, 'duration:', duration, 'timelineWidth:', timelineWidth);
  
  if (!duration || duration <= 0 || !timelineWidth || timelineWidth <= 0) {
    console.log('⚙️ timelineService.js: Invalid parameters, returning 0');
    return 0;
  }
  
  const time = (position / timelineWidth) * duration;
  console.log('⚙️ timelineService.js: Calculated time:', time);
  return time;
};

/**
 * Validate trim points
 * @param {Object} trimPoints - Object with inTime and outTime
 * @param {number} duration - Total video duration in seconds
 * @returns {Object} - Validation result
 */
const validateTrimPoints = (trimPoints, duration) => {
  console.log('⚙️ timelineService.js: validateTrimPoints called with trimPoints:', trimPoints, 'duration:', duration);
  
  const { inTime, outTime } = trimPoints;
  
  if (inTime < 0) {
    console.log('⚙️ timelineService.js: inTime is negative, invalid');
    return { isValid: false, error: 'In time cannot be negative' };
  }
  
  if (outTime > duration) {
    console.log('⚙️ timelineService.js: outTime exceeds duration, invalid');
    return { isValid: false, error: 'Out time cannot exceed video duration' };
  }
  
  if (inTime >= outTime) {
    console.log('⚙️ timelineService.js: inTime >= outTime, invalid');
    return { isValid: false, error: 'In time must be less than out time' };
  }
  
  console.log('⚙️ timelineService.js: Trim points are valid');
  return { isValid: true };
};

console.log('⚙️ timelineService.js: timelineService defined, exporting...');
export {
  timeToPosition,
  positionToTime,
  validateTrimPoints
};
