/**
 * Recording utilities for media stream handling and recording management
 */

/**
 * Creates a MediaRecorder instance for recording media streams
 * @param {MediaStream} stream - The media stream to record
 * @param {Object} options - Recording options
 * @param {string} options.mimeType - MIME type for recording (default: 'video/webm')
 * @param {number} options.videoBitsPerSecond - Video bitrate
 * @param {number} options.audioBitsPerSecond - Audio bitrate
 * @returns {MediaRecorder} - Configured MediaRecorder instance
 */
export const createMediaRecorder = (stream, options = {}) => {
  const {
    mimeType = 'video/webm;codecs=vp9',
    videoBitsPerSecond = 2500000, // 2.5 Mbps
    audioBitsPerSecond = 128000   // 128 kbps
  } = options;

  // Check if the MIME type is supported
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    console.warn('🎥 recordingUtils.js: MIME type not supported, falling back to default');
    return new MediaRecorder(stream);
  }

  return new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond,
    audioBitsPerSecond
  });
};

/**
 * Combines multiple media streams into a single stream
 * @param {MediaStream[]} streams - Array of media streams to combine
 * @returns {MediaStream} - Combined media stream
 */
export const combineStreams = (streams) => {
  const combinedStream = new MediaStream();
  
  streams.forEach(stream => {
    // Add all video tracks
    stream.getVideoTracks().forEach(track => {
      combinedStream.addTrack(track);
    });
    
    // Add all audio tracks
    stream.getAudioTracks().forEach(track => {
      combinedStream.addTrack(track);
    });
  });
  
  return combinedStream;
};

/**
 * Stops all tracks in a media stream
 * @param {MediaStream} stream - The media stream to stop
 */
export const stopStream = (stream) => {
  if (stream) {
    stream.getTracks().forEach(track => {
      track.stop();
    });
  }
};

/**
 * Generates a unique filename for recording
 * @param {string} prefix - Filename prefix
 * @param {string} extension - File extension (default: 'webm')
 * @returns {string} - Unique filename
 */
export const generateRecordingFilename = (prefix = 'recording', extension = 'webm') => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${prefix}-${timestamp}.${extension}`;
};

/**
 * Downloads a blob as a file
 * @param {Blob} blob - The blob to download
 * @param {string} filename - The filename for the download
 */
export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Converts a blob to a file object compatible with the existing video system
 * @param {Blob} blob - The recorded video blob
 * @param {string} filename - The filename for the video
 * @returns {Object} - File object compatible with existing video system
 */
export const blobToVideoFile = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  
  return {
    // Match the structure expected by the existing video system
    path: url, // Use URL as path for blob videos
    name: filename,
    size: blob.size,
    type: blob.type,
    duration: 0, // Will be updated when loaded in video element
    
    // Additional properties for recorded videos
    blob,
    url,
    isRecorded: true // Flag to identify recorded videos
  };
};

/**
 * Validates if screen recording is supported
 * @returns {boolean} - True if screen recording is supported
 */
export const isScreenRecordingSupported = () => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

/**
 * Gets the best supported MIME type for recording
 * @returns {string} - Best supported MIME type
 */
export const getBestSupportedMimeType = () => {
  const types = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
    'video/mp4;codecs=h264',
    'video/mp4'
  ];
  
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  
  return 'video/webm'; // Fallback
};

/**
 * Formats recording duration in MM:SS format
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration string
 */
export const formatRecordingDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Calculates recording file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Human-readable file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
