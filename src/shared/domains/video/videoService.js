/**
 * Video service for Electron IPC communication
 * Handles video processing operations through secure IPC channels
 */

/**
 * Trim video using FFmpeg via IPC
 * @param {Object} params - Trim parameters
 * @param {string} params.inputPath - Input video file path
 * @param {string} params.outputPath - Output video file path
 * @param {number} params.startTime - Start time in seconds
 * @param {number} params.duration - Duration in seconds
 * @returns {Promise<Object>} - Promise resolving to trim result
 */
export const trimVideo = async (params) => {
  try {
    if (!window.electronAPI || !window.electronAPI.trimVideo) {
      console.error('🎬 videoService.js: Electron API not available for trimVideo!');
      throw new Error('Electron API not available. Make sure preload script is loaded.');
    }
    
    const result = await window.electronAPI.trimVideo(params);
    
    return result;
  } catch (error) {
    console.error('🎬 videoService.js: Trim video error:', error);
    throw error;
  }
};

