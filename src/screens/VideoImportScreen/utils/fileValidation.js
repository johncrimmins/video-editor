/**
 * File validation utilities for video import
 * Validates MP4 and MOV file formats
 */

const SUPPORTED_EXTENSIONS = ['.mp4', '.mov'];
const SUPPORTED_MIME_TYPES = ['video/mp4', 'video/quicktime'];

/**
 * Validates if a file has a supported video extension
 * @param {string} filename - The name of the file to validate
 * @returns {boolean} - True if file has supported extension
 */
export const hasValidExtension = (filename) => {
  if (!filename || typeof filename !== 'string') {
    return false;
  }
  
  const lowerFilename = filename.toLowerCase();
  return SUPPORTED_EXTENSIONS.some(ext => lowerFilename.endsWith(ext));
};

/**
 * Validates if a file has a supported MIME type
 * @param {string} mimeType - The MIME type of the file to validate
 * @returns {boolean} - True if file has supported MIME type
 */
export const hasValidMimeType = (mimeType) => {
  if (!mimeType || typeof mimeType !== 'string') {
    return false;
  }
  
  return SUPPORTED_MIME_TYPES.includes(mimeType.toLowerCase());
};

/**
 * Validates a file object for video import
 * @param {Object} file - File object with name, type, size properties
 * @returns {Object} - Validation result with isValid boolean and error message
 */
export const validateVideoFile = (file) => {
  if (!file) {
    return {
      isValid: false,
      error: 'No file provided'
    };
  }

  if (!file.name) {
    return {
      isValid: false,
      error: 'File name is required'
    };
  }

  if (!file.type) {
    return {
      isValid: false,
      error: 'File type is required'
    };
  }

  // Check file extension
  if (!hasValidExtension(file.name)) {
    return {
      isValid: false,
      error: `Unsupported file format. Please select an MP4 or MOV file.`
    };
  }

  // Check MIME type
  if (!hasValidMimeType(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Please select an MP4 or MOV video file.`
    };
  }

  // Check file size (optional - basic validation)
  if (file.size && file.size === 0) {
    return {
      isValid: false,
      error: 'File is empty'
    };
  }

  return {
    isValid: true,
    error: null
  };
};

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
