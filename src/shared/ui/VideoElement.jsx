import React, { useRef, useEffect, useMemo, useState } from 'react';
import { borderRadius } from './darkTheme';
import { convertToFileUrl } from '../domains/video';

/**
 * Shared VideoElement component wrapper for consistent video rendering
 * @param {Object} props
 * @param {Object} props.videoFile - Video file object with path property
 * @param {Object} props.trimPoints - Optional trim points to sync video currentTime
 * @param {Object} props.videoRef - Optional external ref for controlling video element
 * @param {Object} props.style - Additional inline styles for video element
 * @param {Function} props.onError - Error handler callback
 */
const VideoElement = ({ 
  videoFile, 
  trimPoints,
  videoRef: externalRef,
  style = {},
  onError,
  ...props
}) => {
  const internalRef = useRef(null);
  const videoRef = externalRef || internalRef;

  // Resolve video URL
  // - For dropped files, prefer a blob URL from the File object
  // - For picker/native files with real paths, use Electron app:// protocol
  const [objectUrl, setObjectUrl] = useState(null);

  useEffect(() => {
    if (videoFile?.file instanceof File) {
      const url = URL.createObjectURL(videoFile.file);
      setObjectUrl(url);
      return () => {
        URL.revokeObjectURL(url);
        setObjectUrl(null);
      };
    }
    // Cleanup when switching from object URL to file path
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoFile?.file]);

  const videoUrl = useMemo(() => {
    if (!videoFile) return null;
    if (objectUrl) return objectUrl;
    return convertToFileUrl(videoFile.path);
  }, [videoFile, objectUrl]);

  // Update video currentTime when trim points change
  useEffect(() => {
    if (videoRef.current && trimPoints && trimPoints.inTime !== undefined) {
      videoRef.current.currentTime = trimPoints.inTime;
    }
  }, [trimPoints?.inTime, videoRef]);

  const baseStyles = {
    width: '100%',
    maxWidth: '600px',
    height: 'auto',
    borderRadius: borderRadius.sm,
    ...style,
  };

  if (!videoFile || !videoUrl) {
    return null;
  }

  return (
    <video
      ref={videoRef}
      src={videoUrl}
      controls
      style={baseStyles}
      onError={onError}
      {...props}
    />
  );
};

export default VideoElement;
