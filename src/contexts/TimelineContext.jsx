import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import useTimeline from '../screens/TimelineScreen/hooks/useTimeline';
import useTrim from '../screens/TimelineScreen/hooks/useTrim';

const TimelineContext = createContext();

export function TimelineProvider({ children, videoFile }) {
  const { trimPoints, updateTrimPoint } = useTimeline(videoFile);
  const { applyTrim } = useTrim(videoFile, trimPoints);
  const [currentVideoFile, setCurrentVideoFile] = useState(videoFile);
  
  const handleApplyTrim = useCallback(async () => {
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
    } catch (error) {
      console.error('TimelineContext: ApplyTrim error:', error);
      throw error;
    }
  }, [applyTrim, currentVideoFile]);
  
  const handleDeleteClip = useCallback(() => {
    setCurrentVideoFile(null);
  }, []);
  
  const value = useMemo(() => ({
    videoFile: currentVideoFile,
    trimPoints,
    updateTrimPoint,
    handleApplyTrim,
    handleDeleteClip,
    setCurrentVideoFile
  }), [currentVideoFile, trimPoints, updateTrimPoint, handleApplyTrim, handleDeleteClip]);
  
  return (
    <TimelineContext.Provider value={value}>
      {children}
    </TimelineContext.Provider>
  );
}

export function useTimelineContext() {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error('useTimelineContext must be used within TimelineProvider');
  }
  return context;
}
