/**
 * File service for Electron IPC communication
 * Handles file operations through secure IPC channels
 */

console.log('📁 fileService.js: File service loading...');

/**
 * Opens a file dialog to select video files
 * @returns {Promise<Object>} - Promise resolving to file selection result
 */
export const openFileDialog = async () => {
  console.log('📁 fileService.js: openFileDialog function called');
  try {
    console.log('📁 fileService.js: Opening file dialog...');
    
    // Check if electronAPI is available
    console.log('📁 fileService.js: Checking electronAPI availability...');
    console.log('📁 fileService.js: window.electronAPI:', window.electronAPI);
    console.log('📁 fileService.js: window.electronAPI.showOpenDialog:', window.electronAPI?.showOpenDialog);
    
    if (!window.electronAPI || !window.electronAPI.showOpenDialog) {
      console.error('📁 fileService.js: Electron API not available!');
      throw new Error('Electron API not available. Make sure preload script is loaded.');
    }
    
    console.log('📁 fileService.js: Electron API available, calling showOpenDialog...');
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
    
    console.log('📁 fileService.js: File dialog result:', result);
    
    if (result.canceled) {
      console.log('📁 fileService.js: Dialog was canceled');
      return {
        success: false,
        canceled: true,
        message: 'File selection canceled'
      };
    }
    
    if (!result.filePaths || result.filePaths.length === 0) {
      console.log('📁 fileService.js: No file paths in result');
      return {
        success: false,
        canceled: false,
        message: 'No file selected'
      };
    }
    
    const filePath = result.filePaths[0];
    console.log('📁 fileService.js: Selected file path:', filePath);
    
    console.log('📁 fileService.js: Returning success result');
    return {
      success: true,
      canceled: false,
      filePath: filePath,
      message: 'File selected successfully'
    };
    
  } catch (error) {
    console.error('📁 fileService.js: File dialog error:', error);
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
  console.log('📁 fileService.js: getFileInfo function called with:', filePath);
  try {
    console.log('📁 fileService.js: Getting file info for:', filePath);
    
    if (!window.electronAPI || !window.electronAPI.getFileInfo) {
      console.error('📁 fileService.js: Electron API not available for getFileInfo!');
      throw new Error('Electron API not available. Make sure preload script is loaded.');
    }
    
    console.log('📁 fileService.js: Calling electronAPI.getFileInfo...');
    const fileInfo = await window.electronAPI.getFileInfo(filePath);
    console.log('📁 fileService.js: File info received:', fileInfo);
    
    console.log('📁 fileService.js: Returning file info success result');
    return {
      success: true,
      fileInfo: fileInfo
    };
    
  } catch (error) {
    console.error('📁 fileService.js: Get file info error:', error);
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
  console.log('📁 fileService.js: validateFilePath function called with:', filePath);
  try {
    console.log('📁 fileService.js: Validating file path:', filePath);
    
    if (!window.electronAPI || !window.electronAPI.validateFilePath) {
      console.error('📁 fileService.js: Electron API not available for validateFilePath!');
      throw new Error('Electron API not available. Make sure preload script is loaded.');
    }
    
    console.log('📁 fileService.js: Calling electronAPI.validateFilePath...');
    const result = await window.electronAPI.validateFilePath(filePath);
    console.log('📁 fileService.js: File path validation result:', result);
    
    return {
      success: true,
      exists: result.exists,
      accessible: result.accessible
    };
    
  } catch (error) {
    console.error('📁 fileService.js: File path validation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
