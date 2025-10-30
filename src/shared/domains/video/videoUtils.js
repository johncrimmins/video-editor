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
 * Extract video duration from File object using HTML5 video element
 * @param {File} file - The dropped file
 * @returns {Promise<number>} - Promise resolving to duration in seconds
 */
export const extractDurationFromFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('video/')) {
      reject(new Error('Invalid video file'));
      return;
    }

    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    
    video.onloadedmetadata = () => {
      const duration = video.duration;
      URL.revokeObjectURL(video.src); // Cleanup
      resolve(duration);
    };
    
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Could not load video metadata'));
    };
    
    // Load the video to trigger metadata loading
    video.load();
  });
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

