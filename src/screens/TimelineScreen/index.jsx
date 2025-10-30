import React from 'react';
import { EditorScreen } from '../../shared/layouts';
import EmptyEditorScreen from './components/EmptyEditorScreen';
import TimelineEditorScreen from './components/TimelineEditorScreen';
import ImportInterface from './components/ImportInterface';

/**
 * TimelineScreen - Simplified component that goes directly from import to editor
 * No internal state management - uses parent videoFile prop
 */
const TimelineScreen = ({ videoFile, onDeleteClip, onVideoImported }) => {
  // If no video file, show import interface
  if (!videoFile) {
    return (
      <EditorScreen>
        <ImportInterface onVideoSelected={onVideoImported} />
      </EditorScreen>
    );
  }
  
  // If video file exists, show timeline editor
  return (
    <TimelineEditorScreen 
      videoFile={videoFile}
      onDeleteClip={onDeleteClip}
    />
  );
};

export default TimelineScreen;
