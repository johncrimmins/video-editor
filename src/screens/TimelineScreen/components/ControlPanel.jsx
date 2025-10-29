import React, { useState } from 'react';
import { Button } from '../../../shared/ui/shadcn';

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
    <div className="px-md py-sm bg-background">
      <div className="flex items-center justify-between gap-md">
        {/* Left: Action buttons */}
        <div className="flex gap-sm">
          <Button
            variant="primary"
            size="sm"
            onClick={handleApplyTrim}
            disabled={isTrimming || !videoFile || !trimPoints}
          >
            {isTrimming ? 'Trimming...' : 'Apply Trim'}
          </Button>
          
          <Button
            variant="danger"
            size="sm"
            onClick={handleDeleteClip}
            disabled={!videoFile}
          >
            Delete Clip
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={onBackToPreview}
          >
            ← Back to Preview
          </Button>
        </div>
        
        {/* Right: Status message */}
        {trimStatus && (
          <div className={`text-sm ${trimStatus.success ? 'text-success' : 'text-error'}`}>
            {trimStatus.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;

