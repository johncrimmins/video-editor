/**
 * File utility functions for file manipulation
 */


/**
 * Gets the file extension from a filename
 * @param {string} filename - The filename to extract extension from
 * @returns {string} - The file extension (lowercase)
 */
export const getFileExtension = (filename) => {
  if (!filename || typeof filename !== 'string') {
    return '';
  }
  
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return '';
  }
  
  return filename.substring(lastDotIndex).toLowerCase();
};

/**
 * Formats file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) {
    return '0 B';
  }
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validates video file extension
 * @param {string} filename - The filename to validate
 * @returns {boolean} - True if valid video file
 */
export const isValidVideoFile = (filename) => {
  if (!filename) {
    return false;
  }
  
  const validExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  const isValid = validExtensions.includes(extension);
  
  return isValid;
};

