import React, { useState } from 'react';
import { Button, Container, StatusMessage } from '../../../shared/ui';
import { colors, spacing, fontSizes } from '../../../shared/ui/theme';

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
    <Container variant="card" style={{ marginTop: spacing.xl }}>
      <h3 style={{ marginBottom: spacing.md, fontSize: fontSizes.md, color: colors.dark }}>
        Controls
      </h3>
      
      <div style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
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
    </Container>
  );
};

export default ControlPanel;

