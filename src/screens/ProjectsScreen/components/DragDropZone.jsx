import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '../../../shared/ui/shadcn';
import { Button } from '../../../shared/ui';
import { useFileImport } from '../../../shared/hooks';
import { extractDurationFromFile } from '../../../shared/domains/video';

/**
 * DragDropZone - Handles file drag and drop for video import
 * Provides visual feedback during drag operations and file validation
 */
const DragDropZone = ({ onFilesImported, className = '' }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const { selectFile, isLoading, error } = useFileImport();

  // Extract duration from dropped file using HTML5 video element
  const extractDurationFromDroppedFile = async (file) => {
    try {
      const duration = await extractDurationFromFile(file);
      return duration;
    } catch (error) {
      return 0; // Default duration if extraction fails
    }
  };

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set drag over to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const videoFiles = files.filter(file => 
      file.type.startsWith('video/') && 
      (file.name.toLowerCase().endsWith('.mp4') || file.name.toLowerCase().endsWith('.mov'))
    );

    if (videoFiles.length === 0) {
      return;
    }

    // Process each video file directly from the dropped files
    const processedFiles = [];
    for (const file of videoFiles) {
      try {
        // Extract duration from the dropped file using HTML5 video element
        const duration = await extractDurationFromDroppedFile(file);
        
        // Create a file object that matches our expected format
        const processedFile = {
          name: file.name,
          size: file.size,
          type: file.type,
          duration: duration,
          // For dropped files, we'll use a temporary path
          // In a real implementation, you might want to save the file temporarily
          path: `dropped_${Date.now()}_${file.name}`,
          isDropped: true,
          file: file // Keep reference to original File object
        };
        
        processedFiles.push(processedFile);
      } catch (error) {
        // Silently handle errors for dropped files
      }
    }

    if (processedFiles.length > 0 && onFilesImported) {
      onFilesImported(processedFiles);
    }
  }, [onFilesImported]);

  const handleFilePicker = useCallback(async () => {
    const result = await selectFile();
    if (result.success && result.file && onFilesImported) {
      onFilesImported([result.file]);
    }
  }, [selectFile, onFilesImported]);

  return (
    <Card 
      variant="dashed" 
      className={`transition-all duration-200 ${
        isDragOver 
          ? 'border-primary bg-primary/5 scale-105' 
          : 'border-dashed border-2 border-gray-300 hover:border-primary/50'
      } ${className}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          <span className="text-6xl inline-block opacity-50">
            {isDragOver ? '📥' : '📁'}
          </span>
        </div>
        
        <h2 className="text-2xl font-semibold text-text mb-4">
          {isDragOver ? 'Drop your videos here' : 'Import Video Files'}
        </h2>
        
        <p className="text-text-secondary mb-6 leading-relaxed">
          Drag and drop MP4 or MOV files here, or click the button below to select files
        </p>
        
        <Button
          variant="primary"
          size="lg"
          onClick={handleFilePicker}
          disabled={isLoading}
          className="mb-4"
        >
          {isLoading ? 'Processing...' : 'Select Video Files'}
        </Button>
        
        {error && (
          <div className="text-error text-sm mt-4">
            {error}
          </div>
        )}
        
        <p className="text-xs text-text-secondary mt-4">
          Supported formats: MP4, MOV
        </p>
      </CardContent>
    </Card>
  );
};

export default DragDropZone;
