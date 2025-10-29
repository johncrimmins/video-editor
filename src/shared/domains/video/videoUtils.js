/**
 * Video utility functions for video processing
 */

console.log('🎬 videoUtils.js: Video utilities loading...');

/**
 * Format video duration in MM:SS format
 * @param {number} duration - Duration in seconds
 * @returns {string} - Formatted duration string
 */
export const formatDuration = (duration) => {
  console.log('🎬 videoUtils.js: formatDuration called with duration:', duration);
  
  if (!duration || isNaN(duration)) {
    console.log('🎬 videoUtils.js: Invalid duration, returning 00:00');
    return '00:00';
  }
  
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  console.log('🎬 videoUtils.js: Formatted duration:', formatted);
  return formatted;
};

/**
 * Convert file path to app:// URL for Electron custom protocol
 * @param {string} filePath - The file path to convert
 * @returns {string} - The app:// URL
 */
export const convertToFileUrl = (filePath) => {
  console.log('🎬 videoUtils.js: convertToFileUrl called with path:', filePath);
  
  if (!filePath) {
    console.error('🎬 videoUtils.js: No file path provided');
    return null;
  }
  
  const url = `app://${filePath}`;
  console.log('🎬 videoUtils.js: Converted to app URL:', url);
  return url;
};

/**
 * Extract video metadata from video element
 * @param {HTMLVideoElement} videoElement - The video element
 * @returns {Object} - Video metadata
 */
export const extractVideoMetadata = (videoElement) => {
  console.log('🎬 videoUtils.js: extractVideoMetadata called');
  
  if (!videoElement) {
    console.error('🎬 videoUtils.js: No video element provided');
    return null;
  }
  
  const metadata = {
    duration: videoElement.duration || 0,
    videoWidth: videoElement.videoWidth || 0,
    videoHeight: videoElement.videoHeight || 0,
    readyState: videoElement.readyState || 0
  };
  
  console.log('🎬 videoUtils.js: Extracted metadata:', metadata);
  return metadata;
};

/**
 * Check if video is ready to play
 * @param {HTMLVideoElement} videoElement - The video element
 * @returns {boolean} - True if video is ready
 */
export const isVideoReady = (videoElement) => {
  console.log('🎬 videoUtils.js: isVideoReady called');
  
  if (!videoElement) {
    console.log('🎬 videoUtils.js: No video element, not ready');
    return false;
  }
  
  const ready = videoElement.readyState >= 2; // HAVE_CURRENT_DATA
  console.log('🎬 videoUtils.js: Video ready state:', videoElement.readyState, 'Ready:', ready);
  return ready;
};

