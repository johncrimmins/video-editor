/**
 * Recording service for Electron IPC communication
 * Handles screen recording operations through secure IPC channels
 */

/**
 * Gets available recording sources (screens and windows)
 * @param {Object} options - Options for source retrieval
 * @param {string[]} options.types - Types of sources to get ['screen', 'window']
 * @param {Object} options.thumbnailSize - Thumbnail size {width, height}
 * @returns {Promise<Object>} - Promise resolving to sources result
 */
export const getRecordingSources = async (options = {}) => {
  try {
    if (!window.electronAPI || !window.electronAPI.getRecordingSources) {
      throw new Error('Electron API not available. Make sure preload script is loaded.');
    }
    
    const result = await window.electronAPI.getRecordingSources(options);
    return result;
  } catch (error) {
    console.error('🎥 recordingService.js: Get recording sources error:', error);
    throw error;
  }
};

/**
 * Checks media access permissions for recording
 * @param {string} mediaType - Type of media to check ('screen', 'camera', 'microphone')
 * @returns {Promise<Object>} - Promise resolving to permission status
 */
export const checkMediaPermissions = async (mediaType) => {
  try {
    if (!window.electronAPI || !window.electronAPI.checkMediaPermissions) {
      throw new Error('Electron API not available. Make sure preload script is loaded.');
    }
    
    const result = await window.electronAPI.checkMediaPermissions(mediaType);
    return result;
  } catch (error) {
    console.error('🎥 recordingService.js: Check media permissions error:', error);
    throw error;
  }
};

/**
 * Requests screen recording permission and gets media stream
 * @param {string} sourceId - ID of the screen/window to record
 * @param {Object} constraints - Media constraints for recording
 * @returns {Promise<MediaStream>} - Promise resolving to media stream
 */
export const getScreenStream = async (sourceId, constraints = {}) => {
  try {
    // Check screen recording permission first
    const permissionResult = await checkMediaPermissions('screen');
    
    if (!permissionResult.success || !permissionResult.granted) {
      throw new Error('Screen recording permission not granted');
    }

    // Request screen capture with the specified source
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false, // We'll add audio separately if needed
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sourceId,
          minWidth: 1280,
          maxWidth: 1920,
          minHeight: 720,
          maxHeight: 1080
        }
      },
      ...constraints
    });

    return stream;
  } catch (error) {
    console.error('🎥 recordingService.js: Get screen stream error:', error);
    throw error;
  }
};

/**
 * Requests webcam stream
 * @param {Object} constraints - Media constraints for webcam
 * @returns {Promise<MediaStream>} - Promise resolving to webcam stream
 */
export const getWebcamStream = async (constraints = {}) => {
  try {
    // Check camera permission first
    const permissionResult = await checkMediaPermissions('camera');
    
    if (!permissionResult.success || !permissionResult.granted) {
      throw new Error('Camera permission not granted');
    }

    // Request webcam stream
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 }
      },
      audio: false, // We'll add audio separately if needed
      ...constraints
    });

    return stream;
  } catch (error) {
    console.error('🎥 recordingService.js: Get webcam stream error:', error);
    throw error;
  }
};

/**
 * Requests microphone stream
 * @param {Object} constraints - Media constraints for microphone
 * @returns {Promise<MediaStream>} - Promise resolving to microphone stream
 */
export const getMicrophoneStream = async (constraints = {}) => {
  try {
    // Check microphone permission first
    const permissionResult = await checkMediaPermissions('microphone');
    
    if (!permissionResult.success || !permissionResult.granted) {
      throw new Error('Microphone permission not granted');
    }

    // Request microphone stream
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      },
      ...constraints
    });

    return stream;
  } catch (error) {
    console.error('🎥 recordingService.js: Get microphone stream error:', error);
    throw error;
  }
};
