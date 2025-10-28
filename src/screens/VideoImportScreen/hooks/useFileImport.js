import { useState } from 'react';
import { openFileDialog, getFileInfo } from '../services/fileService';
import { validateVideoFile } from '../utils/fileValidation';

const useFileImport = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectFile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Opening file picker...');
      
      // Open file dialog
      const dialogResult = await openFileDialog();
      
      if (!dialogResult.success) {
        if (dialogResult.canceled) {
          console.log('File selection canceled');
          return;
        }
        throw new Error(dialogResult.message || 'Failed to open file dialog');
      }
      
      console.log('File selected:', dialogResult.filePath);
      
      // Get file information
      const fileInfoResult = await getFileInfo(dialogResult.filePath);
      
      if (!fileInfoResult.success) {
        throw new Error(fileInfoResult.error || 'Failed to get file information');
      }
      
      const fileInfo = fileInfoResult.fileInfo;
      console.log('File info retrieved:', fileInfo);
      
      // Validate the file
      const validation = validateVideoFile(fileInfo);
      
      if (!validation.isValid) {
        throw new Error(validation.error);
      }
      
      console.log('File validation passed');
      setSelectedFile(fileInfo);
      console.log('File selected successfully:', fileInfo);
      
    } catch (err) {
      setError(err.message);
      console.error('File selection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
    console.log('File cleared');
  };

  return {
    selectedFile,
    isLoading,
    error,
    selectFile,
    clearFile
  };
};

export default useFileImport;
