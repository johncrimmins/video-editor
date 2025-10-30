import React from 'react';
import { TimelineProvider } from '../../../contexts/TimelineContext';
import TimelineEditorContent from './TimelineEditorContent';
import TimelineErrorBoundary from './TimelineErrorBoundary';

/**
 * TimelineEditorScreen - Refactored with composition pattern
 * Uses TimelineProvider for state management and composition for better separation of concerns
 */
const TimelineEditorScreen = ({ videoFile, onDeleteClip }) => {
  // Check for invalid video duration before proceeding
  if (!videoFile?.duration || videoFile.duration <= 0) {
    return <TimelineErrorBoundary videoFile={videoFile} onDeleteClip={onDeleteClip} />;
  }
  
  return (
    <TimelineProvider videoFile={videoFile}>
      <TimelineEditorContent onDeleteClip={onDeleteClip} />
    </TimelineProvider>
  );
};

export default TimelineEditorScreen;