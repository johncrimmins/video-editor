import React from 'react';
import { useFileImport } from '../../../shared/hooks';
import { Button, Card, ErrorMessage } from '../../../shared/ui';

const ImportInterface = ({ onVideoSelected }) => {
  const { isLoading, error, selectFile } = useFileImport(onVideoSelected);

  const handleFilePicker = () => {
    selectFile();
  };

  // No need for continue handler - file selection automatically triggers callback
  
  return (
    <Card variant="dashed" className="min-w-75">
      <h2 className="mb-xl text-text">
        Import Video
      </h2>
      
      <ErrorMessage message={error} />
      
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
    </Card>
  );
};

export default ImportInterface;
