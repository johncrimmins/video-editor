import React from 'react';
import useFileImport from '../hooks/useFileImport';

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
    <div style={{
      textAlign: 'center',
      padding: '40px',
      border: '2px dashed #ccc',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      minWidth: '300px'
    }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>
        Import Video
      </h2>
      
      {error && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          borderRadius: '4px',
          border: '1px solid #f5c6cb'
        }}>
          Error: {error}
        </div>
      )}
      
      {selectedFile ? (
        <div style={{ marginBottom: '30px' }}>
          <p style={{ color: '#28a745', marginBottom: '10px' }}>
            ✅ File selected successfully!
          </p>
          <p style={{ color: '#333', fontSize: '14px', marginBottom: '15px' }}>
            <strong>File:</strong> {selectedFile.name}<br/>
            <strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
          <button
            onClick={clearFile}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Clear File
          </button>
          <button
            onClick={handleFilePicker}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Select Different File
          </button>
          <button
            onClick={handleContinueToPreview}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Continue to Preview
          </button>
        </div>
      ) : (
        <div>
          <p style={{ marginBottom: '30px', color: '#666' }}>
            Select an MP4 or MOV video file to get started
          </p>
          <button
            onClick={handleFilePicker}
            disabled={isLoading}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: isLoading ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = '#0056b3')}
            onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = '#007bff')}
          >
            {isLoading ? 'Loading...' : 'Select Video File'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImportInterface;
