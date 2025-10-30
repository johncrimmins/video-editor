import React, { createContext, useContext, useMemo } from 'react';
import { useRecording } from '../shared/hooks';

/**
 * RecordingContext - Centralized state management for recording functionality
 * Provides recording state and actions to all recording-related components
 * Eliminates prop drilling and improves performance with memoized values
 */
const RecordingContext = createContext();

/**
 * RecordingProvider - Context provider for recording state
 * Wraps the useRecording hook and provides memoized context values
 */
export const RecordingProvider = ({ children, onRecordingComplete = null }) => {
  const recordingHook = useRecording(onRecordingComplete);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    // State
    isRecording: recordingHook.isRecording,
    isLoading: recordingHook.isLoading,
    error: recordingHook.error,
    recordingDuration: recordingHook.recordingDuration,
    recordingSize: recordingHook.recordingSize,
    sources: recordingHook.sources,
    selectedSource: recordingHook.selectedSource,
    currentStream: recordingHook.currentStream,
    completedRecording: recordingHook.completedRecording,
    
    // Formatted values
    formattedDuration: recordingHook.formattedDuration,
    formattedSize: recordingHook.formattedSize,
    
    // Actions
    loadSources: recordingHook.loadSources,
    startRecording: recordingHook.startRecording,
    stopRecording: recordingHook.stopRecording,
    cancelRecording: recordingHook.cancelRecording,
    setSelectedSource: recordingHook.setSelectedSource,
    clearError: recordingHook.clearError
  }), [
    recordingHook.isRecording,
    recordingHook.isLoading,
    recordingHook.error,
    recordingHook.recordingDuration,
    recordingHook.recordingSize,
    recordingHook.sources,
    recordingHook.selectedSource,
    recordingHook.currentStream,
    recordingHook.completedRecording,
    recordingHook.formattedDuration,
    recordingHook.formattedSize,
    recordingHook.loadSources,
    recordingHook.startRecording,
    recordingHook.stopRecording,
    recordingHook.cancelRecording,
    recordingHook.setSelectedSource,
    recordingHook.clearError
  ]);

  return (
    <RecordingContext.Provider value={contextValue}>
      {children}
    </RecordingContext.Provider>
  );
};

/**
 * useRecordingContext - Hook to access recording context
 * Provides type safety and ensures context is used within provider
 */
export const useRecordingContext = () => {
  const context = useContext(RecordingContext);
  if (!context) {
    throw new Error('useRecordingContext must be used within a RecordingProvider');
  }
  return context;
};

export default RecordingContext;
