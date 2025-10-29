/**
 * File service for Electron IPC communication
 * Handles file operations through secure IPC channels
 */

/**
 * Opens a file dialog to select video files
 * @returns {Promise<Object>} - Promise resolving to file selection result
 */
export const openFileDialog = async () => {
  try {
    if (!window.electronAPI || !window.electronAPI.showOpenDialog) {
      throw new Error('Electron API not available. Make sure preload script is loaded.');
    }
    
    const result = await window.electronAPI.showOpenDialog({
      title: 'Select Video File',
      filters: [
        { name: 'Video Files', extensions: ['mp4', 'mov'] },
        { name: 'MP4 Files', extensions: ['mp4'] },
        { name: 'MOV Files', extensions: ['mov'] },
        { name: 'All Files', extensions: ['*'] }
      ],
      properties: ['openFile']
    });
    
    if (result.canceled) {
      return {
        success: false,
        canceled: true,
        message: 'File selection canceled'
      };
    }
    
    if (!result.filePaths || result.filePaths.length === 0) {
      return {
        success: false,
        canceled: false,
        message: 'No file selected'
      };
    }
    
    const filePath = result.filePaths[0];
    
    return {
      success: true,
      canceled: false,
      filePath: filePath,
      message: 'File selected successfully'
    };
    
  } catch (error) {
    return {
      success: false,
      canceled: false,
      error: error.message,
      message: 'Failed to open file dialog'
    };
  }
};

/**
 * Gets file information from a file path
 * @param {string} filePath - Path to the file
 * @returns {Promise<Object>} - Promise resolving to file information
 */
export const getFileInfo = async (filePath) => {
  try {
    if (!window.electronAPI || !window.electronAPI.getFileInfo) {
      throw new Error('Electron API not available. Make sure preload script is loaded.');
    }
    
    const fileInfo = await window.electronAPI.getFileInfo(filePath);
    
    return {
      success: true,
      fileInfo: fileInfo
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Validates if a file path exists and is accessible
 * @param {string} filePath - Path to the file
 * @returns {Promise<Object>} - Promise resolving to validation result
 */
export const validateFilePath = async (filePath) => {
  try {
    if (!window.electronAPI || !window.electronAPI.validateFilePath) {
      throw new Error('Electron API not available. Make sure preload script is loaded.');
    }
    
    const result = await window.electronAPI.validateFilePath(filePath);
    
    return {
      success: true,
      exists: result.exists,
      accessible: result.accessible
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

