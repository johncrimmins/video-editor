import React, { useState } from 'react';
import { EditorScreen } from '../../../shared/layouts';
import TimelineCanvas from './TimelineCanvas';
import VideoPreview from './VideoPreview';
import ControlPanel from './ControlPanel';
import useTimeline from '../hooks/useTimeline';
import useTrim from '../hooks/useTrim';
import { Button, ErrorMessage } from '../../../shared/ui';
import { Card, CardContent } from '../../../shared/ui/shadcn';

/**
 * TimelineEditorScreen - Handles timeline editor functionality with video trimming
 * Only calls timeline-related hooks - consistent every render
 */
const TimelineEditorScreen = ({ videoFile, onBackToPreview, onDeleteClip }) => {
  // Only these hooks - consistent every render
  const { trimPoints, updateTrimPoint } = useTimeline(videoFile);
  const { applyTrim } = useTrim(videoFile, trimPoints);
  const [currentVideoFile, setCurrentVideoFile] = useState(videoFile);
  
  // Check for invalid video duration before proceeding
  if (!videoFile?.duration || videoFile.duration <= 0) {
    return (
      <EditorScreen>
        <div className="flex flex-col justify-center items-center h-full p-xl text-center">
          <h2 className="mb-xl text-error text-2xl">
            ⚠️ Invalid Video Duration
          </h2>
          <Card variant="card" className="max-w-lg mb-xl border-error">
            <CardContent className="p-0">
              <ErrorMessage 
                message={`Could not extract video duration (got: ${videoFile?.duration || 'undefined'} seconds). This usually means the video file is corrupted or in an unsupported format.`}
                className="mb-0"
              />
            </CardContent>
          </Card>
          <Button variant="primary" size="lg" onClick={onBackToPreview}>
            ← Back to Preview
          </Button>
        </div>
      </EditorScreen>
    );
  }
  
  
  const handleApplyTrim = async () => {
    try {
      const result = await applyTrim();
      
      // Update video file with trimmed version
      if (result.outputPath) {
        setCurrentVideoFile({
          ...currentVideoFile,
          path: result.outputPath,
          name: result.outputPath.split('/').pop()
        });
      }
    } catch (error) {
      console.error('🎬 TimelineEditorScreen: ApplyTrim error:', error);
      throw error;
    }
  };
  
  const handleDeleteClip = () => {
    if (onDeleteClip) {
      onDeleteClip();
    }
  };
  
  return (
    <EditorScreen>
      <div className="grid grid-rows-[1fr_auto] w-full h-full overflow-hidden">
        {currentVideoFile ? (
          <>
            {/* Video Preview Panel - Top - Takes available space */}
            <div className="min-h-0 p-md bg-background overflow-hidden">
              <VideoPreview videoFile={currentVideoFile} trimPoints={trimPoints} />
            </div>
            
            {/* Timeline Editor - Bottom - Natural height */}
            <div className="grid grid-rows-[auto_auto_auto] bg-background-secondary">
              <TimelineCanvas 
                videoFile={currentVideoFile} 
                trimPoints={trimPoints} 
                updateTrimPoint={updateTrimPoint} 
              />
              
              {/* Control Panel */}
              <div className="border-t border-border">
                <ControlPanel 
                  videoFile={currentVideoFile} 
                  trimPoints={trimPoints}
                  onApplyTrim={handleApplyTrim}
                  onDeleteClip={handleDeleteClip}
                  onBackToPreview={onBackToPreview}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center h-full">
            <Card variant="dashed" className="min-w-[300px]">
              <CardContent>
                <h3 className="mb-xl text-text text-xl">
                  No Video Selected
                </h3>
                <p className="text-text-secondary">
                  Please go back to the preview screen to select a video file.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </EditorScreen>
  );
};

export default TimelineEditorScreen;
