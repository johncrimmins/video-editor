/**
 * Recording utilities for native recording management
 * 
 * Note: Web-based recording utilities have been removed as we're fully native.
 * This file now only contains utilities needed for native FFmpeg recording.
 */

/**
 * Generates a unique filename for recording
 * @param {string} prefix - Filename prefix
 * @param {string} extension - File extension (default: 'mp4')
 * @returns {string} - Unique filename
 */
export const generateRecordingFilename = (prefix = 'recording', extension = 'mp4') => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${prefix}-${timestamp}.${extension}`;
};


/**
 * Formats recording duration in MM:SS format
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration string
 */
export const formatRecordingDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Calculates recording file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Human-readable file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
