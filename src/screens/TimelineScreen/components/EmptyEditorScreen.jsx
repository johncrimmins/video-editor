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
  console.log('📁 EmptyEditorScreen: Component rendering');
  
  // Only these hooks - consistent every render
  const { selectedFile, isLoading, error, selectFile, clearFile } = useFileImport();
  
  console.log('📁 EmptyEditorScreen: Hook states - selectedFile:', selectedFile, 'isLoading:', isLoading, 'error:', error);
  
  const handleImportClick = async () => {
    console.log('📁 EmptyEditorScreen: handleImportClick called');
    const result = await selectFile();
    
    if (result.success && result.file && onVideoImported) {
      console.log('📁 EmptyEditorScreen: Import successful, calling onVideoImported with file:', result.file);
      onVideoImported(result.file);
    } else if (result.error) {
      console.error('📁 EmptyEditorScreen: Import failed with error:', result.error);
      alert('Error importing video: ' + result.error);
    }
  };
  
  return (
    <EditorScreen>
      <EmptyEditorState onImportClick={handleImportClick} />
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
