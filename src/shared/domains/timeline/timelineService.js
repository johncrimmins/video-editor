/**
 * Timeline service for timeline calculations and trim operations
 */

/**
 * Calculate timeline position from time
 * @param {number} time - Time in seconds
 * @param {number} duration - Total video duration in seconds
 * @param {number} timelineWidth - Width of timeline in pixels
 * @returns {number} - Position in pixels
 */
export const timeToPosition = (time, duration, timelineWidth) => {
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
export const positionToTime = (position, duration, timelineWidth) => {
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
export const validateTrimPoints = (trimPoints, duration) => {
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

/**
 * Calculate duration from trim points
 * @param {Object} trimPoints - Object with inTime and outTime
 * @returns {number} - Duration in seconds
 */
export const calculateDuration = (trimPoints) => {
  if (!trimPoints || trimPoints.inTime === undefined || trimPoints.outTime === undefined) {
    return 0;
  }
  
  const duration = trimPoints.outTime - trimPoints.inTime;
  return duration;
};

/**
 * Generate output filename for trimmed video
 * @param {string} inputPath - Input video file path
 * @param {number} inTime - In time in seconds
 * @param {number} outTime - Out time in seconds
 * @returns {string} - Output file path
 */
export const generateOutputPath = (inputPath, inTime, outTime) => {
  if (!inputPath) {
    return null;
  }
  
  // Get file extension
  const ext = inputPath.split('.').pop();
  const basePath = inputPath.substring(0, inputPath.lastIndexOf('.'));
  
  // Generate output path with trim times
  const outputPath = `${basePath}_trimmed_${inTime.toFixed(2)}s_to_${outTime.toFixed(2)}s.${ext}`;
  return outputPath;
};

/**
 * Generate FFmpeg command for trimming video
 * @param {string} inputPath - Input video file path
 * @param {string} outputPath - Output video file path
 * @param {number} startTime - Start time in seconds
 * @param {number} duration - Duration in seconds
 * @returns {string} - FFmpeg command string
 */
export const generateTrimCommand = (inputPath, outputPath, startTime, duration) => {
  // FFmpeg command: -ss for start time, -t for duration, -i for input, output path
  const command = `-ss ${startTime} -i "${inputPath}" -t ${duration} -c copy "${outputPath}"`;
  return command;
};

