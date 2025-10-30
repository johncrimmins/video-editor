import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../shared/ui/shadcn';
import { Button } from '../../../shared/ui';
import { formatDuration } from '../../../shared/domains/video';
import { generateDefaultThumbnail } from '../../../shared/domains/video';

/**
 * ProjectFileCard - Displays a video file with thumbnail and metadata
 * Shows file information and provides action buttons
 */
const ProjectFileCard = ({ 
  file, 
  onOpenInEditor, 
  onDelete, 
  className = '' 
}) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(null);

  // Generate thumbnail when component mounts
  useEffect(() => {
    if (file?.path && !file?.isDropped) {
      generateThumbnail();
    } else if (file?.isDropped && file?.file) {
      generateThumbnailFromDroppedFile();
    }
  }, [file?.path, file?.isDropped, file?.file]);

  const generateThumbnail = async () => {
    if (!file?.path) {
      return;
    }

    try {
      setIsGeneratingThumbnail(true);
      setThumbnailError(null);

      // Create thumbnail path in temp directory
      const thumbnailPath = `${file.path.replace(/\.[^/.]+$/, '')}_thumb.jpg`;
      
      const result = await generateDefaultThumbnail(file.path, thumbnailPath);
      
      if (result.success) {
        // Convert to app:// protocol URL for display (Electron security)
        const thumbnailUrl = `app://${result.outputPath}`;
        setThumbnail(thumbnailUrl);
      } else {
        throw new Error('Failed to generate thumbnail');
      }
    } catch (error) {
      setThumbnailError('Failed to generate thumbnail');
    } finally {
      setIsGeneratingThumbnail(false);
    }
  };

  const generateThumbnailFromDroppedFile = async () => {
    if (!file?.file) {
      return;
    }

    try {
      setIsGeneratingThumbnail(true);
      setThumbnailError(null);

      // Create a video element to extract a frame
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file.file);
      
      // Wait for video to load and seek to 1 second
      await new Promise((resolve, reject) => {
        video.onloadedmetadata = () => {
          video.currentTime = 1; // Seek to 1 second
        };
        
        video.onseeked = () => {
          resolve();
        };
        
        video.onerror = () => {
          reject(new Error('Failed to load video'));
        };
        
        video.load();
      });

      // Create canvas to capture frame
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 320;
      canvas.height = 180;
      
      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to data URL
      const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      setThumbnail(thumbnailUrl);
      
      // Cleanup
      URL.revokeObjectURL(video.src);
      
    } catch (error) {
      setThumbnailError('Failed to generate thumbnail');
    } finally {
      setIsGeneratingThumbnail(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!file) {
    return null;
  }

  return (
    <Card 
      variant="card" 
      className={`group hover:shadow-lg transition-all duration-200 ${className}`}
    >
      <CardContent className="p-0">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-800 rounded-t-lg overflow-hidden">
          {isGeneratingThumbnail ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-text-secondary">Generating thumbnail...</p>
              </div>
            </div>
          ) : thumbnail ? (
            <img 
              src={thumbnail} 
              alt={`Thumbnail for ${file.name}`}
              className="w-full h-full object-cover"
            />
          ) : thumbnailError ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <span className="text-4xl opacity-50">🎬</span>
                <p className="text-sm text-error mt-2">Thumbnail failed</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <span className="text-4xl opacity-50">🎬</span>
                <p className="text-sm text-text-secondary mt-2">No thumbnail</p>
              </div>
            </div>
          )}
          
          {/* Duration overlay */}
          {file.duration && (
            <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
              {formatDuration(file.duration)}
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="p-4">
          <h3 className="font-semibold text-text mb-2 truncate" title={file.name}>
            {file.name}
          </h3>
          
          <div className="space-y-1 text-sm text-text-secondary mb-4">
            <div className="flex justify-between">
              <span>Size:</span>
              <span>{formatFileSize(file.size)}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span>{formatDuration(file.duration)}</span>
            </div>
            <div className="flex justify-between">
              <span>Added:</span>
              <span>{formatDate(file.created)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onOpenInEditor?.(file)}
              className="flex-1"
            >
              ✂️ Open in Editor
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onDelete?.(file)}
              className="px-3"
            >
              🗑️
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectFileCard;
