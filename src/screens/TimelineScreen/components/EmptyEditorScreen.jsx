import React from 'react';
import { EditorScreen } from '../../../shared/layouts';
import EmptyEditorState from './EmptyEditorState';
import LoadingModal from './LoadingModal';
import { useFileImport } from '../../../shared/hooks';
import { ErrorMessage } from '../../../shared/ui';

/**
 * EmptyEditorScreen - Handles empty state and video import functionality
 * Only calls useFileImport hook - consistent every render
 */
const EmptyEditorScreen = ({ onVideoImported }) => {
  // Only these hooks - consistent every render
  const { 
    selectedFile, 
    isLoading, 
    error, 
    selectFile, 
    clearFile
  } = useFileImport(onVideoImported);
  
  const handleImportClick = async () => {
    const result = await selectFile();
    
    if (result.success && result.file && onVideoImported) {
      onVideoImported(result.file);
    } else if (result.error) {
      console.error('📁 EmptyEditorScreen: Import failed with error:', result.error);
      alert('Error importing video: ' + result.error);
    }
  };

  
  console.log('📁 EmptyEditorScreen: Rendering with state:', {
    selectedFile,
    isLoading,
    error,
    onVideoImported: typeof onVideoImported
  });

  return (
    <EditorScreen>
      <EmptyEditorState 
        onImportClick={handleImportClick}
      />
      {error && (
        <div className="fixed top-4 right-4 z-50">
          <ErrorMessage message={error} />
        </div>
      )}
      {isLoading && <LoadingModal message="Loading video..." />}
    </EditorScreen>
  );
};

export default EmptyEditorScreen;
