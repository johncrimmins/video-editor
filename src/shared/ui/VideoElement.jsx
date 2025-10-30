import React, { useRef, useEffect } from 'react';
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

  // Get video URL
  const videoUrl = videoFile ? convertToFileUrl(videoFile.path) : null;

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
