import { useState } from 'react';
import { openFileDialog, getFileInfo } from '../services/fileService';
import { validateVideoFile } from '../utils/fileValidation';

console.log('🎣 useFileImport.js: useFileImport hook loading...');

const useFileImport = () => {
  console.log('🎣 useFileImport.js: useFileImport hook initializing...');
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  console.log('🎣 useFileImport.js: Initial state - selectedFile:', selectedFile, 'isLoading:', isLoading, 'error:', error);

  const selectFile = async () => {
    console.log('🎣 useFileImport.js: selectFile function called');
    try {
      console.log('🎣 useFileImport.js: Setting loading state to true...');
      setIsLoading(true);
      setError(null);
      
      console.log('🎣 useFileImport.js: Opening file picker...');
      
      // Open file dialog
      console.log('🎣 useFileImport.js: Calling openFileDialog...');
      const dialogResult = await openFileDialog();
      console.log('🎣 useFileImport.js: Dialog result:', dialogResult);
      
      if (!dialogResult.success) {
        if (dialogResult.canceled) {
          console.log('🎣 useFileImport.js: File selection canceled');
          return;
        }
        console.error('🎣 useFileImport.js: Dialog failed:', dialogResult.message);
        throw new Error(dialogResult.message || 'Failed to open file dialog');
      }
      
      console.log('🎣 useFileImport.js: File selected:', dialogResult.filePath);
      
      // Get file information
      console.log('🎣 useFileImport.js: Getting file info...');
      const fileInfoResult = await getFileInfo(dialogResult.filePath);
      console.log('🎣 useFileImport.js: File info result:', fileInfoResult);
      
      if (!fileInfoResult.success) {
        console.error('🎣 useFileImport.js: Failed to get file info:', fileInfoResult.error);
        throw new Error(fileInfoResult.error || 'Failed to get file information');
      }
      
      const fileInfo = fileInfoResult.fileInfo;
      console.log('🎣 useFileImport.js: File info retrieved:', fileInfo);
      
      // Validate the file
      console.log('🎣 useFileImport.js: Validating file...');
      const validation = validateVideoFile(fileInfo);
      console.log('🎣 useFileImport.js: Validation result:', validation);
      
      if (!validation.isValid) {
        console.error('🎣 useFileImport.js: File validation failed:', validation.error);
        throw new Error(validation.error);
      }
      
      console.log('🎣 useFileImport.js: File validation passed');
      console.log('🎣 useFileImport.js: Setting selected file...');
      setSelectedFile(fileInfo);
      console.log('🎣 useFileImport.js: File selected successfully:', fileInfo);
      
    } catch (err) {
      console.error('🎣 useFileImport.js: File selection error:', err);
      setError(err.message);
      console.error('🎣 useFileImport.js: Error set in state:', err.message);
    } finally {
      console.log('🎣 useFileImport.js: Setting loading state to false...');
      setIsLoading(false);
    }
  };

  const clearFile = () => {
    console.log('🎣 useFileImport.js: clearFile called');
    setSelectedFile(null);
    setError(null);
    console.log('🎣 useFileImport.js: File cleared');
  };

  console.log('🎣 useFileImport.js: Returning hook values...');
  return {
    selectedFile,
    isLoading,
    error,
    selectFile,
    clearFile
  };
};

console.log('🎣 useFileImport.js: useFileImport hook defined, exporting...');
export default useFileImport;
