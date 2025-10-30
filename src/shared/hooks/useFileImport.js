import { useState, useCallback } from 'react';
import { openFileDialog, getFileInfo, validateVideoFile } from '../domains/file';
import { extractDurationFromFile } from '../domains/video';

/**
 * Shared hook for file import functionality
 * Handles file selection, validation, and video duration extraction
 * Can be used by any screen that needs to import video files
 */
const useFileImport = (onVideoImported = null) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectFile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Open file dialog
      const dialogResult = await openFileDialog();
      
      if (!dialogResult.success) {
        if (dialogResult.canceled) {
          return { success: false, canceled: true };
        }
        console.error('🎣 useFileImport: Dialog failed:', dialogResult.message);
        throw new Error(dialogResult.message || 'Failed to open file dialog');
      }
      
      // Get file information
      const fileInfoResult = await getFileInfo(dialogResult.filePath);
      
      if (!fileInfoResult.success) {
        console.error('🎣 useFileImport: Failed to get file info:', fileInfoResult.error);
        throw new Error(fileInfoResult.error || 'Failed to get file information');
      }
      
      const fileInfo = fileInfoResult.fileInfo;
      
      // Validate the file
      const validation = validateVideoFile(fileInfo);
      
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
      
      setSelectedFile(videoFile);
      
      // Automatically trigger callback if provided
      if (onVideoImported) {
        onVideoImported(videoFile);
      }
      
      return { success: true, file: videoFile };
      
    } catch (err) {
      console.error('🎣 useFileImport: File selection error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  // Drag and drop functionality removed for now

  // Drag and drop event handlers removed for now

  return {
    selectedFile,
    isLoading,
    error,
    selectFile,
    clearFile
  };
};

export default useFileImport;
