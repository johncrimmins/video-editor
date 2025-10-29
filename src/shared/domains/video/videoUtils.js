/**
 * Video utility functions for video processing
 */


/**
 * Format video duration in MM:SS format
 * @param {number} duration - Duration in seconds
 * @returns {string} - Formatted duration string
 */
export const formatDuration = (duration) => {
  if (!duration || isNaN(duration)) {
    return '00:00';
  }
  
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  return formatted;
};

/**
 * Convert file path to app:// URL for Electron custom protocol
 * @param {string} filePath - The file path to convert
 * @returns {string} - The app:// URL
 */
export const convertToFileUrl = (filePath) => {
  if (!filePath) {
    console.error('🎬 videoUtils.js: No file path provided');
    return null;
  }
  
  const url = `app://${filePath}`;
  return url;
};

/**
 * Extract video metadata from video element
 * @param {HTMLVideoElement} videoElement - The video element
 * @returns {Object} - Video metadata
 */
export const extractVideoMetadata = (videoElement) => {
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
  
  return metadata;
};

/**
 * Check if video is ready to play
 * @param {HTMLVideoElement} videoElement - The video element
 * @returns {boolean} - True if video is ready
 */
export const isVideoReady = (videoElement) => {
  if (!videoElement) {
    return false;
  }
  
  const ready = videoElement.readyState >= 2; // HAVE_CURRENT_DATA
  return ready;
};

