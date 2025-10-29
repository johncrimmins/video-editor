/**
 * File validation utilities for video import
 * Validates MP4 and MOV file formats
 */

console.log('✅ fileValidation.js: File validation utilities loading...');

const SUPPORTED_EXTENSIONS = ['.mp4', '.mov'];
const SUPPORTED_MIME_TYPES = ['video/mp4', 'video/quicktime'];

/**
 * Validates if a file has a supported video extension
 * @param {string} filename - The name of the file to validate
 * @returns {boolean} - True if file has supported extension
 */
export const hasValidExtension = (filename) => {
  console.log('✅ fileValidation.js: hasValidExtension called with:', filename);
  if (!filename || typeof filename !== 'string') {
    console.log('✅ fileValidation.js: Invalid filename provided');
    return false;
  }
  
  const lowerFilename = filename.toLowerCase();
  const isValid = SUPPORTED_EXTENSIONS.some(ext => lowerFilename.endsWith(ext));
  console.log('✅ fileValidation.js: Extension validation result:', isValid);
  return isValid;
};

/**
 * Validates if a file has a supported MIME type
 * @param {string} mimeType - The MIME type of the file to validate
 * @returns {boolean} - True if file has supported MIME type
 */
export const hasValidMimeType = (mimeType) => {
  console.log('✅ fileValidation.js: hasValidMimeType called with:', mimeType);
  if (!mimeType || typeof mimeType !== 'string') {
    console.log('✅ fileValidation.js: Invalid MIME type provided');
    return false;
  }
  
  const isValid = SUPPORTED_MIME_TYPES.includes(mimeType.toLowerCase());
  console.log('✅ fileValidation.js: MIME type validation result:', isValid);
  return isValid;
};

/**
 * Validates a file object for video import
 * @param {Object} file - File object with name, type, size properties
 * @returns {Object} - Validation result with isValid boolean and error message
 */
export const validateVideoFile = (file) => {
  console.log('✅ fileValidation.js: validateVideoFile called with:', file);
  
  if (!file) {
    console.log('✅ fileValidation.js: No file provided');
    return {
      isValid: false,
      error: 'No file provided'
    };
  }

  if (!file.name) {
    console.log('✅ fileValidation.js: File name is required');
    return {
      isValid: false,
      error: 'File name is required'
    };
  }

  if (!file.type) {
    console.log('✅ fileValidation.js: File type is required');
    return {
      isValid: false,
      error: 'File type is required'
    };
  }

  // Check file extension
  console.log('✅ fileValidation.js: Checking file extension...');
  if (!hasValidExtension(file.name)) {
    console.log('✅ fileValidation.js: Invalid file extension');
    return {
      isValid: false,
      error: `Unsupported file format. Please select an MP4 or MOV file.`
    };
  }

  // Check MIME type
  console.log('✅ fileValidation.js: Checking MIME type...');
  if (!hasValidMimeType(file.type)) {
    console.log('✅ fileValidation.js: Invalid MIME type');
    return {
      isValid: false,
      error: `Invalid file type. Please select an MP4 or MOV video file.`
    };
  }

  // Check file size (optional - basic validation)
  if (file.size && file.size === 0) {
    console.log('✅ fileValidation.js: File is empty');
    return {
      isValid: false,
      error: 'File is empty'
    };
  }

  console.log('✅ fileValidation.js: File validation passed');
  return {
    isValid: true,
    error: null
  };
};

