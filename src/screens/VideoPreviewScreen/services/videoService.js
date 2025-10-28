console.log('🎬 videoService.js: videoService loading...');

/**
 * Convert file path to app:// URL for Electron custom protocol
 * @param {string} filePath - The file path to convert
 * @returns {string} - The app:// URL
 */
const convertToFileUrl = (filePath) => {
  console.log('🎬 videoService.js: convertToFileUrl called with path:', filePath);
  
  if (!filePath) {
    console.error('🎬 videoService.js: No file path provided');
    return null;
  }
  
  const url = `app://${filePath}`;
  console.log('🎬 videoService.js: Converted to app URL:', url);
  return url;
};

/**
 * Extract video metadata from video element
 * @param {HTMLVideoElement} videoElement - The video element
 * @returns {Object} - Video metadata
 */
const extractVideoMetadata = (videoElement) => {
  console.log('🎬 videoService.js: extractVideoMetadata called');
  
  if (!videoElement) {
    console.error('🎬 videoService.js: No video element provided');
    return null;
  }
  
  const metadata = {
    duration: videoElement.duration || 0,
    videoWidth: videoElement.videoWidth || 0,
    videoHeight: videoElement.videoHeight || 0,
    readyState: videoElement.readyState || 0
  };
  
  console.log('🎬 videoService.js: Extracted metadata:', metadata);
  return metadata;
};

/**
 * Check if video is ready to play
 * @param {HTMLVideoElement} videoElement - The video element
 * @returns {boolean} - True if video is ready
 */
const isVideoReady = (videoElement) => {
  console.log('🎬 videoService.js: isVideoReady called');
  
  if (!videoElement) {
    console.log('🎬 videoService.js: No video element, not ready');
    return false;
  }
  
  const ready = videoElement.readyState >= 2; // HAVE_CURRENT_DATA
  console.log('🎬 videoService.js: Video ready state:', videoElement.readyState, 'Ready:', ready);
  return ready;
};

console.log('🎬 videoService.js: videoService defined, exporting...');
export {
  convertToFileUrl,
  extractVideoMetadata,
  isVideoReady
};
