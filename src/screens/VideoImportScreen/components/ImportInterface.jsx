import React from 'react';
import { useFileImport } from '../../../shared/hooks';
import { Button, Card, ErrorMessage } from '../../../shared/ui';
import { formatFileSize } from '../../../shared/domains/file';

const ImportInterface = ({ onVideoSelected }) => {
  const { selectedFile, isLoading, error, selectFile, clearFile } = useFileImport();

  const handleFilePicker = () => {
    selectFile();
  };

  const handleContinueToPreview = () => {
    if (onVideoSelected && selectedFile) {
      onVideoSelected(selectedFile);
    } else {
      console.error('🔧 ImportInterface.jsx: onVideoSelected not provided or no file selected');
    }
  };
  return (
    <Card variant="dashed" className="min-w-75">
      <h2 className="mb-xl text-text">
        Import Video
      </h2>
      
      <ErrorMessage message={error} />
      
      {selectedFile ? (
        <div className="mb-xxl">
          <p className="text-success mb-md">
            ✅ File selected successfully!
          </p>
          <p className="text-text text-sm mb-lg">
            <strong>File:</strong> {selectedFile.name}<br/>
            <strong>Size:</strong> {formatFileSize(selectedFile.size)}
          </p>
          <div className="flex gap-md justify-center flex-wrap">
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
          <p className="mb-xxl text-text-secondary">
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
    </Card>
  );
};

export default ImportInterface;
