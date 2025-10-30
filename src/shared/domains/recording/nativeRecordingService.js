/**
 * Native recording service for Electron IPC communication
 * Handles native screen recording operations using FFmpeg through secure IPC channels
 */

/**
 * Gets available native recording sources using FFmpeg
 * @returns {Promise<Object>} - Promise resolving to sources result
 */
export const getNativeRecordingSources = async () => {
  try {
    if (!window.electronAPI || !window.electronAPI.getNativeRecordingSources) {
      throw new Error('Electron API not available. Make sure preload script is loaded.');
    }
    
    const result = await window.electronAPI.getNativeRecordingSources();
    return result;
  } catch (error) {
    console.error('🎥 nativeRecordingService.js: Get native recording sources error:', error);
    throw error;
  }
};

/**
 * Starts native screen recording using FFmpeg
 * @param {string} sourceId - ID of the screen/window to record
 * @param {string} filename - Filename for the recording (main process will handle full path)
 * @param {Object} options - Recording options
 * @param {number} options.width - Recording width (default: 1920)
 * @param {number} options.height - Recording height (default: 1080)
 * @param {number} options.framerate - Recording framerate (default: 30)
 * @param {string} options.bitrate - Recording bitrate (default: '2500k')
 * @returns {Promise<Object>} - Promise resolving to recording start result
 */
export const startNativeRecording = async (sourceId, filename, options = {}) => {
  try {
    if (!window.electronAPI || !window.electronAPI.startNativeRecording) {
      throw new Error('Electron API not available. Make sure preload script is loaded.');
    }
    
    const result = await window.electronAPI.startNativeRecording({
      sourceId,
      filename,
      options
    });
    return result;
  } catch (error) {
    console.error('🎥 nativeRecordingService.js: Start native recording error:', error);
    throw error;
  }
};

/**
 * Stops native screen recording
 * @param {string} processId - ID of the recording process to stop
 * @returns {Promise<Object>} - Promise resolving to recording stop result
 */
export const stopNativeRecording = async (processId) => {
  try {
    if (!window.electronAPI || !window.electronAPI.stopNativeRecording) {
      throw new Error('Electron API not available. Make sure preload script is loaded.');
    }
    
    const result = await window.electronAPI.stopNativeRecording({ processId });
    return result;
  } catch (error) {
    console.error('🎥 nativeRecordingService.js: Stop native recording error:', error);
    throw error;
  }
};
