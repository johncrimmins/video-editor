import React, { useState } from 'react';
import { Button, Card, StatusMessage } from '../../../shared/ui';

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
    <Card variant="card" className="mt-xl">
      <h3 className="mb-md text-base text-text">
        Controls
      </h3>
      
      <div className="flex gap-md flex-wrap">
        <Button
          variant="primary"
          onClick={handleApplyTrim}
          disabled={isTrimming || !videoFile || !trimPoints}
        >
          {isTrimming ? 'Trimming...' : 'Apply Trim'}
        </Button>
        
        <Button
          variant="danger"
          onClick={handleDeleteClip}
          disabled={!videoFile}
        >
          Delete Clip
        </Button>
        
        <Button
          variant="secondary"
          onClick={onBackToPreview}
        >
          Back to Preview
        </Button>
      </div>
      
      <StatusMessage 
        success={trimStatus?.success}
        message={trimStatus?.message}
      />
    </Card>
  );
};

export default ControlPanel;

