/**
 * Thumbnail service for generating video thumbnails
 * Handles thumbnail generation using FFmpeg via IPC
 */

/**
 * Generates a thumbnail from a video file
 * @param {Object} params - Thumbnail parameters
 * @param {string} params.inputPath - Input video file path
 * @param {string} params.outputPath - Output thumbnail file path
 * @param {number} params.timeOffset - Time offset in seconds (default: 1)
 * @param {number} params.width - Thumbnail width (default: 320)
 * @param {number} params.height - Thumbnail height (default: 180)
 * @returns {Promise<Object>} - Promise resolving to thumbnail generation result
 */
export const generateThumbnail = async (params) => {
  try {
    if (!window.electronAPI || !window.electronAPI.generateThumbnail) {
      throw new Error('Electron API not available. Make sure preload script is loaded.');
    }
    
    const result = await window.electronAPI.generateThumbnail(params);
    
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Generates a thumbnail with default settings
 * @param {string} inputPath - Input video file path
 * @param {string} outputPath - Output thumbnail file path
 * @returns {Promise<Object>} - Promise resolving to thumbnail generation result
 */
export const generateDefaultThumbnail = async (inputPath, outputPath) => {
  return generateThumbnail({
    inputPath,
    outputPath,
    timeOffset: 1,
    width: 320,
    height: 180
  });
};

/**
 * Generates multiple thumbnails at different time offsets
 * @param {string} inputPath - Input video file path
 * @param {string} outputDir - Output directory for thumbnails
 * @param {number} count - Number of thumbnails to generate (default: 3)
 * @param {number} duration - Video duration in seconds
 * @returns {Promise<Array>} - Promise resolving to array of thumbnail paths
 */
export const generateMultipleThumbnails = async (inputPath, outputDir, count = 3, duration = 0) => {
  try {
    const thumbnails = [];
    const timeOffsets = [];
    
    // Calculate time offsets evenly distributed across the video
    if (duration > 0) {
      for (let i = 1; i <= count; i++) {
        timeOffsets.push((duration / (count + 1)) * i);
      }
    } else {
      // Fallback to fixed intervals
      for (let i = 1; i <= count; i++) {
        timeOffsets.push(i);
      }
    }
    
    // Generate thumbnails
    for (let i = 0; i < count; i++) {
      const outputPath = `${outputDir}/thumb_${i + 1}.jpg`;
      const result = await generateThumbnail({
        inputPath,
        outputPath,
        timeOffset: timeOffsets[i],
        width: 320,
        height: 180
      });
      
      if (result.success) {
        thumbnails.push({
          path: result.outputPath,
          timeOffset: timeOffsets[i],
          index: i + 1
        });
      }
    }
    
    return thumbnails;
  } catch (error) {
    throw error;
  }
};
