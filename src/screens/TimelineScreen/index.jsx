import React from 'react';
import { EditorScreen } from '../../shared/layouts';
import EmptyEditorScreen from './components/EmptyEditorScreen';
import TimelineEditorScreen from './components/TimelineEditorScreen';
import TimelineImportInterface from './components/TimelineImportInterface';

/**
 * TimelineScreen - Simplified component that goes directly from import to editor
 * No internal state management - uses parent videoFile prop
 */
const TimelineScreen = ({ videoFile, onDeleteClip, onVideoImported }) => {
  console.log('🎬 TimelineScreen: Received videoFile:', videoFile);
  console.log('🎬 TimelineScreen: Video file details:', {
    exists: !!videoFile,
    name: videoFile?.name,
    size: videoFile?.size,
    type: videoFile?.type,
    duration: videoFile?.duration,
    hasPath: !!videoFile?.path,
    hasUrl: !!videoFile?.url,
    isRecorded: videoFile?.isRecorded
  });
  
  // If no video file, show new import interface (drag & drop + picker)
  if (!videoFile) {
    console.log('🎬 TimelineScreen: No video file, showing import interface');
    return (
      <EditorScreen>
        <TimelineImportInterface onVideoSelected={onVideoImported} />
      </EditorScreen>
    );
  }
  
  // If video file exists, show timeline editor
  console.log('🎬 TimelineScreen: Video file exists, showing timeline editor');
  return (
    <TimelineEditorScreen 
      videoFile={videoFile}
      onDeleteClip={onDeleteClip}
    />
  );
};

export default TimelineScreen;
