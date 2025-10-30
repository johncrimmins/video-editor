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
  formatFileSize
} from '../domains/recording';
import { extractDurationFromFile } from '../domains/video';

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
  
  // Refs for cleanup
  const durationIntervalRef = useRef(null);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  // Load available recording sources
  const loadSources = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await getRecordingSources({
        types: ['screen', 'window'],
        thumbnailSize: { width: 150, height: 150 }
      });
      
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

  // Start recording
  const startRecording = useCallback(async (recordingType = 'screen') => {
    try {
      setIsLoading(true);
      setError(null);
      setRecordedChunks([]);
      chunksRef.current = []; // Clear chunks ref
      setRecordingDuration(0);
      setRecordingSize(0);
      
      let stream = null;
      
      // Get the appropriate stream based on recording type
      if (recordingType === 'screen') {
        if (!selectedSource) {
          throw new Error('No recording source selected');
        }
        stream = await getScreenStream(selectedSource.id);
      } else if (recordingType === 'webcam') {
        stream = await getWebcamStream();
      } else if (recordingType === 'screen+webcam') {
        const screenStream = await getScreenStream(selectedSource.id);
        const webcamStream = await getWebcamStream();
        stream = combineStreams([screenStream, webcamStream]);
      }
      
      if (!stream) {
        throw new Error('Failed to get media stream');
      }
      
      // Create media recorder
      const mediaRecorder = createMediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });
      
      // Set up recording event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };
      
      mediaRecorder.onstop = async () => {
        // Get the current recorded chunks at the time of stopping
        const currentChunks = chunksRef.current;
        const blob = new Blob(currentChunks, { type: 'video/webm' });
        const filename = generateRecordingFilename('recording', 'webm');
        
        try {
          // Extract duration from the blob using the existing video system
          console.log('🎥 useRecording: Extracting duration from recorded blob...');
          console.log('🎥 useRecording: Blob details:', {
            size: blob.size,
            type: blob.type,
            blobURL: URL.createObjectURL(blob)
          });
          
          const duration = await extractDurationFromFile(blob);
          console.log('🎥 useRecording: Extracted duration:', duration);
          console.log('🎥 useRecording: Duration type:', typeof duration);
          console.log('🎥 useRecording: Is finite:', isFinite(duration));
          
          // Convert to video file format with extracted duration
          const videoFile = blobToVideoFile(blob, filename);
          videoFile.duration = duration; // Override with extracted duration
          
          // Set the completed recording for useEffect to handle
          setCompletedRecording(videoFile);
        } catch (error) {
          console.error('🎥 useRecording: Failed to extract duration:', error);
          
          // Still create the video file but with duration 0
          const videoFile = blobToVideoFile(blob, filename);
          setCompletedRecording(videoFile);
        }
        
        // Clean up
        stopStream(stream);
        setCurrentStream(null);
        setRecordedChunks([]); // Clear chunks
        chunksRef.current = []; // Clear ref
      };
      
      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      
      // Store references for cleanup
      setCurrentStream(stream);
      setRecorder(mediaRecorder);
      recorderRef.current = mediaRecorder;
      streamRef.current = stream;
      
      // Start duration timer
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      setIsRecording(true);
      
    } catch (err) {
      console.error('🎥 useRecording: Start recording error:', err);
      setError(err.message);
      
      // Clean up on error
      if (streamRef.current) {
        stopStream(streamRef.current);
        streamRef.current = null;
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedSource, onRecordingComplete]);

  // Stop recording
  const stopRecording = useCallback(() => {
    try {
      if (recorderRef.current && recorderRef.current.state === 'recording') {
        recorderRef.current.stop();
      }
      
      // Clear duration timer
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
      
      setIsRecording(false);
      setRecordingDuration(0);
      
    } catch (err) {
      console.error('🎥 useRecording: Stop recording error:', err);
      setError(err.message);
    }
  }, []);

  // Cancel recording
  const cancelRecording = useCallback(() => {
    try {
      // Stop the recorder
      if (recorderRef.current && recorderRef.current.state === 'recording') {
        recorderRef.current.stop();
      }
      
      // Stop the stream
      if (streamRef.current) {
        stopStream(streamRef.current);
        streamRef.current = null;
      }
      
      // Clear duration timer
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
      
      // Reset state
      setIsRecording(false);
      setRecordingDuration(0);
      setRecordedChunks([]);
      setCurrentStream(null);
      setRecorder(null);
      
    } catch (err) {
      console.error('🎥 useRecording: Cancel recording error:', err);
      setError(err.message);
    }
  }, []);

  // Download current recording
  const downloadRecording = useCallback(() => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const filename = generateRecordingFilename('recording', 'webm');
      downloadBlob(blob, filename);
    }
  }, [recordedChunks]);

  // Update recording size when chunks change
  useEffect(() => {
    if (recordedChunks.length > 0) {
      const totalSize = recordedChunks.reduce((acc, chunk) => acc + chunk.size, 0);
      setRecordingSize(totalSize);
    }
  }, [recordedChunks]);

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
      
      // Stop and clean up stream
      if (streamRef.current) {
        stopStream(streamRef.current);
      }
      
      // Stop recorder
      if (recorderRef.current && recorderRef.current.state === 'recording') {
        recorderRef.current.stop();
      }
    };
  }, []);

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
    currentStream,
    completedRecording,
    
    // Formatted values
    formattedDuration,
    formattedSize,
    
    // Actions
    loadSources,
    startRecording,
    stopRecording,
    cancelRecording,
    downloadRecording,
    setSelectedSource,
    clearError: () => setError(null)
  };
};

export default useRecording;
