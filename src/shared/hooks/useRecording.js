import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  getRecordingSources, 
  getScreenStream, 
  getWebcamStream, 
  getMicrophoneStream,
  createMediaRecorder,
  combineStreams,
  stopStream,
  generateRecordingFilename,
  downloadBlob,
  blobToVideoFile,
  formatRecordingDuration,
  formatFileSize,
  getNativeRecordingSources,
  startNativeRecording,
  stopNativeRecording
} from '../domains/recording';
import { getFileInfo } from '../domains/file';

/**
 * Shared hook for recording functionality
 * Handles screen recording, webcam recording, and audio capture
 * Can be used by any screen that needs recording capabilities
 */
const useRecording = (onRecordingComplete = null) => {
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingSize, setRecordingSize] = useState(0);
  
  // Available sources
  const [sources, setSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState(null);
  
  // Media streams and recorder
  const [currentStream, setCurrentStream] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [completedRecording, setCompletedRecording] = useState(null);
  
  // Native recording state
  const [recordingProcessId, setRecordingProcessId] = useState(null);
  
  // Refs for cleanup
  const durationIntervalRef = useRef(null);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  // Load available native recording sources
  const loadSources = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await getNativeRecordingSources();
      
      if (result.success) {
        setSources(result.sources);
        // Auto-select first screen if available
        const firstScreen = result.sources.find(source => source.name.includes('Screen'));
        if (firstScreen) {
          setSelectedSource(firstScreen);
        }
      } else {
        throw new Error(result.error || 'Failed to load recording sources');
      }
    } catch (err) {
      console.error('🎥 useRecording: Load sources error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Start duration tracking
  const startDurationTracking = useCallback(() => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
    }
    
    durationIntervalRef.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
  }, []);

  // Stop duration tracking
  const stopDurationTracking = useCallback(() => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
  }, []);

  // Start native recording
  const startRecording = useCallback(async (recordingType = 'screen') => {
    try {
      setIsLoading(true);
      setError(null);
      setRecordingDuration(0);
      setRecordingSize(0);
      
      if (!selectedSource) {
        throw new Error('No recording source selected');
      }
      
      // Generate output path for native recording
      const filename = generateRecordingFilename('recording', 'mp4');
      const outputPath = `/Users/${process.env.USER || 'user'}/Desktop/Clipforge Recordings/${filename}`;
      
      // Start native FFmpeg recording
      const result = await startNativeRecording(selectedSource.id, outputPath, {
        width: 1920,
        height: 1080,
        framerate: 30,
        bitrate: '2500k'
      });
      
      if (result.success) {
        setRecordingProcessId(result.processId);
        setIsRecording(true);
        
        // Start duration tracking
        startDurationTracking();
      } else {
        throw new Error(result.error || 'Failed to start recording');
      }
    } catch (error) {
      console.error('🎥 useRecording: Start recording error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSource, startDurationTracking]);

  // Stop native recording
  const stopRecording = useCallback(async () => {
    try {
      if (!recordingProcessId) {
        throw new Error('No active recording to stop');
      }
      
      const result = await stopNativeRecording(recordingProcessId);
      
      if (result.success) {
        // Get the output file path from the process ID
        const outputPath = recordingProcessId; // processId is the outputPath
        
        // Use existing getFileInfo to extract metadata
        const fileInfoResult = await getFileInfo(outputPath);
        
        if (fileInfoResult.success) {
          const videoFile = {
            path: outputPath,
            name: fileInfoResult.fileInfo.name,
            size: fileInfoResult.fileInfo.size,
            type: fileInfoResult.fileInfo.type,
            duration: fileInfoResult.fileInfo.duration, // From FFmpeg
            isRecorded: true
          };
          
          setCompletedRecording(videoFile);
          
          if (onRecordingComplete) {
            onRecordingComplete(videoFile);
          }
        }
        
        setRecordingProcessId(null);
        setIsRecording(false);
        stopDurationTracking();
      } else {
        throw new Error(result.error || 'Failed to stop recording');
      }
    } catch (error) {
      console.error('🎥 useRecording: Stop recording error:', error);
      setError(error.message);
    }
  }, [recordingProcessId, onRecordingComplete, stopDurationTracking]);

  // Cancel native recording
  const cancelRecording = useCallback(async () => {
    try {
      if (recordingProcessId) {
        // Stop the native recording process
        await stopNativeRecording(recordingProcessId);
        setRecordingProcessId(null);
      }
      
      // Clear duration timer
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
      
      // Reset state
      setIsRecording(false);
      setRecordingDuration(0);
      
    } catch (err) {
      console.error('🎥 useRecording: Cancel recording error:', err);
      setError(err.message);
    }
  }, [recordingProcessId]);

  // Handle completed recording
  useEffect(() => {
    if (completedRecording && onRecordingComplete) {
      onRecordingComplete(completedRecording);
      setCompletedRecording(null); // Clear after handling
    }
  }, [completedRecording, onRecordingComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear duration timer
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      
      // Stop native recording if active
      if (recordingProcessId) {
        stopNativeRecording(recordingProcessId).catch(console.error);
      }
    };
  }, [recordingProcessId]);

  // Format helpers
  const formattedDuration = formatRecordingDuration(recordingDuration);
  const formattedSize = formatFileSize(recordingSize);

  return {
    // State
    isRecording,
    isLoading,
    error,
    recordingDuration,
    recordingSize,
    sources,
    selectedSource,
    completedRecording,
    
    // Formatted values
    formattedDuration,
    formattedSize,
    
    // Actions
    loadSources,
    startRecording,
    stopRecording,
    cancelRecording,
    setSelectedSource,
    clearError: () => setError(null)
  };
};

export default useRecording;
