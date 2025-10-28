console.log('🔧 videoUtils.js: videoUtils loading...');

/**
 * Format video duration in MM:SS format
 * @param {number} duration - Duration in seconds
 * @returns {string} - Formatted duration string
 */
const formatDuration = (duration) => {
  console.log('🔧 videoUtils.js: formatDuration called with duration:', duration);
  
  if (!duration || isNaN(duration)) {
    console.log('🔧 videoUtils.js: Invalid duration, returning 00:00');
    return '00:00';
  }
  
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  console.log('🔧 videoUtils.js: Formatted duration:', formatted);
  return formatted;
};

/**
 * Format file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size string
 */
const formatFileSize = (bytes) => {
  console.log('🔧 videoUtils.js: formatFileSize called with bytes:', bytes);
  
  if (!bytes || isNaN(bytes)) {
    console.log('🔧 videoUtils.js: Invalid bytes, returning 0 B');
    return '0 B';
  }
  
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const formatted = `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  
  console.log('🔧 videoUtils.js: Formatted file size:', formatted);
  return formatted;
};

/**
 * Validate video file extension
 * @param {string} filename - The filename to validate
 * @returns {boolean} - True if valid video file
 */
const isValidVideoFile = (filename) => {
  console.log('🔧 videoUtils.js: isValidVideoFile called with filename:', filename);
  
  if (!filename) {
    console.log('🔧 videoUtils.js: No filename provided, invalid');
    return false;
  }
  
  const validExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  const isValid = validExtensions.includes(extension);
  
  console.log('🔧 videoUtils.js: File extension:', extension, 'Valid:', isValid);
  return isValid;
};

console.log('🔧 videoUtils.js: videoUtils defined, exporting...');
export {
  formatDuration,
  formatFileSize,
  isValidVideoFile
};
