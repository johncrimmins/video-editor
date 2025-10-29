import React from 'react';
import useFileImport from '../hooks/useFileImport';
import { Button, Container, ErrorMessage } from '../../../shared/ui';
import { colors, spacing, fontSizes } from '../../../shared/ui/theme';
import { formatFileSize } from '../../../shared/domains/file';

console.log('🔧 ImportInterface.jsx: ImportInterface component loading...');

const ImportInterface = ({ onVideoSelected }) => {
  console.log('🔧 ImportInterface.jsx: ImportInterface component rendering...');
  console.log('🔧 ImportInterface.jsx: onVideoSelected prop:', onVideoSelected);
  
  const { selectedFile, isLoading, error, selectFile, clearFile } = useFileImport();
  console.log('🔧 ImportInterface.jsx: Hook state - selectedFile:', selectedFile, 'isLoading:', isLoading, 'error:', error);

  const handleFilePicker = () => {
    console.log('🔧 ImportInterface.jsx: File picker button clicked');
    selectFile();
  };

  const handleContinueToPreview = () => {
    console.log('🔧 ImportInterface.jsx: Continue to preview button clicked');
    if (onVideoSelected && selectedFile) {
      console.log('🔧 ImportInterface.jsx: Calling onVideoSelected with file:', selectedFile);
      onVideoSelected(selectedFile);
    } else {
      console.error('🔧 ImportInterface.jsx: onVideoSelected not provided or no file selected');
    }
  };

  console.log('🔧 ImportInterface.jsx: Returning JSX...');
  return (
    <Container variant="dashed" style={{ minWidth: '300px' }}>
      <h2 style={{ marginBottom: spacing.xl, color: colors.dark }}>
        Import Video
      </h2>
      
      <ErrorMessage message={error} />
      
      {selectedFile ? (
        <div style={{ marginBottom: spacing.xxl }}>
          <p style={{ color: colors.success, marginBottom: spacing.md }}>
            ✅ File selected successfully!
          </p>
          <p style={{ color: colors.text, fontSize: fontSizes.sm, marginBottom: spacing.lg }}>
            <strong>File:</strong> {selectedFile.name}<br/>
            <strong>Size:</strong> {formatFileSize(selectedFile.size)}
          </p>
          <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="secondary" size="sm" onClick={clearFile}>
              Clear File
            </Button>
            <Button variant="primary" size="sm" onClick={handleFilePicker}>
              Select Different File
            </Button>
            <Button variant="success" size="sm" onClick={handleContinueToPreview}>
              Continue to Preview
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <p style={{ marginBottom: spacing.xxl, color: colors.textSecondary }}>
            Select an MP4 or MOV video file to get started
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={handleFilePicker}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Select Video File'}
          </Button>
        </div>
      )}
    </Container>
  );
};

export default ImportInterface;
