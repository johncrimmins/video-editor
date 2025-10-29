import React from 'react';
import EmptyEditorScreen from './components/EmptyEditorScreen';
import TimelineEditorScreen from './components/TimelineEditorScreen';

/**
 * TimelineScreen - Simple router component that delegates to appropriate sub-components
 * No hooks - just conditional rendering based on videoFile prop
 */
const TimelineScreen = ({ videoFile, onBackToPreview, onDeleteClip, onVideoImported }) => {
  // Simple conditional rendering - no hooks, no early returns
  if (!videoFile) {
    return <EmptyEditorScreen onVideoImported={onVideoImported} />;
  }
  
  return (
    <TimelineEditorScreen 
      videoFile={videoFile}
      onBackToPreview={onBackToPreview}
      onDeleteClip={onDeleteClip}
    />
  );
};

export default TimelineScreen;
