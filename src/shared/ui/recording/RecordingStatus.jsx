import React from 'react';
import { darkTheme } from '../darkTheme';

/**
 * RecordingStatus - Component for displaying recording status indicators
 * Shows recording state with consistent styling and animations
 */
const RecordingStatus = ({ 
  isRecording = false, 
  duration = '00:00',
  size = '0 Bytes',
  className = ''
}) => {
  if (!isRecording) {
    return null;
  }

  return (
    <div 
      className={`flex items-center space-x-sm ${className}`}
      style={{ color: darkTheme.textSecondary }}
    >
      <div 
        className="w-3 h-3 rounded-full animate-pulse"
        style={{ backgroundColor: darkTheme.error }}
      />
      <span className="text-sm">Recording</span>
    </div>
  );
};

/**
 * RecordingDuration - Component for displaying recording duration
 * Shows formatted duration with consistent styling
 */
export const RecordingDuration = ({ 
  duration = '00:00',
  className = ''
}) => {
  return (
    <div 
      className={`text-2xl font-mono ${className}`}
      style={{ color: darkTheme.error }}
    >
      {duration}
    </div>
  );
};

/**
 * RecordingIndicator - Small recording indicator for overlays
 * Shows "● REC" indicator for video previews
 */
export const RecordingIndicator = ({ 
  className = ''
}) => {
  return (
    <div 
      className={`absolute top-4 left-4 px-2 py-1 rounded text-sm font-medium ${className}`}
      style={{ 
        backgroundColor: darkTheme.error,
        color: darkTheme.text
      }}
    >
      ● REC
    </div>
  );
};

export default RecordingStatus;
