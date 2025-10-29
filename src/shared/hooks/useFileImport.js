import { useState } from 'react';
import { openFileDialog, getFileInfo, validateVideoFile } from '../domains/file';

/**
 * Shared hook for file import functionality
 * Handles file selection, validation, and video duration extraction
 * Can be used by any screen that needs to import video files
 */
const useFileImport = () => {
  console.log('🎣 useFileImport: Hook initializing...');
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  console.log('🎣 useFileImport: Initial state - selectedFile:', selectedFile, 'isLoading:', isLoading, 'error:', error);

  const selectFile = async () => {
    console.log('🎣 useFileImport: selectFile called');
    try {
      console.log('🎣 useFileImport: Setting loading state to true...');
      setIsLoading(true);
      setError(null);
      
      // Open file dialog
      console.log('🎣 useFileImport: Opening file dialog...');
      const dialogResult = await openFileDialog();
      console.log('🎣 useFileImport: Dialog result:', dialogResult);
      
      if (!dialogResult.success) {
        if (dialogResult.canceled) {
          console.log('🎣 useFileImport: File selection canceled');
          return { success: false, canceled: true };
        }
        console.error('🎣 useFileImport: Dialog failed:', dialogResult.message);
        throw new Error(dialogResult.message || 'Failed to open file dialog');
      }
      
      // Get file information
      console.log('🎣 useFileImport: Getting file info for:', dialogResult.filePath);
      const fileInfoResult = await getFileInfo(dialogResult.filePath);
      console.log('🎣 useFileImport: File info result:', fileInfoResult);
      
      if (!fileInfoResult.success) {
        console.error('🎣 useFileImport: Failed to get file info:', fileInfoResult.error);
        throw new Error(fileInfoResult.error || 'Failed to get file information');
      }
      
      const fileInfo = fileInfoResult.fileInfo;
      console.log('🎣 useFileImport: File info retrieved:', fileInfo);
      
      // Validate the file
      console.log('🎣 useFileImport: Validating file...');
      const validation = validateVideoFile(fileInfo);
      console.log('🎣 useFileImport: Validation result:', validation);
      
      if (!validation.isValid) {
        console.error('🎣 useFileImport: File validation failed:', validation.error);
        throw new Error(validation.error);
      }
      
      // Duration is already included in fileInfo from getFileInfo
      // Create complete video file object
      const videoFile = {
        path: dialogResult.filePath,
        name: fileInfo.name,
        size: fileInfo.size,
        type: fileInfo.type,
        duration: fileInfo.duration || 0
      };
      
      console.log('🎣 useFileImport: Created video file object:', videoFile);
      setSelectedFile(videoFile);
      console.log('🎣 useFileImport: File selected successfully');
      return { success: true, file: videoFile };
      
    } catch (err) {
      console.error('🎣 useFileImport: File selection error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      console.log('🎣 useFileImport: Setting loading state to false...');
      setIsLoading(false);
    }
  };

  const clearFile = () => {
    console.log('🎣 useFileImport: clearFile called');
    setSelectedFile(null);
    setError(null);
    console.log('🎣 useFileImport: File cleared');
  };

  console.log('🎣 useFileImport: Returning hook values...');
  return {
    selectedFile,
    isLoading,
    error,
    selectFile,
    clearFile
  };
};

export default useFileImport;
