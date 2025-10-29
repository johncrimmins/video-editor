import React, { useState } from 'react';

const ControlPanel = ({ videoFile, trimPoints, onApplyTrim, onDeleteClip, onBackToPreview }) => {
  const [isTrimming, setIsTrimming] = useState(false);
  const [trimStatus, setTrimStatus] = useState(null);
  
  const handleApplyTrim = async () => {
    if (!videoFile || !trimPoints) {
      setTrimStatus({ success: false, message: 'Missing video file or trim points' });
      return;
    }
    
    setIsTrimming(true);
    setTrimStatus(null);
    
    try {
      if (onApplyTrim) {
        await onApplyTrim();
        setTrimStatus({ success: true, message: 'Video trimmed successfully!' });
      }
    } catch (error) {
      console.error('🎮 ControlPanel: Trim error:', error);
      setTrimStatus({ success: false, message: error.message || 'Failed to trim video' });
    } finally {
      setIsTrimming(false);
    }
  };
  
  const handleDeleteClip = () => {
    if (onDeleteClip) {
      onDeleteClip();
    }
  };
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginTop: '20px',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3 style={{ marginBottom: '10px', fontSize: '16px', color: '#333' }}>
        Controls
      </h3>
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={handleApplyTrim}
          disabled={isTrimming || !videoFile || !trimPoints}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            backgroundColor: isTrimming ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isTrimming ? 'not-allowed' : 'pointer',
            opacity: (!videoFile || !trimPoints) ? 0.5 : 1
          }}
        >
          {isTrimming ? 'Trimming...' : 'Apply Trim'}
        </button>
        
        <button
          onClick={handleDeleteClip}
          disabled={!videoFile}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: !videoFile ? 'not-allowed' : 'pointer',
            opacity: !videoFile ? 0.5 : 1
          }}
        >
          Delete Clip
        </button>
        
        <button
          onClick={onBackToPreview}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Preview
        </button>
      </div>
      
      {trimStatus && (
        <div style={{
          padding: '10px',
          backgroundColor: trimStatus.success ? '#d4edda' : '#f8d7da',
          color: trimStatus.success ? '#155724' : '#721c24',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          {trimStatus.message}
        </div>
      )}
    </div>
  );
};

export default ControlPanel;

