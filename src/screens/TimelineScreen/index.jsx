import React, { useState, useEffect } from 'react';
import { EditorScreen } from '../../shared/layouts';
import TimelineCanvas from './components/TimelineCanvas';
import VideoPreview from './components/VideoPreview';
import ControlPanel from './components/ControlPanel';
import EmptyEditorState from './components/EmptyEditorState';
import LoadingModal from './components/LoadingModal';
import useTimeline from './hooks/useTimeline';
import useTrim from './hooks/useTrim';
import { Button, ErrorMessage } from '../../shared/ui';
import { Card, CardContent } from '../../shared/ui/shadcn';
import { openFileDialog, getFileInfo } from '../../shared/domains/file';
import { validateVideoFile } from '../../shared/domains/file';

/**
 * TimelineScreen - Modern version using EditorScreen template and shadcn/ui components
 * Provides timeline editor functionality with video trimming
 * Shows empty state when no video is loaded
 */
const TimelineScreen = ({ videoFile, onBackToPreview, onDeleteClip, onVideoImported }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle import from empty state
  const handleImportClick = async () => {
    try {
      setIsLoading(true);
      
      // Open file dialog
      const dialogResult = await openFileDialog();
      
      if (dialogResult.canceled || !dialogResult.success) {
        setIsLoading(false);
        return;
      }
      
      const filePath = dialogResult.filePath;
      
      // Get file info first
      const fileInfoResult = await getFileInfo(filePath);
      
      if (!fileInfoResult.success) {
        setIsLoading(false);
        alert('Failed to read file information');
        return;
      }
      
      // Determine MIME type from extension
      const fileName = fileInfoResult.fileInfo.name.toLowerCase();
      let mimeType = 'video/mp4';
      if (fileName.endsWith('.mov')) {
        mimeType = 'video/quicktime';
      }
      
      // Validate file with proper object structure
      const validation = validateVideoFile({
        name: fileInfoResult.fileInfo.name,
        type: mimeType,
        size: fileInfoResult.fileInfo.size
      });
      
      if (!validation.isValid) {
        setIsLoading(false);
        alert(validation.error || 'Invalid video file');
        return;
      }
      
      // Get video duration
      const duration = await window.electronAPI.getVideoDuration(filePath);
      
      // Create video file object
      const videoFile = {
        path: filePath,
        name: fileInfoResult.fileInfo.name,
        size: fileInfoResult.fileInfo.size,
        type: mimeType,
        duration: duration
      };
      
      if (onVideoImported) {
        onVideoImported(videoFile);
      }
    } catch (error) {
      alert('Error importing video: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Show empty state if no video file
  if (!videoFile) {
    return (
      <EditorScreen>
        <EmptyEditorState onImportClick={handleImportClick} />
        {isLoading && <LoadingModal message="Loading video..." />}
      </EditorScreen>
    );
  }
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
  
  const { trimPoints, updateTrimPoint } = useTimeline(videoFile);
  const { applyTrim } = useTrim(videoFile, trimPoints);
  const [currentVideoFile, setCurrentVideoFile] = useState(videoFile);
  
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
      <div className="flex flex-col w-full h-full overflow-hidden">
        {currentVideoFile ? (
          <>
            {/* Video Preview Panel - Top */}
            <div className="flex-shrink-0 p-md bg-background">
              <VideoPreview videoFile={currentVideoFile} trimPoints={trimPoints} />
            </div>
            
            {/* Timeline Editor - Bottom */}
            <div className="flex-1 flex flex-col bg-background-secondary overflow-hidden">
              <TimelineCanvas 
                videoFile={currentVideoFile} 
                trimPoints={trimPoints} 
                updateTrimPoint={updateTrimPoint} 
              />
              
              {/* Control Panel */}
              <div className="flex-shrink-0 border-t border-border">
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

export default TimelineScreen;
