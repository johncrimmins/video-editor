import React from 'react';
import { EditorScreen } from '../../../shared/layouts';
import TimelineCanvas from './TimelineCanvas';
import VideoPreview from './VideoPreview';
import ControlPanel from './ControlPanel';
import { useTimelineContext } from '../../../contexts/TimelineContext';

/**
 * Timeline editor content component
 * Uses TimelineContext to access timeline state and actions
 * Eliminates prop drilling by consuming context directly
 */
const TimelineEditorContent = ({ onDeleteClip }) => {
  const { videoFile, trimPoints, updateTrimPoint, handleApplyTrim } = useTimelineContext();
  
  return (
    <EditorScreen>
      <div className="grid grid-rows-[1fr_auto] w-full h-full overflow-hidden">
        {videoFile ? (
          <>
            {/* Video Preview Panel - Top - Takes available space */}
            <div className="min-h-0 p-md bg-background overflow-hidden">
              <VideoPreview videoFile={videoFile} trimPoints={trimPoints} />
            </div>
            
            {/* Timeline Editor - Bottom - Natural height */}
            <div className="grid grid-rows-[auto_auto_auto] bg-background-secondary">
              <TimelineCanvas 
                videoFile={videoFile} 
                trimPoints={trimPoints} 
                updateTrimPoint={updateTrimPoint} 
              />
              
              {/* Control Panel */}
              <div className="border-t border-border">
                <ControlPanel 
                  videoFile={videoFile} 
                  trimPoints={trimPoints}
                  onApplyTrim={handleApplyTrim}
                  onDeleteClip={onDeleteClip}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center h-full">
            <p className="text-text-secondary">No video loaded</p>
          </div>
        )}
      </div>
    </EditorScreen>
  );
};

export default TimelineEditorContent;

