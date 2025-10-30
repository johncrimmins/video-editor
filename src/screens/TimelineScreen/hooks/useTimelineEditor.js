import { useState, useCallback, useMemo } from 'react';
import useTimeline from './useTimeline';
import useTrim from './useTrim';

/**
 * Unified hook for timeline editor functionality
 * Consolidates timeline state management and actions
 */
const useTimelineEditor = (videoFile) => {
  const { trimPoints, updateTrimPoint } = useTimeline(videoFile);
  const { applyTrim } = useTrim(videoFile, trimPoints);
  const [currentVideoFile, setCurrentVideoFile] = useState(videoFile);
  const [isTrimming, setIsTrimming] = useState(false);
  
  const handleApplyTrim = useCallback(async () => {
    setIsTrimming(true);
    try {
      const result = await applyTrim();
      if (result.outputPath) {
        setCurrentVideoFile({
          ...currentVideoFile,
          path: result.outputPath,
          name: result.outputPath.split('/').pop()
        });
      }
      return result;
    } finally {
      setIsTrimming(false);
    }
  }, [applyTrim, currentVideoFile]);
  
  const handleDeleteClip = useCallback(() => {
    setCurrentVideoFile(null);
  }, []);
  
  // Memoized state object to prevent unnecessary re-renders
  const timelineState = useMemo(() => ({
    videoFile: currentVideoFile,
    trimPoints,
    isTrimming,
    hasVideo: !!currentVideoFile
  }), [currentVideoFile, trimPoints, isTrimming]);
  
  // Memoized actions object to prevent unnecessary re-renders
  const timelineActions = useMemo(() => ({
    updateTrimPoint,
    handleApplyTrim,
    handleDeleteClip
  }), [updateTrimPoint, handleApplyTrim, handleDeleteClip]);
  
  return {
    ...timelineState,
    ...timelineActions
  };
};

export default useTimelineEditor;
