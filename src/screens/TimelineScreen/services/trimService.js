/**
 * Generate FFmpeg command for trimming video
 * @param {string} inputPath - Input video file path
 * @param {string} outputPath - Output video file path
 * @param {number} startTime - Start time in seconds
 * @param {number} duration - Duration in seconds
 * @returns {string} - FFmpeg command string
 */
const generateTrimCommand = (inputPath, outputPath, startTime, duration) => {
  // FFmpeg command: -ss for start time, -t for duration, -i for input, output path
  const command = `-ss ${startTime} -i "${inputPath}" -t ${duration} -c copy "${outputPath}"`;
  return command;
};

/**
 * Calculate duration from trim points
 * @param {Object} trimPoints - Object with inTime and outTime
 * @returns {number} - Duration in seconds
 */
const calculateDuration = (trimPoints) => {
  if (!trimPoints || trimPoints.inTime === undefined || trimPoints.outTime === undefined) {
    return 0;
  }
  
  const duration = trimPoints.outTime - trimPoints.inTime;
  return duration;
};

/**
 * Generate output filename
 * @param {string} inputPath - Input video file path
 * @param {number} inTime - In time in seconds
 * @param {number} outTime - Out time in seconds
 * @returns {string} - Output file path
 */
const generateOutputPath = (inputPath, inTime, outTime) => {
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

export {
  generateTrimCommand,
  calculateDuration,
  generateOutputPath
};

