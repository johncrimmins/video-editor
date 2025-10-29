import React from 'react';
import EmptyEditorScreen from './components/EmptyEditorScreen';
import TimelineEditorScreen from './components/TimelineEditorScreen';

/**
 * TimelineScreen - Simple router component that delegates to appropriate sub-components
 * No hooks - just conditional rendering based on videoFile prop
 */
const TimelineScreen = ({ videoFile, onBackToPreview, onDeleteClip, onVideoImported }) => {
  console.log('🎬 TimelineScreen: Router component rendering with videoFile:', videoFile);
  
  // Simple conditional rendering - no hooks, no early returns
  if (!videoFile) {
    console.log('🎬 TimelineScreen: No video file, delegating to EmptyEditorScreen');
    return <EmptyEditorScreen onVideoImported={onVideoImported} />;
  }
  
  console.log('🎬 TimelineScreen: Video file exists, delegating to TimelineEditorScreen');
  return (
    <TimelineEditorScreen 
      videoFile={videoFile}
      onBackToPreview={onBackToPreview}
      onDeleteClip={onDeleteClip}
    />
  );
};

export default TimelineScreen;
